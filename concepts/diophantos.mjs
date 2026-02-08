#!/usr/bin/env node

/**
 * Löser für lineare diophantische Gleichungen a*x + b*y = c
 *
 * Aufruf:
 *   node diofantos.mjs a b c
 *
 * Es wird
 *   - eine konkrete Lösung (x0, y0)
 *   - die allgemeine Lösung in Parameterform
 *   - und anschließend alle Wertpaare für t > 0 mit x > 0 und y > 0
 *     ausgegeben (t = 1, 2, 3, ...).
 */

// --- Hilfsfunktionen ---

/**
 * Erweiterter euklidischer Algorithmus:
 * Liefert gcd(a,b) sowie x,y mit a*x + b*y = gcd(a,b).
 */
function extendedGcd(a, b) {
  let old_r = a, r = b;
  let old_s = 1, s = 0;
  let old_t = 0, t = 1;

  while (r !== 0) {
    const q = Math.trunc(old_r / r);

    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
    [old_t, t] = [t, old_t - q * t];
  }

  // old_r = gcd(a,b), old_s, old_t so dass a*old_s + b*old_t = old_r
  return { g: old_r, x: old_s, y: old_t };
}

/**
 * Ganzzahliges Parsen mit Fehlermeldung.
 */
function parseIntOrExit(value, name) {
  const n = Number(value);
  if (!Number.isInteger(n)) {
    console.error(`Fehler: ${name}="${value}" ist keine ganze Zahl.`);
    process.exit(1);
  }
  return n;
}

// --- CLI-Parsing ---

if (process.argv.length < 5) {
  console.log("Verwendung:");
  console.log("  node diofantos.mjs a b c");
  console.log("");
  console.log("Berechnet ganzzahlige Lösungen von a*x + b*y = c.");
  process.exit(0);
}

const a = parseIntOrExit(process.argv[2], "a");
const b = parseIntOrExit(process.argv[3], "b");
const c = parseIntOrExit(process.argv[4], "c");

// --- Sonderfälle: a == 0 oder b == 0 ---

function handleSpecialCases(a, b, c) {
  // a = 0, b = 0: 0*x + 0*y = c
  if (a === 0 && b === 0) {
    if (c === 0) {
      console.log("Unendlich viele Lösungen: jede (x,y) ∈ Z² erfüllt 0 = 0.");
    } else {
      console.log("Keine Lösung: 0*x + 0*y kann niemals", c, "sein.");
    }
    return true;
  }

  // a = 0: b*y = c  -> y = c / b, x frei
  if (a === 0) {
    if (c % b !== 0) {
      console.log("Keine Lösung: b*y = c hat keine ganzzahlige Lösung.");
      return true;
    }
    const y0 = c / b;
    console.log(`Unendlich viele Lösungen:`);
    console.log(`  y = ${y0} (fest)`);
    console.log(`  x = t, für alle t ∈ Z`);
    console.log("");
    console.log("Wertpaare für t > 0 mit x > 0 und y > 0:");

    if (y0 <= 0) {
      console.log("Keine Lösungen mit x > 0 und y > 0.");
      return true;
    }

    let t = 1;
    while (true) {
      const x = t;
      // x>0 automatisch, y0>0 geprüft
      console.log(`  t = ${t}: (x, y) = (${x}, ${y0})`);
      t++;
    }
  }

  // b = 0: a*x = c -> x = c / a, y frei
  if (b === 0) {
    if (c % a !== 0) {
      console.log("Keine Lösung: a*x = c hat keine ganzzahlige Lösung.");
      return true;
    }
    const x0 = c / a;
    console.log(`Unendlich viele Lösungen:`);
    console.log(`  x = ${x0} (fest)`);
    console.log(`  y = t, für alle t ∈ Z`);
    console.log("");
    console.log("Wertpaare für t > 0 mit x > 0 und y > 0:");

    if (x0 <= 0) {
      console.log("Keine Lösungen mit x > 0 und y > 0.");
      return true;
    }

    let t = 1;
    while (true) {
      const y = t;
      // y>0 automatisch, x0>0 geprüft
      console.log(`  t = ${t}: (x, y) = (${x0}, ${y})`);
      t++;
    }
  }

  return false; // kein Sonderfall
}

if (handleSpecialCases(a, b, c)) {
  process.exit(0);
}

// --- Allgemeiner Fall: a, b ≠ 0 ---

const { g: d, x: xg, y: yg } = extendedGcd(Math.abs(a), Math.abs(b));

const gcd = d;
const signA = a < 0 ? -1 : 1;
const signB = b < 0 ? -1 : 1;

// xg, yg lösen |a|*xg + |b|*yg = gcd
// => a*(signA*xg) + b*(signB*yg) = gcd
const xForGcd = signA * xg;
const yForGcd = signB * yg;

// Prüfen, ob c durch gcd teilbar ist
if (c % gcd !== 0) {
  console.log(`Keine Lösung, da gcd(a,b) = ${gcd} die Konstante c = ${c} nicht teilt.`);
  process.exit(0);
}

// Eine spezielle Lösung (x0, y0)
const factor = c / gcd;
const x0 = xForGcd * factor;
const y0 = yForGcd * factor;

// Allgemeine Lösung:
// x = x0 + (b/gcd) * t
// y = y0 - (a/gcd) * t
const stepX = b / gcd;
const stepY = -a / gcd;

console.log(`Gegeben: ${a} * x + ${b} * y = ${c}`);
console.log(`gcd(a,b) = ${gcd}`);
console.log("");
console.log("Eine konkrete Lösung ist:");
console.log(`  x0 = ${x0}`);
console.log(`  y0 = ${y0}`);
console.log("");
console.log("Alle ganzzahligen Lösungen lassen sich so schreiben (t ∈ Z):");
console.log(`  x(t) = ${x0} + (${stepX}) * t`);
console.log(`  y(t) = ${y0} + (${stepY}) * t`);

console.log("");
console.log("Wertpaare für t > 0 mit x > 0 und y > 0:");

let t = 1;
let s = '';
while (true) {
  const x = x0 + stepX * t;
  const y = y0 + stepY * t;
  if (x > 0 && y > 0) {
    s+=String.fromCharCode(64 + x);
    s+=String.fromCharCode(64 + y);
    console.log(`  t = ${t}: (x, y) = (${x}, ${y}) => ${String.fromCharCode(64 + x)} ${String.fromCharCode(64 + y)}`)
  }
  if (y<0) {
    console.log(s);
    process.exit();
  }
  t++;
}
