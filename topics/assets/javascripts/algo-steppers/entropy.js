const PY_URL = new URL('../../interactive/py/entropy.py', import.meta.url);
export async function loadSource() { return (await fetch(PY_URL)).text(); }

export function run({ probabilities }) {
  const steps = [];
  const trace = (line, vars, note) => steps.push({ line, vars: { ...vars }, note });

  trace(4, { probabilities }, '関数開始');
  let total = 0;
  trace(5, { probabilities, total }, 'total = 0.0');
  probabilities.forEach((p, i) => {
    trace(6, { probabilities, total, p, i }, `p = probabilities[${i}] = ${p}`);
    if (p > 0) {
      trace(7, { probabilities, total, p }, 'p > 0 を確認');
      total -= p * Math.log2(p);
      trace(8, { probabilities, total: Number(total.toFixed(6)), p }, 'total -= p * log2(p)');
    } else {
      trace(7, { probabilities, total, p }, 'p == 0 なので加算しない');
    }
  });
  trace(9, { total: Number(total.toFixed(6)) }, 'total（= H(X)）を返す');
  return steps;
}
