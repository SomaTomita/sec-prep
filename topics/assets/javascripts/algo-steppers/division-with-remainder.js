const PY_URL = new URL('../../interactive/py/division-with-remainder.py', import.meta.url);

export async function loadSource() {
  return (await fetch(PY_URL)).text();
}

export function run({ a, b }) {
  const steps = [];
  const trace = (line, vars, note) => steps.push({ line, vars: { ...vars }, note });

  trace(1, { a, b }, '関数開始');
  const q = Math.floor(a / b);
  trace(2, { a, b, q }, 'q = a // b（切り捨て除算）');
  const r = a - b * q;
  trace(3, { a, b, q, r }, 'r = a - b * q');
  trace(4, { a, b, q, r }, '(q, r) を返す');
  return steps;
}
