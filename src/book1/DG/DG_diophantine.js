export function gcd( a, b ) {
	a = Math.abs( a );
	b = Math.abs( b );

	while ( b !== 0 ) {
		const t = a % b;
		a = b;
		b = t;
	}

	return a;
}

// Extended Euclid: returns {g, x, y, steps}
// steps is an array of objects for UI explanation.
export function egcdWithSteps( a, b ) {
	let old_r = a;
	let r = b;
	let old_s = 1;
	let s = 0;
	let old_t = 0;
	let t = 1;

	const steps = [];
	steps.push( {
		q: null, old_r, r, old_s, s, old_t, t
	} );

	while ( r !== 0 ) {
		const q = Math.trunc( old_r / r );
		const new_r = old_r - q * r;
		const new_s = old_s - q * s;
		const new_t = old_t - q * t;

		steps.push( {
			q,
			old_r,
			r,
			old_s,
			s,
			old_t,
			t,
			new_r,
			new_s,
			new_t
		} )

		;[ old_r, r ] = [ r, new_r ]
		;[ old_s, s ] = [ s, new_s ]
		;[ old_t, t ] = [ t, new_t ];
	}

	return {
		g: old_r, x: old_s, y: old_t, steps
	};
}

export function parseIntStrict( v ) {
	const s = String( v ).trim();

	if ( !/^[-+]?\d+$/.test( s ) ) {
		return null;
	}

	const n = Number( s );

	if ( !Number.isSafeInteger( n ) ) {
		return null;
	}

	return n;
}

export function fmt( n ) {
	return n < 0 ? `(${n})` : `${n}`;
}
