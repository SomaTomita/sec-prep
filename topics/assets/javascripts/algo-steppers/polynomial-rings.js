const PY_URL = new URL('../../interactive/py/polynomial-rings.py', import.meta.url);
export async function loadSource() { return (await fetch(PY_URL)).text(); }

function toPoly(n) {
  if (n === 0) return '0';
  const terms = [];
  for (let i = 31; i >= 0; i -= 1) {
    if (n & (1 << i)) terms.push(i === 0 ? '1' : i === 1 ? 'x' : `x^${i}`);
  }
  return terms.join(' + ');
}

export function run({ a, b }) {
  const steps = [];
  const trace = (line, vars, note) => steps.push({
    line,
    vars: { a: `${vars.a}(${toPoly(vars.a)})`, b: `${vars.b}(${toPoly(vars.b)})`, result: `${vars.result}(${toPoly(vars.result)})` },
    note,
  });

  trace(1, { a, b, result: 0 }, '関数開始');
  let result = 0;
  trace(2, { a, b, result }, 'result = 0');
  while (b) {
    trace(3, { a, b, result }, 'b が 0 でないか確認');
    if (b & 1) {
      result ^= a;
      trace(5, { a, b, result }, 'b の最下位ビットが1 → result ^= a');
    } else {
      trace(4, { a, b, result }, 'b の最下位ビットが0');
    }
    a <<= 1;
    trace(6, { a, b, result }, 'a <<= 1（次数を1上げる）');
    b >>= 1;
    trace(7, { a, b, result }, 'b >>= 1');
  }
  trace(3, { a, b, result }, 'b == 0 になったのでループ終了');
  trace(8, { result }, 'result を返す');
  return steps;
}
