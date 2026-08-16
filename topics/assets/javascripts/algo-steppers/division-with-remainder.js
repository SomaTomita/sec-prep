import { createTracer, pyFloorDiv } from './_shared.js';

const PY_URL = new URL('../../interactive/py/division-with-remainder.py', import.meta.url);

export async function loadSource() {
  return (await fetch(PY_URL)).text();
}

export function run({ a, b }) {
  // Python の a // b は b == 0 で ZeroDivisionError。JS は Infinity/NaN を返して
  // しまうので、同じところで止まるように明示的に弾く。
  if (b === 0) throw new Error('0 で割ることはできません');

  const { trace, getSteps } = createTracer();

  trace(1, { a, b }, '関数開始');
  const q = pyFloorDiv(a, b);
  trace(2, { a, b, q }, 'q = a // b（切り捨て除算）');
  const r = a - b * q;
  trace(3, { a, b, q, r }, 'r = a - b * q');
  trace(4, { a, b, q, r }, '(q, r) を返す');
  return getSteps();
}
