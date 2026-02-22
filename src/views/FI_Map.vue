<template>
<div class="wrap">
	<div class="controls">
		<div class="flex">
			<label class="btn">
				Upload
				<input accept="image/*"
					hidden
					type="file"
					@change="onUpload"
				/>
			</label>

			<label>
				Karten meiner Reise
				<select v-model="selectedAssetKey" :disabled="assetKeys.length === 0" @change="loadSelectedAsset">
					<option disabled value="">– auswählen –</option>
					<option v-for="k in assetKeys" :key="k" :value="k">
						{{ prettyAssetName(k) }}
					</option>
				</select>
			</label>

			<label>
				Konforme Verzerrung
				<select v-model="mapName">
					<option value="identity">Identität</option>
					<option value="powerN">z ↦ z^n (stark, „Wickeln“)</option>
					<option value="expScaled">z ↦ exp(k·z) (radial/extrem)</option>
					<option value="sinScaled">z ↦ sin(k·z) (wellenartig, wild)</option>
					<option value="mobius">Möbius (Kreise↔Geraden, „Sog“)</option>
					<option value="joukowski">Joukowski z + 1/z (Airfoil-Look)</option>
					<option value="weierstrass">Weierstrass-artig: z + a·sin(z) (noch holomorph)</option>
				</select>
			</label>

			<label>
				Ausgabegröße
				<select v-model.number="outSize">
					<option :value="512">512×512</option>
					<option :value="768">768×768</option>
					<option :value="1024">1024×1024</option>
				</select>
			</label>

			<label>
				Zoom (Fenster)
				<input v-model.number="viewZoom"
					max="6"
					min="0.15"
					step="0.01"
					type="range"
				/>
				<span class="mono">{{ viewZoom.toFixed(2) }}</span>
			</label>

			<label>
				Center X
				<input v-model.number="cx"
					max="3"
					min="-3"
					step="0.001"
					type="range"
				/>
				<span class="mono">{{ cx.toFixed(3) }}</span>
			</label>

			<label>
				Center Y
				<input v-model.number="cy"
					max="3"
					min="-3"
					step="0.001"
					type="range"
				/>
				<span class="mono">{{ cy.toFixed(3) }}</span>
			</label>

			<!-- Map parameters -->
			<template v-if="mapName === 'powerN'">
				<label>
					n
					<input v-model.number="powN"
						max="8"
						min="2"
						step="1"
						type="range"
					/>
					<span class="mono">{{ powN }}</span>
				</label>
			</template>

			<template v-if="mapName === 'expScaled' || mapName === 'sinScaled' || mapName === 'weierstrass'">
				<label>
					k
					<input v-model.number="k"
						max="3"
						min="0.2"
						step="0.01"
						type="range"
					/>
					<span class="mono">{{ k.toFixed(2) }}</span>
				</label>
			</template>

			<template v-if="mapName === 'weierstrass'">
				<label>
					a
					<input v-model.number="aParam"
						max="1.5"
						min="0"
						step="0.01"
						type="range"
					/>
					<span class="mono">{{ aParam.toFixed(2) }}</span>
				</label>
			</template>

			<details v-if="mapName === 'mobius'" class="mobius">
				<summary>Möbius-Parameter (komplex)</summary>
				<div class="grid">
					<div class="row">
						<strong>a</strong><span>re</span><input v-model.number="A.re" step="0.01" type="number" />
						<span>im</span><input v-model.number="A.im" step="0.01" type="number" />
					</div>
					<div class="row">
						<strong>b</strong><span>re</span><input v-model.number="B.re" step="0.01" type="number" />
						<span>im</span><input v-model.number="B.im" step="0.01" type="number" />
					</div>
					<div class="row">
						<strong>c</strong><span>re</span><input v-model.number="C.re" step="0.01" type="number" />
						<span>im</span><input v-model.number="C.im" step="0.01" type="number" />
					</div>
					<div class="row">
						<strong>d</strong><span>re</span><input v-model.number="D.re" step="0.01" type="number" />
						<span>im</span><input v-model.number="D.im" step="0.01" type="number" />
					</div>
				</div>
				<small class="hint">
					Konform (außer an Polstellen). Standard ist Identität: a=1, d=1, b=c=0.
					„Sog“: setze z.B. c.re=0.35.
				</small>
			</details>

			<label>
				Iterationen (für inverse)
				<input v-model.number="iters"
					max="25"
					min="0"
					step="1"
					type="range"
				/>
				<span class="mono">{{ iters }}</span>
			</label>
		</div>
		<button class="btn2 ma-2" :disabled="!hasImage" @click="render">Render</button>
		<button class="btn2 ma-2" :disabled="!hasImage" @click="resetView">Reset</button>
	</div>

	<div class="formulaCard">
		<div class="title">Aktive Abbildung</div>
		<Katex
			as="div"
			class="formulaKatex"
			:display="true"
			:tex="selectedFormulaTex"
		/>
	</div>

	<div class="canvases">
		<div class="pane">
			<div class="title">Quelle</div>
			<canvas ref="srcCanvas" class="canvas"></canvas>
		</div>
		<div class="pane">
			<div class="title">Konforme Verzerrung</div>
			<canvas ref="dstCanvas" class="canvas"></canvas>
		</div>
	</div>

	<p class="note">
		Die Verzerrungen sind <em>winkeltreu</em>, weil sie aus holomorphen Funktionen bestehen.
		Singularitäten/Kritische Punkte (z.B. bei <span class="mono">1/z</span>, oder <span class="mono">f'(z)=0</span>) können lokal „ausfressen“ –
		deshalb ist das Ergebnis bewusst dramatisch.
	</p>
</div>
</template>

<script setup lang="ts">
import {
	computed, onMounted, reactive, ref, watch
} from "vue";

/**
 * Assets aus dem Projekt:
 * Lege Bilder z.B. in /src/assets/maps/ ab.
 * Vite macht daraus URLs.
 */
const assetModules = import.meta.glob( "../images/FI_*.webp", {
	eager:  true,
	import: "default"
} ) as Record<string, string>;

const assetKeys = Object.keys( assetModules ).sort();
const selectedAssetKey = ref<string>( "" );

/** ---------- Complex minimal ---------- */
type Complex = { re: number; im: number };
const cAdd = ( x: Complex, y: Complex ): Complex => ( { re: x.re + y.re, im: x.im + y.im } );
const cSub = ( x: Complex, y: Complex ): Complex => ( { re: x.re - y.re, im: x.im - y.im } );
const cMul = ( x: Complex, y: Complex ): Complex => (
	{ re: x.re * y.re - x.im * y.im, im: x.re * y.im + x.im * y.re } );
const cAbs = ( x: Complex ) => Math.hypot( x.re, x.im );
const cArg = ( x: Complex ) => Math.atan2( x.im, x.re );

const cDiv = ( x: Complex, y: Complex ): Complex => {
	const den = y.re * y.re + y.im * y.im || 1e-12;
	return { re: ( x.re * y.re + x.im * y.im ) / den, im: ( x.im * y.re - x.re * y.im ) / den };
};

const cExp = ( z: Complex ): Complex => {
	const ez = Math.exp( z.re );
	return { re: ez * Math.cos( z.im ), im: ez * Math.sin( z.im ) };
};

const cLogPrincipal = ( w: Complex ): Complex => ( { re: Math.log( Math.max( cAbs( w ), 1e-12 ) ), im: cArg( w ) } );

const cPowN = ( z: Complex, n: number ): Complex => {
	// polar power
	const r = cAbs( z );
	const t = cArg( z );
	const rn = Math.pow( r, n );
	return { re: rn * Math.cos( n * t ), im: rn * Math.sin( n * t ) };
};

const cSin = ( z: Complex ): Complex => {
	// sin(x+iy)=sin x cosh y + i cos x sinh y
	const x = z.re, y = z.im;
	return { re: Math.sin( x ) * Math.cosh( y ), im: Math.cos( x ) * Math.sinh( y ) };
};

const cCos = ( z: Complex ): Complex => {
	// cos(x+iy)=cos x cosh y - i sin x sinh y
	const x = z.re, y = z.im;
	return { re: Math.cos( x ) * Math.cosh( y ), im: -Math.sin( x ) * Math.sinh( y ) };
};

const cInv = ( z: Complex ): Complex => cDiv( { re: 1, im: 0 }, z );

function prettyAssetName( k: string ) {
	const parts = k.split( "/" );
	return parts[ parts.length - 1 ];
}

/** ---------- UI state ---------- */
type MapName = "identity" | "powerN" | "expScaled" | "sinScaled" | "mobius" | "joukowski" | "weierstrass";
const mapName = ref<MapName>( "powerN" );

const outSize = ref( 768 );

// View window for destination plane
const viewZoom = ref( 1.1 );
const cx = ref( 0.0 );
const cy = ref( 0.0 );

// Map parameters
const powN = ref( 3 );
const k = ref( 1.0 );
const aParam = ref( 0.6 );

// Möbius
const A = reactive<Complex>( { re: 1, im: 0 } );
const B = reactive<Complex>( { re: 0, im: 0 } );
const C = reactive<Complex>( { re: 0.35, im: 0 } ); // default: a little “sog”
const D = reactive<Complex>( { re: 1, im: 0 } );

const fmt = ( value: number, digits = 2 ) => Number( value.toFixed( digits ) ).toString();

const fmtComplex = ( z: Complex, digits = 2 ) => {
	const re = fmt( z.re, digits );
	const imAbs = fmt( Math.abs( z.im ), digits );
	const sign = z.im >= 0 ? "+" : "-";
	return `${re}${sign}${imAbs}i`;
};

const selectedFormulaTex = computed( () => {
	switch ( mapName.value ) {
		case "identity":
			return String.raw`f(z)=z`;

		case "powerN":
			return String.raw`f(z)=z^{n}\quad\left(n=${powN.value}\right)`;

		case "expScaled":
			return String.raw`f(z)=\exp\!\left(kz\right)\quad\left(k=${fmt( k.value )}\right)`;

		case "sinScaled":
			return String.raw`f(z)=\sin\!\left(kz\right)\quad\left(k=${fmt( k.value )}\right)`;

		case "mobius": {
			const aTex = fmtComplex( A );
			const bTex = fmtComplex( B );
			const cTex = fmtComplex( C );
			const dTex = fmtComplex( D );
			const numerator = String.raw`\left(${aTex}\right)z+\left(${bTex}\right)`;
			const denominator = String.raw`\left(${cTex}\right)z+\left(${dTex}\right)`;
			return String.raw`f(z)=\frac{${numerator}}{${denominator}}`;
		}

		case "joukowski":
			return String.raw`f(z)=z+\frac{1}{z}`;

		case "weierstrass":
			return String.raw`f(z)=z+a\sin\!\left(kz\right)\quad\left(a=${fmt( aParam.value )},\;k=${
				fmt( k.value )
			}\right)`;

		default:
			return String.raw`f(z)=z`;
	}
} );

// Inversion iterations (Newton)
const iters = ref( 10 );

const srcCanvas = ref<HTMLCanvasElement | null>( null );
const dstCanvas = ref<HTMLCanvasElement | null>( null );

const hasImage = ref( false );
let srcImgData: ImageData | null = null;

/** ---------- Image load helpers ---------- */
async function loadImageUrl( url: string ) {
	const img = new Image();
	img.crossOrigin = "anonymous";
	await new Promise<void>( ( resolve, reject ) => {
		img.onload = () => resolve();
		img.onerror = () => reject( new Error( "Bild konnte nicht geladen werden." ) );
		img.src = url;
	} );

	const sc = srcCanvas.value!;
	const sctx = sc.getContext( "2d", { willReadFrequently: true } )!;

	// begrenzen für Performance
	const maxW = 1600;
	const scale = Math.min( 1, maxW / img.width );
	const w = Math.max( 1, Math.round( img.width * scale ) );
	const h = Math.max( 1, Math.round( img.height * scale ) );

	sc.width = w;
	sc.height = h;
	sctx.clearRect(
		0, 0, w, h
	);
	sctx.drawImage(
		img, 0, 0, w, h
	);

	srcImgData = sctx.getImageData(
		0, 0, w, h
	);
	hasImage.value = true;
	render();
}

async function loadSelectedAsset() {
	if ( !selectedAssetKey.value ) {
		return;
	}

	const url = assetModules[ selectedAssetKey.value ];

	if ( !url ) {
		return;
	}

	await loadImageUrl( url );
}

async function onUpload( ev: Event ) {
	const input = ev.target as HTMLInputElement;
	const file = input.files?.[ 0 ];

	if ( !file ) {
		return;
	}

	const url = URL.createObjectURL( file );

	try {
		await loadImageUrl( url );
	} finally {
		URL.revokeObjectURL( url );
	}
}

/** ---------- Sampling (bilinear) ---------- */
function sampleBilinear(
	img: ImageData, x: number, y: number
): [number, number, number, number] {
	const w = img.width;
	const h = img.height;

	if ( x < 0 || y < 0 || x >= w - 1 || y >= h - 1 ) {
		return [ 0, 0, 0, 0 ];
	}

	const x0 = Math.floor( x ), y0 = Math.floor( y );
	const x1 = x0 + 1, y1 = y0 + 1;
	const dx = x - x0, dy = y - y0;

	const i00 = ( y0 * w + x0 ) * 4;
	const i10 = ( y0 * w + x1 ) * 4;
	const i01 = ( y1 * w + x0 ) * 4;
	const i11 = ( y1 * w + x1 ) * 4;

	const d = img.data;
	const lerp = (
		a: number, b: number, t: number
	) => a + ( b - a ) * t;

	const out = [ 0, 0, 0, 0 ] as number[];

	for ( let ch = 0; ch < 4; ch++ ) {
		const v00 = d[ i00 + ch ], v10 = d[ i10 + ch ], v01 = d[ i01 + ch ], v11 = d[ i11 + ch ];
		const v0 = lerp(
			v00, v10, dx
		);
		const v1 = lerp(
			v01, v11, dx
		);
		out[ ch ] = lerp(
			v0, v1, dy
		);
	}

	return out as [number, number, number, number];
}

/** ---------- Plane ↔ pixel mapping ---------- */
function dstPixelToPlane(
	i: number, j: number, W: number, H: number
): Complex {
	const aspect = W / H;
	const x = ( i + 0.5 ) / W * 2 - 1;
	const y = ( j + 0.5 ) / H * 2 - 1;
	return {
		re: x * aspect / viewZoom.value + cx.value,
		im: y / viewZoom.value - cy.value
	};
}

function planeToSrcPixel(
	z: Complex, srcW: number, srcH: number
): { x: number; y: number } {
	// interpret source image as texture over rectangle in plane:
	// z.re in [-aspect, aspect], z.im in [-1,1]
	const aspect = srcW / srcH;
	const xNorm = z.re / aspect; // -> [-1,1]
	const yNorm = z.im;

	const x = ( xNorm + 1 ) * 0.5 * srcW - 0.5;
	const y = ( 1 - ( yNorm + 1 ) * 0.5 ) * srcH - 0.5;
	return { x, y };
}

/** ---------- Holomorphic maps f(z) and derivative f'(z) ---------- */
function f( z: Complex ): Complex {
	switch ( mapName.value ) {
		case "identity":
			return z;

		case "powerN":
			return cPowN( z, powN.value );

		case "expScaled":
			return cExp( { re: k.value * z.re, im: k.value * z.im } );

		case "sinScaled": {
			const zk = { re: k.value * z.re, im: k.value * z.im };
			return cSin( zk );
		}

		case "mobius":
			// (A z + B)/(C z + D)
			return cDiv( cAdd( cMul( A, z ), B ), cAdd( cMul( C, z ), D ) );

		case "joukowski":
			// z + 1/z  (konform außer bei z=0)
			return cAdd( z, cInv( z ) );

		case "weierstrass": {
			// z + a*sin(k z)
			const zk = { re: k.value * z.re, im: k.value * z.im };
			return cAdd( z, { re: aParam.value * cSin( zk ).re, im: aParam.value * cSin( zk ).im } );
		}
	}
}

function fp( z: Complex ): Complex {
	switch ( mapName.value ) {
		case "identity":
			return { re: 1, im: 0 };

		case "powerN": {
			// n*z^(n-1)
			const n = powN.value;
			const zn1 = cPowN( z, n - 1 );
			return { re: n * zn1.re, im: n * zn1.im };
		}

		case "expScaled": {
			// d/dz exp(kz) = k exp(kz)
			const ek = cExp( { re: k.value * z.re, im: k.value * z.im } );
			return { re: k.value * ek.re, im: k.value * ek.im };
		}

		case "sinScaled": {
			// d/dz sin(kz) = k cos(kz)
			const zk = { re: k.value * z.re, im: k.value * z.im };
			const ck = cCos( zk );
			return { re: k.value * ck.re, im: k.value * ck.im };
		}

		case "mobius": {
			// f'(z) = (AD-BC)/(Cz + D)^2
			const AD = cMul( A, D );
			const BC = cMul( B, C );
			const num = cSub( AD, BC );
			const den = cMul( cAdd( cMul( C, z ), D ), cAdd( cMul( C, z ), D ) ); // (Cz+D)^2
			return cDiv( num, den );
		}

		case "joukowski": {
			// d/dz (z + 1/z) = 1 - 1/z^2
			const z2 = cMul( z, z );
			const invz2 = cInv( z2 );
			return cSub( { re: 1, im: 0 }, invz2 );
		}

		case "weierstrass": {
			// d/dz (z + a*sin(kz)) = 1 + a*k*cos(kz)
			const zk = { re: k.value * z.re, im: k.value * z.im };
			const ck = cCos( zk );
			return cAdd( { re: 1, im: 0 }, { re: aParam.value * k.value * ck.re, im: aParam.value * k.value * ck.im } );
		}
	}
}

/** ---------- Inverse via Newton (for each destination pixel) ----------
 * We need z such that f(z) = w. Newton in complex form:
 * z_{n+1} = z_n - (f(z_n)-w)/f'(z_n)
 */
function inverseNewton(
	w: Complex, z0: Complex, steps: number
): Complex | null {
	let z = { ...z0 };

	for ( let i = 0; i < steps; i++ ) {
		const F = f( z );
		const diff = cSub( F, w );
		const dF = fp( z );

		if ( cAbs( dF ) < 1e-10 ) {
			return null;
		} // critical point -> unstable

		const step = cDiv( diff, dF );
		z = cSub( z, step );

		// early exit if close
		if ( cAbs( step ) < 1e-4 ) {
			break;
		}
	}

	return z;
}

const usesClosedFormInverse = computed( () => mapName.value === "identity" || mapName.value === "powerN" );

function inverseFast( w: Complex ): Complex | null {
	if ( mapName.value === "identity" ) {
		return w;
	}

	if ( mapName.value === "powerN" ) {
		// principal inverse of z^n: z = r^(1/n) * exp(i * theta/n)
		const n = powN.value;
		const r = cAbs( w );
		const t = cArg( w );
		const rn = Math.pow( r, 1 / n );
		return { re: rn * Math.cos( t / n ), im: rn * Math.sin( t / n ) };
	}

	// otherwise Newton
	return null;
}

/** ---------- Render ---------- */
function render() {
	if ( !srcImgData || !dstCanvas.value ) {
		return;
	}

	const dst = dstCanvas.value;
	const ctx = dst.getContext( "2d", { willReadFrequently: true } )!;
	const W = outSize.value, H = outSize.value;
	dst.width = W;
	dst.height = H;

	const out = ctx.createImageData( W, H );
	const srcW = srcImgData.width, srcH = srcImgData.height;

	for ( let j = 0; j < H; j++ ) {
		for ( let i = 0; i < W; i++ ) {
			const idx = ( j * W + i ) * 4;
			const w = dstPixelToPlane(
				i, j, W, H
			);

			// Inverse: find z with f(z)=w
			let z: Complex | null = inverseFast( w );

			if ( !z ) {
				// start guess: w itself (often good if distortion not insane)
				z = inverseNewton(
					w, w, iters.value
				);
			}

			if ( !z ) {
				out.data[ idx + 3 ] = 0;
				continue;
			}

			// Map z -> source texture coords and sample
			const p = planeToSrcPixel(
				z, srcW, srcH
			);
			const [ r, g, b2, a2 ] = sampleBilinear(
				srcImgData, p.x, p.y
			);
			out.data[ idx + 0 ] = r;
			out.data[ idx + 1 ] = g;
			out.data[ idx + 2 ] = b2;
			out.data[ idx + 3 ] = a2;
		}
	}

	ctx.putImageData(
		out, 0, 0
	);
}

function resetView() {
	mapName.value = "powerN";
	powN.value = 3;
	k.value = 1.0;
	aParam.value = 0.6;

	viewZoom.value = 1.1;
	cx.value = 0;
	cy.value = 0;

	outSize.value = 768;
	iters.value = 10;

	A.re = 1; A.im = 0;
	B.re = 0; B.im = 0;
	C.re = 0.35; C.im = 0;
	D.re = 1; D.im = 0;

	if ( hasImage.value ) {
		render();
	}
}

onMounted( async() => {
	// canvas init
	if ( srcCanvas.value ) {
		srcCanvas.value.width = 640;
		srcCanvas.value.height = 360;
		srcCanvas.value.getContext( "2d" )?.clearRect(
			0, 0, 640, 360
		);
	}

	if ( dstCanvas.value ) {
		dstCanvas.value.width = outSize.value;
		dstCanvas.value.height = outSize.value;
		dstCanvas.value.getContext( "2d" )?.clearRect(
			0, 0, outSize.value, outSize.value
		);
	}

	// auto-load first asset if present
	if ( assetKeys.length > 0 ) {
		selectedAssetKey.value = assetKeys[ 0 ];
		await loadSelectedAsset();
	}
} );

// rerender
watch( [ mapName, outSize, viewZoom, cx, cy, powN, k, aParam, iters ],
	() => {
		if ( hasImage.value ) {
			render();
		}
	} );

watch( () => [ A.re, A.im, B.re, B.im, C.re, C.im, D.re, D.im ],
	() => {
		if ( hasImage.value && mapName.value === "mobius" ) {
			render();
		}
	} );
</script>

<style scoped>
.wrap {
  --fi-surface: rgb(var(--v-theme-surface, 255, 255, 255));
  --fi-on-surface: rgb(var(--v-theme-on-surface, 17, 17, 17));
  --fi-outline: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.16);
  --fi-outline-strong: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.26);
  --fi-muted: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.75);
  --fi-primary: rgb(var(--v-theme-primary, 25, 118, 210));
  --fi-on-primary: rgb(var(--v-theme-on-primary, 255, 255, 255));
  --fi-panel: rgba(var(--v-theme-surface, 255, 255, 255), 0.86);
  --fi-canvas: rgba(var(--v-theme-surface, 255, 255, 255), 0.97);

  display: grid;
  gap: 12px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  color: var(--fi-on-surface);
}

