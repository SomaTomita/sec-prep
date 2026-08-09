import { createTracer, pymod } from './_shared.js';

const PY_URL = new URL('../../interactive/py/congruence-mod-add.py', import.meta.url);

export async function loadSource() {
  return (await fetch(PY_URL)).text();
}

export function run({ a, b, m }) {
  const { trace, getSteps } = createTracer();

  trace(1, { a, b, m }, '関数開始');
  const ra = pymod(a, m);
  trace(2, { a, b, m, ra }, 'a を mod m の余りに置き換え');
  const rb = pymod(b, m);
  trace(3, { a, b, m, ra, rb }, 'b を mod m の余りに置き換え');
  const result = pymod(ra + rb, m);
  trace(4, { a, b, m, ra, rb, result }, 'ra + rb を mod m して返す');
  return getSteps();
}
