import { createTracer, pymod } from './_shared.js';

const PY_URL = new URL('../../interactive/py/fermat-little-theorem.py', import.meta.url);
export async function loadSource() { return (await fetch(PY_URL)).text(); }

export function run({ a, exponent, m }) {
  const { trace, getSteps } = createTracer();

  trace(1, { a, exponent, m }, '関数開始');
  let result = 1;
  trace(2, { a, exponent, m, result }, 'result = 1');
  for (let i = 0; i < exponent; i += 1) {
    trace(3, { a, exponent, m, result, i: i + 1 }, `ループ ${i + 1}/${exponent}`);
    result = pymod(result * a, m);
    trace(4, { a, exponent, m, result }, 'result = result * a mod m');
  }
  trace(5, { a, exponent, m, result }, 'result を返す');
  return getSteps();
}