.flex {
    display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  align-items: center;
}
.controls {
  padding: 12px;
  border: 1px solid var(--fi-outline);
  border-radius: 12px;
  background: var(--fi-panel);
}

.controls label {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.controls select,
.controls input[type="number"] {
  padding: 4px 8px;
  border: 1px solid var(--fi-outline);
  border-radius: 8px;
  background: var(--fi-surface);
  color: var(--fi-on-surface);
}

.controls input[type="range"] {
  width: 220px;
  accent-color: var(--fi-primary);
}

.btn,
.btn2 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: filter 0.2s ease;
}

.btn {
  border: 1px solid var(--fi-outline-strong);
  background: var(--fi-surface);
  color: var(--fi-on-surface);
}

.btn2 {
  border: 1px solid rgba(var(--v-theme-primary, 25, 118, 210), 0.38);
  background: var(--fi-primary);
  color: var(--fi-on-primary);
}

.btn:hover,
.btn2:hover {
  filter: brightness(0.96);
}

.btn2:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.formulaCard {
  border: 1px solid var(--fi-outline);
  border-radius: 12px;
  padding: 10px 12px;
  background: var(--fi-panel);
  display: grid;
  gap: 6px;
}

.formulaKatex {
  overflow-x: auto;
  padding-bottom: 2px;
}

.canvases {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.pane {
  border: 1px solid var(--fi-outline);
  border-radius: 12px;
  padding: 10px;
  display: grid;
  gap: 8px;
  background: var(--fi-panel);
}

.title {
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface, 17, 17, 17), 0.9);
}

.canvas {
  width: 100%;
  height: auto;
  border-radius: 10px;
  background: var(--fi-canvas);
  border: 1px solid var(--fi-outline);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  opacity: 0.9;
}

.mobius { width: 100%; }
.grid { display: grid; gap: 8px; margin-top: 8px; }
.row {
  display: grid;
  grid-template-columns: 18px 22px 1fr 22px 1fr;
  gap: 6px;
  align-items: center;
}

.hint, .note {
  color: var(--fi-muted);
  margin: 0;
}

@media (max-width: 960px) {
  .canvases {
    grid-template-columns: 1fr;
  }
}
</style>
