import { createTracer, pymod } from './_shared.js';

const PY_URL = new URL('../../interactive/py/order-and-lagrange.py', import.meta.url);
export async function loadSource() { return (await fetch(PY_URL)).text(); }

export function run({ a, p }) {
  const { trace, getSteps } = createTracer();

  trace(1, { a, p }, '関数開始');
  a = pymod(a, p);
  trace(2, { a, p }, 'a を mod p に正規化');
  let x = a;
  trace(3, { a, p, x }, 'x = a');
  let k = 1;
  trace(4, { a, p, x, k }, 'k = 1');
  while (x !== 1) {
    trace(5, { a, p, x, k }, 'x != 1 を確認');
    x = pymod(x * a, p);
    k += 1;
    trace(6, { a, p, x, k }, 'x = x * a mod p, k += 1');
  }
  trace(5, { a, p, x, k }, 'x == 1 になったのでループ終了');
  trace(8, { a, p, k }, 'k（= ord(a)）を返す');
  return getSteps();
}
