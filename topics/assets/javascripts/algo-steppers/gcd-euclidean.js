import { createTracer, pymod } from './_shared.js';

const PY_URL = new URL('../../interactive/py/gcd-euclidean.py', import.meta.url);

export async function loadSource() {
  return (await fetch(PY_URL)).text();
}

export function run({ a, b }) {
  const { trace, getSteps } = createTracer();

  trace(1, { a, b }, '関数開始');
  while (b !== 0) {
    trace(2, { a, b }, 'b != 0 を確認');
    const newB = pymod(a, b);
    [a, b] = [b, newB];
    trace(3, { a, b }, 'a, b = b, a % b');
  }
  trace(2, { a, b }, 'b == 0 になったのでループ終了');
  trace(4, { a, b }, 'a（= gcd）を返す');
  return getSteps();
}
