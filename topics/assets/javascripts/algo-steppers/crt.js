const PY_URL = new URL('../../interactive/py/crt.py', import.meta.url);

export async function loadSource() {
  return (await fetch(PY_URL)).text();
}

function pymod(n, m) {
  return ((n % m) + m) % m;
}

function modInverse(a, m) {
  a = pymod(a, m);
  let oldR = a, r = m;
  let oldS = 1, s = 0;
  while (r !== 0) {
    const q = Math.trunc(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return pymod(oldS, m);
}

export function run({ remainders, moduli }) {
  const steps = [];
  const trace = (line, vars, note) => steps.push({ line, vars: { ...vars }, note });

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
    const Mi = Math.trunc(M / m);
    trace(7, { M, x, a, m, Mi }, 'Mi = M // m');
    const yi = modInverse(Mi, m);
    trace(8, { M, x, a, m, Mi, yi }, 'yi = pow(Mi, -1, m)');
    x += a * Mi * yi;
    trace(9, { M, x, a, m, Mi, yi }, 'x += a * Mi * yi');
  });
  const result = pymod(x, M);
  trace(10, { M, x: result }, 'x % M を返す');
  return steps;
}
