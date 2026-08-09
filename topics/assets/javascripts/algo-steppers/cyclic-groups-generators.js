const PY_URL = new URL('../../interactive/py/cyclic-groups-generators.py', import.meta.url);
export async function loadSource() { return (await fetch(PY_URL)).text(); }

function pymod(n, m) { return ((n % m) + m) % m; }

export function run({ g, p }) {
  const steps = [];
  const trace = (line, vars, note) => steps.push({ line, vars: { ...vars }, note });

  trace(1, { g, p }, '関数開始');
  const values = [];
  trace(2, { g, p, values: [...values] }, 'values = []');
  let x = pymod(g, p);
  trace(3, { g, p, values: [...values], x }, 'x = g mod p');
  for (let i = 0; i < p - 1; i += 1) {
    trace(4, { g, p, values: [...values], x, i }, `ループ ${i + 1}/${p - 1}`);
    values.push(x);
    trace(5, { g, p, values: [...values], x }, 'values に x を追加');
    x = pymod(x * g, p);
    trace(6, { g, p, values: [...values], x }, 'x = x * g mod p');
  }
  trace(7, { values: [...values] }, 'values を返す');
  return steps;
}
