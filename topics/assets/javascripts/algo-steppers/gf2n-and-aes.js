const PY_URL = new URL('../../interactive/py/gf2n-and-aes.py', import.meta.url);
export async function loadSource() { return (await fetch(PY_URL)).text(); }

function hex(n) { return `0x${n.toString(16).toUpperCase()}`; }

export function run({ a, b }) {
  const steps = [];
  const trace = (line, vars, note) => steps.push({ line, vars: { a: hex(vars.a), b: hex(vars.b), p: hex(vars.p) }, note });

  trace(1, { a, b, p: 0 }, '関数開始');
  let p = 0;
  trace(2, { a, b, p }, 'p = 0');
  for (let i = 0; i < 8; i += 1) {
    trace(3, { a, b, p }, `ループ ${i + 1}/8`);
    if (b & 1) {
      p ^= a;
      trace(5, { a, b, p }, 'b の最下位ビットが1 → p ^= a');
    } else {
      trace(4, { a, b, p }, 'b の最下位ビットが0 → xtimeのみ');
    }
    const carry = a & 0x80;
    a = (a << 1) & 0xFF;
    trace(7, { a, b, p }, 'a を1ビット左シフト（xtime）');
    if (carry) {
      a ^= 0x1b;
      trace(9, { a, b, p }, '溢れたビットがあったので 0x1B とXOR（m(x)による還元）');
    }
    b >>= 1;
    trace(10, { a, b, p }, 'b を1ビット右シフト');
  }
  trace(11, { a, b, p }, 'p（= a * b in GF(2^8)）を返す');
  return steps;
}
