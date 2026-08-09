const PY_URL = new URL('../../interactive/py/primes-factorization.py', import.meta.url);
export async function loadSource() { return (await fetch(PY_URL)).text(); }

export function run({ n }) {
  const steps = [];
  const trace = (line, vars, note) => steps.push({ line, vars: { ...vars }, note });

  trace(1, { n }, '関数開始');
  const factors = [];
  trace(2, { n, factors: [...factors] }, 'factors = []');
  let d = 2;
  trace(3, { n, factors: [...factors], d }, 'd = 2');
  while (d * d <= n) {
    trace(4, { n, factors: [...factors], d }, 'd*d <= n を確認');
    while (n % d === 0) {
      trace(5, { n, factors: [...factors], d }, 'n % d == 0 を確認');
      factors.push(d);
      n = Math.trunc(n / d);
      trace(7, { n, factors: [...factors], d }, 'factors に d を追加し n //= d');
    }
    d += 1;
    trace(8, { n, factors: [...factors], d }, 'd += 1');
  }
  trace(4, { n, factors: [...factors], d }, 'd*d > n になったのでループ終了');
  if (n > 1) {
    trace(9, { n, factors: [...factors] }, 'n > 1 を確認');
    factors.push(n);
    trace(10, { n, factors: [...factors] }, '残った n を factors に追加');
  }
  trace(11, { factors: [...factors] }, 'factors を返す');
  return steps;
}
