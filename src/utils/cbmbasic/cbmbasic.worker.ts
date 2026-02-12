/// <reference lib="webworker" />
export {};

type EmscriptenModule = {
	FS: {
		writeFile: ( path: string, data: string | Uint8Array, opts?: { encoding?: string } ) => void;
		unlink: ( path: string ) => void;
	};
	callMain: ( args: string[] ) => unknown;
	Asyncify?: {
		handleSleep: ( startAsync: ( wakeUp: ( value: number ) => void ) => void ) => number;
		whenDone: () => Promise<unknown>;
		state: number;
		State: {
			Normal: number;
			Unwinding: number;
			Rewinding: number;
			Disabled: number;
		};
		instrumentWasmImports?: ( imports: Record<string, unknown> ) => unknown;
	};
};

type InitMessage = {
	type: "init";
	factoryUrl: string;
	wasmBaseUrl: string;
	wasmFileUrl: string;
};

type RunMessage = {
	type: "run";
	source: string;
	stdinBytes: number[];
};

type StdinMessage = {
	type: "stdin";
	stdinBytes: number[];
};

type IncomingMessage = InitMessage | RunMessage | StdinMessage;

let mod: EmscriptenModule | null = null;
let busy = false;
let outputBuffer: number[] = [];
let stdinBuffer: number[] = [];
let stdinIndex = 0;
let inputRequestedNotified = false;
let pendingStdinWakeUp: ( ( value: number ) => void ) | null = null;
let liveInputSupported = false;

function formatError( error: unknown ): string {
	if ( error instanceof Error ) {
		return error.message || error.name;
	}

	if ( typeof error === "string" ) {
		return error;
	}

	try {
		return JSON.stringify(
			error, null, 2
		);
	} catch {
		return String( error );
	}
}

function postOutput() {
	if ( outputBuffer.length === 0 ) {
		return;
	}

	self.postMessage( {
		type:  "output",
		bytes: outputBuffer
	} );
	outputBuffer = [];
}

function stdoutPutChar( c: number ) {
	outputBuffer.push( c & 0xff );

	if ( outputBuffer.length >= 256 ) {
		postOutput();
	}
}

function stderrPutChar( c: number ) {
	stdoutPutChar( c );
}

function stdinGetChar(): number | null {
	if ( stdinIndex >= stdinBuffer.length ) {
		if ( busy ) {
			if ( liveInputSupported && !inputRequestedNotified ) {
				self.postMessage( { type: "input-requested" } );
				inputRequestedNotified = true;
			}

			const asyncify = mod?.Asyncify;

			if ( liveInputSupported && asyncify ) {
				if ( asyncify.state === asyncify.State.Unwinding ) {
					return null;
				}

				if ( asyncify.state === asyncify.State.Rewinding ) {
					return asyncify.handleSleep( () => {
						// Asyncify rewind completion path.
					} );
				}

				return asyncify.handleSleep( ( wakeUp ) => {
					pendingStdinWakeUp = wakeUp;
				} );
			}
		}

		return null;
	}

	const value = stdinBuffer[ stdinIndex ];
	stdinIndex += 1;
	inputRequestedNotified = false;
	return value;
}

function normalizeStdinBytes( values: unknown ): number[] {
	if ( !Array.isArray( values ) ) {
		return [];
	}

	return values.map( ( value ) => Number( value ) & 0xff );
}

function detectLiveInputSupport( module: EmscriptenModule ): boolean {
	const asyncify = module.Asyncify;

	if ( !asyncify || typeof asyncify.handleSleep !== "function" ) {
		return false;
	}

	if ( typeof asyncify.instrumentWasmImports !== "function" ) {
		return false;
	}

	try {
		const marker = () => 1;
		( marker as unknown as { isAsync: boolean } ).isAsync = true;
		const imports = { marker };
		const instrumented = asyncify.instrumentWasmImports( imports ) as {
			marker?: unknown;
		} | undefined;
		const wrapped = instrumented?.marker ?? imports.marker;
		return typeof wrapped === "function" && wrapped !== marker;
	} catch {
		return false;
	}
}

