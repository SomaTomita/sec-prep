import { createTracer, pymod, pyFloorDiv } from './_shared.js';

const PY_URL = new URL('../../interactive/py/crt.py', import.meta.url);

export async function loadSource() {
  return (await fetch(PY_URL)).text();
}

// Python の pow(a, -1, m) 相当。逆元が存在しない（gcd(a, m) != 1）場合は
// Python が ValueError を投げるのに合わせて例外にする。
function modInverse(a, m) {
  a = pymod(a, m);
  let oldR = a, r = m;
  let oldS = 1, s = 0;
  // CRT のステップ表示では modInverse をブラックボックス扱いするため、この
  // ループの trace は外側の trace とは別に、上限を効かせるためだけに作る
  // （getSteps() は使わず捨てる。呼べば MAX_STEPS 超過時に例外が飛ぶ）。
  const { trace: boundLoop } = createTracer();
  while (r !== 0) {
    boundLoop(0, {}, 'modInverse loop bound');
    const q = pyFloorDiv(oldR, r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  if (oldR !== 1) {
    throw new Error('moduli が互いに素ではありません（CRT の前提条件を満たしません）');
  }
  return pymod(oldS, m);
}

export function run({ remainders, moduli }) {
  const { trace, getSteps } = createTracer();

  trace(1, { remainders, moduli }, '関数開始');
  let M = 1;
  trace(2, { M }, 'M = 1');
  moduli.forEach((m) => {
    M *= m;
    trace(4, { M }, `M *= ${m}`);
  });
  let x = 0;
  trace(5, { M, x }, 'x = 0');
  remainders.forEach((a, i) => {
    const m = moduli[i];
    trace(6, { M, x, a, m }, `(a, m) = (${a}, ${m})`);
    const Mi = pyFloorDiv(M, m);
    trace(7, { M, x, a, m, Mi }, 'Mi = M // m');
    const yi = modInverse(Mi, m);
    trace(8, { M, x, a, m, Mi, yi }, 'yi = pow(Mi, -1, m)');
    x += a * Mi * yi;
    trace(9, { M, x, a, m, Mi, yi }, 'x += a * Mi * yi');
  });
  const result = pymod(x, M);
  trace(10, { M, x: result }, 'x % M を返す');
  return getSteps();
}
