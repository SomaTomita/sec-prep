const PY_URL = new URL('../../interactive/py/quotient-rings-gf2n.py', import.meta.url);
export async function loadSource() { return (await fetch(PY_URL)).text(); }

const GF4_NAMES = { 0: '0', 1: '1', 2: 'x', 3: 'x+1' };

function gf2PolyMul(a, b, trace) {
  let result = 0;
  trace(2, { a, b, result }, 'result = 0');
  while (b) {
    if (b & 1) { result ^= a; }
    a <<= 1;
    b >>= 1;
  }
  return result;
}

export function run({ a, b }) {
  const steps = [];
  const trace = (line, vars, note) => steps.push({
    line,
    vars: Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, `${v}(${GF4_NAMES[v] ?? v})`])),
    note,
  });

  trace(11, { a, b }, 'gf4_mul 開始');
  const product = gf2PolyMul(a, b, trace);
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
  return steps;
}
