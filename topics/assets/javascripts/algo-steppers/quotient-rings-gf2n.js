import { createTracer, toPoly } from './_shared.js';

const PY_URL = new URL('../../interactive/py/quotient-rings-gf2n.py', import.meta.url);
export async function loadSource() { return (await fetch(PY_URL)).text(); }

// このウィジェットが教えたいのは「還元（mod x²+x+1）」の一手であって、
// 多項式乗算そのものではない（乗算のステップ実行は 01_polynomial-rings の
// ウィジェットが担当する）。そのためここでは補助関数はブラックボックス扱いにし、
// gf4_mul 側のステップだけを追う。
function gf2PolyMul(a, b) {
  let result = 0;
  while (b) {
    if (b & 1) { result ^= a; }
    a <<= 1;
    b >>= 1;
  }
  return result;
}

export function run({ a, b }) {
  const { trace, getSteps } = createTracer((vars) => Object.fromEntries(
    Object.entries(vars).map(([k, v]) => [k, `${v}(${toPoly(v)})`]),
  ));

  trace(11, { a, b }, 'gf4_mul 開始');
  const product = gf2PolyMul(a, b);
  trace(12, { a, b, product }, 'product = gf2_poly_mul(a, b)（還元前）');
  let reduced = product;
  if (product & 0b100) {
    trace(13, { a, b, product }, 'x^2 の項がある（bit2が立っている）ので還元が必要');
    reduced ^= 0b111;
    trace(14, { a, b, product: reduced }, 'product ^= 0b111（x²≡x+1 で還元）');
  } else {
    trace(13, { a, b, product }, 'x^2 の項がないので還元不要');
  }
  trace(15, { result: reduced }, 'result を返す');
  return getSteps();
}
