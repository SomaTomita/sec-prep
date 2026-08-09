const PY_URL = new URL('../../interactive/py/modular-inverse.py', import.meta.url);

export async function loadSource() {
  return (await fetch(PY_URL)).text();
}

function pymod(n, m) {
  return ((n % m) + m) % m;
}

function extendedGcd(a, b, trace) {
  let oldR = a, r = b;
  trace(2, { oldR, r }, 'old_r, r = a, b');
  let oldS = 1, s = 0;
  trace(3, { oldR, r, oldS, s }, 'old_s, s = 1, 0');
  while (r !== 0) {
    trace(4, { oldR, r, oldS, s }, 'r != 0 を確認');
    const q = Math.trunc(oldR / r);
    trace(5, { oldR, r, oldS, s, q }, 'q = old_r // r');
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    trace(6, { oldR, r, oldS, s, q }, 'old_r, r, old_s, s を更新');
  }
  trace(4, { oldR, r, oldS, s }, 'r == 0 になったのでループ終了');
  trace(8, { g: oldR, x: oldS }, '(g, x) を返す');
  return [oldR, oldS];
}

export function run({ a, n }) {
  const steps = [];
  const trace = (line, vars, note) => steps.push({ line, vars: { ...vars }, note });

  trace(11, { a, n }, 'mod_inverse 開始');
  const [g, x] = extendedGcd(a, n, trace);
  trace(12, { a, n, g, x }, 'g, x = extended_gcd(a, n)');
  if (g !== 1) {
    trace(13, { a, n, g }, 'g != 1 なので逆元は存在しない');
    return steps;
  }
  const result = pymod(x, n);
  trace(15, { a, n, g, x, result }, 'x % n を返す（逆元）');
  return steps;
}
