const PY_URL = new URL('../../interactive/py/euler-phi-theorem.py', import.meta.url);
export async function loadSource() { return (await fetch(PY_URL)).text(); }

function gcd(a, b) {
  while (b !== 0) { [a, b] = [b, ((a % b) + b) % b]; }
  return a;
}

export function run({ n }) {
  const steps = [];
  const trace = (line, vars, note) => steps.push({ line, vars: { ...vars }, note });

  trace(7, { n }, 'euler_phi 開始');
  let count = 0;
  trace(8, { n, count }, 'count = 0');
  for (let k = 1; k <= n; k += 1) {
    trace(9, { n, count, k }, `k = ${k}`);
    if (gcd(k, n) === 1) {
      count += 1;
      trace(11, { n, count, k }, `gcd(${k}, ${n}) == 1 なので count += 1`);
    } else {
      trace(9, { n, count, k }, `gcd(${k}, ${n}) != 1（互いに素でない）`);
    }
  }
  trace(12, { n, count }, 'count（= φ(n)）を返す');
  return steps;
}
