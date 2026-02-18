declare module "pokersolver" {
	interface SolvedHand {
		name?: string;
		descr?: string;
		cards?: unknown[];
		[key: string]: unknown;
	}

	interface HandApi {
		solve( cards: unknown, game?: unknown ): SolvedHand;
		winners( hands: SolvedHand[] ): SolvedHand[];
	}

	interface PokerSolverApi {
		Hand: HandApi;
		[key: string]: unknown;
	}

	const PokerSolver: PokerSolverApi;
	export default PokerSolver;
}
