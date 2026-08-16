import { createTracer, pyFloorDiv } from './_shared.js';

const PY_URL = new URL('../../interactive/py/extended-euclidean.py', import.meta.url);

export async function loadSource() {
  return (await fetch(PY_URL)).text();
}

export function run({ a, b }) {
  const { trace, getSteps } = createTracer();

  trace(1, { a, b }, '関数開始');
  let oldR = a, r = b;
  trace(2, { oldR, r }, 'old_r, r = a, b');
  let oldS = 1, s = 0;
  trace(3, { oldR, r, oldS, s }, 'old_s, s = 1, 0');
  let oldT = 0, t = 1;
  trace(4, { oldR, r, oldS, s, oldT, t }, 'old_t, t = 0, 1');
  while (r !== 0) {
    trace(5, { oldR, r, oldS, s, oldT, t }, 'r != 0 を確認');
    const q = pyFloorDiv(oldR, r);
    trace(6, { oldR, r, oldS, s, oldT, t, q }, 'q = old_r // r');
    [oldR, r] = [r, oldR - q * r];
    trace(7, { oldR, r, oldS, s, oldT, t, q }, 'old_r, r を更新');
    [oldS, s] = [s, oldS - q * s];
    trace(8, { oldR, r, oldS, s, oldT, t, q }, 'old_s, s を更新');
    [oldT, t] = [t, oldT - q * t];
    trace(9, { oldR, r, oldS, s, oldT, t, q }, 'old_t, t を更新');
  }
  trace(5, { oldR, r, oldS, s, oldT, t }, 'r == 0 になったのでループ終了');
  trace(10, { gcd: oldR, x: oldS, y: oldT }, '(gcd, x, y) を返す');
  return getSteps();
}
