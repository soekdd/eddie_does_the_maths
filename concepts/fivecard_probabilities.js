#!/usr/bin/env node
/**
 * Five Card Draw hand probabilities (5-card poker from a standard 52-card deck).
 * Outputs a compact HTML table (no CSS/attributes) and also prints a JSON summary.
 *
 * Run:
 *   node fivecard_probabilities.js            # prints HTML to stdout
 *   node fivecard_probabilities.js --json     # prints JSON to stdout
 */

const TOTAL = 2598960n; // C(52,5)

function pct(n) {
  // Return percent as string with 6 decimals and comma decimal separator (German style).
  const num = Number(n);
  const denom = Number(TOTAL);
  const p = (num / denom) * 100;
  // Use 6 decimal places; strip trailing zeros but keep at least 3 decimals
  let s = p.toFixed(6);
  s = s.replace(/0+$/, '').replace(/\.$/, '');
  // Ensure at least 3 decimals for readability
  if (!s.includes('.')) s += '.000';
  const decimals = s.split('.')[1].length;
  if (decimals < 3) s += '0'.repeat(3 - decimals);
  return s.replace('.', ',') + '%';
}

function odds(n) {
  // "1 zu X" where X = TOTAL / n
  // We keep a couple decimals when needed (e.g., 694,2), otherwise integer.
  const q = Number(TOTAL) / Number(n);
  // Decide formatting: integer if close, else one/two decimals
  const roundedInt = Math.round(q);
  if (Math.abs(q - roundedInt) < 1e-9) return formatDEInt(roundedInt);
  // Use 2 decimals, then trim
  let s = q.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  return s.replace('.', ',');
}

function formatDEInt(x) {
  return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const hands = [
  { name: 'Royal Flush',                 count: 4n },
  { name: 'Straight Flush (inkl. Royal Flush)', count: 40n },
  { name: 'Vierling',                    count: 624n },
  { name: 'Full House',                  count: 3744n },
  { name: 'Flush (ohne Straight Flush)', count: 5108n },
  { name: 'Straight (ohne Straight Flush)', count: 10200n },
  { name: 'Drilling',                    count: 54912n },
  { name: 'Zwei Paare',                  count: 123552n },
  { name: 'Ein Paar',                    count: 1098240n },
  { name: 'High Card',                   count: 1302540n },
];

// Sanity check: sums to total
const sum = hands.reduce((a, h) => a + h.count, 0n);
if (sum !== TOTAL) {
  console.error('Sanity check failed: sum != total', { sum: sum.toString(), total: TOTAL.toString() });
  process.exit(1);
}

function toHTML() {
  let out = '<table>\n';
  out += '  <tr><th>Blatt</th><th>Kombinationen</th><th>Wahrscheinlichkeit</th><th>Odds (1 zu)</th></tr>\n';
  for (const h of hands) {
    const combos = formatDEInt(Number(h.count));
    out += `  <tr><td>${h.name}</td><td>${combos}</td><td>${pct(h.count)}</td><td>${odds(h.count)}</td></tr>\n`;
  }
  out += '</table>\n';
  return out;
}

function toJSON() {
  return JSON.stringify({
    total: TOTAL.toString(),
    hands: hands.map(h => ({
      name: h.name,
      count: h.count.toString(),
      probability: (Number(h.count) / Number(TOTAL)),
      percent: pct(h.count),
      odds_1_to: odds(h.count),
    }))
  }, null, 2);
}

const arg = process.argv.slice(2);
if (arg.includes('--json')) {
  process.stdout.write(toJSON() + '\n');
} else {
  process.stdout.write(toHTML());
}