function appendOrWakeStdin( bytes: number[] ) {
	if ( bytes.length === 0 ) {
		return;
	}

	if ( pendingStdinWakeUp ) {
		const wake = pendingStdinWakeUp;
		pendingStdinWakeUp = null;
		const [ first, ...rest ] = bytes;

		if ( rest.length > 0 ) {
			stdinBuffer.push( ...rest );
		}

		inputRequestedNotified = false;
		wake( first );
		return;
	}

	stdinBuffer.push( ...bytes );
	inputRequestedNotified = false;
}

async function initRuntime( msg: InitMessage ) {
	try {
		const factoryModule = await import(
			/* @vite-ignore */ msg.factoryUrl
		);
		const create = factoryModule?.default ?? factoryModule?.createCbmbasic;

		if ( typeof create !== "function" ) {
			throw new Error( "cbmbasic factory export not found." );
		}

		mod = await create( {
			noInitialRun: true,
			stdin:        stdinGetChar,
			stdout:       stdoutPutChar,
			stderr:       stderrPutChar,
			locateFile:   ( path: string ) => {
				if ( path === "cbmbasic.wasm" ) {
					return msg.wasmFileUrl;
				}

				const base = msg.wasmBaseUrl.endsWith( "/" ) ?
					msg.wasmBaseUrl :
					msg.wasmBaseUrl + "/";
				return base + path;
			}
		} );

			liveInputSupported = detectLiveInputSupport( mod );
			self.postMessage( {
				type:               "ready",
				liveInputSupported
			} );
	} catch ( error ) {
			self.postMessage( {
				type:    "error",
				message: `[init] ${formatError( error )}`
			} );
	}
}

async function runProgram( msg: RunMessage ) {
	if ( !mod ) {
		self.postMessage( {
			type:    "error",
			message: "cbmbasic runtime not initialized."
		} );
		return;
	}

	if ( busy ) {
		self.postMessage( {
			type:    "error",
			message: "A program is already running."
		} );
		return;
	}

	busy = true;
	self.postMessage( { type: "run-start" } );

	try {
		const path = "/program.bas";
		stdinBuffer = normalizeStdinBytes( msg.stdinBytes );
		stdinIndex = 0;
		inputRequestedNotified = false;
		pendingStdinWakeUp = null;

		try {
			mod.FS.unlink( path );
		} catch {
			// ignore: file does not exist yet
		}

		mod.FS.writeFile(
			path, msg.source, { encoding: "utf8" }
		);
		const maybePromise = mod.callMain( [ path ] );

		if ( maybePromise && typeof ( maybePromise as { then?: unknown } ).then === "function" ) {
			await ( maybePromise as Promise<unknown> );
		}

		const asyncify = mod.Asyncify;

		if ( liveInputSupported && asyncify &&
			( pendingStdinWakeUp !== null || asyncify.state !== asyncify.State.Normal ) ) {
			await asyncify.whenDone();
		}
	} catch ( error ) {
		self.postMessage( {
			type:    "error",
			message: `[run] ${formatError( error )}`
		} );
	} finally {
		stdinBuffer = [];
		stdinIndex = 0;
		inputRequestedNotified = false;
		pendingStdinWakeUp = null;
		postOutput();
		busy = false;
		self.postMessage( { type: "run-end" } );
	}
}

self.onmessage = ( event: MessageEvent<IncomingMessage> ) => {
	const msg = event.data;

	if ( !msg || typeof msg !== "object" || typeof msg.type !== "string" ) {
		return;
	}

	if ( msg.type === "init" ) {
		void initRuntime( msg );
		return;
	}

	if ( msg.type === "run" ) {
		void runProgram( msg );
		return;
	}

	if ( msg.type === "stdin" ) {
		appendOrWakeStdin( normalizeStdinBytes( msg.stdinBytes ) );
	}
};
