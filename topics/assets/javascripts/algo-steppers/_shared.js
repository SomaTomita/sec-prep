// 各ステッパー・モジュールが共有するヘルパー群。
// 目的は3つ:
//   1) trace() のステップ数に上限を設け、無限ループでタブが固まるのを防ぐ
//   2) Python の % と // の意味論（負数で床方向）を JS で正しく再現する
//   3) ビットマスク整数の多項式表記を一箇所にまとめる

// 1回の run() が生成できるステップ数の上限。
// 正常な教材用入力はどれも数十ステップで終わるため、これを超えたら
// 入力が想定外（合成数を素数として渡した・NaN・負のシフトなど）と判断する。
const MAX_STEPS = 2000;

/**
 * ステップ配列と、それに追記する trace() を作る。
 * @param {(vars: object) => object} [formatVars] 表示用に vars を整形する関数（省略時は浅いコピー）
 * @returns {{ trace: (line: number, vars: object, note: string) => void, getSteps: () => object[] }}
 */
export function createTracer(formatVars) {
  const steps = [];
  const format = formatVars || ((vars) => ({ ...vars }));
  const trace = (line, vars, note) => {
    if (steps.length >= MAX_STEPS) {
      throw new Error(`ステップ数が上限（${MAX_STEPS}）を超えました。入力を小さくするか、無限ループの可能性を確認してください`);
    }
    steps.push({ line, vars: format(vars), note });
  };
  return { trace, getSteps: () => steps };
}

/**
 * Python の `n % m`（結果の符号は m に従う）。JS の % は被除数の符号に従うので一致しない。
 */
export function pymod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * Python の `a // b`（床除算 = 負の無限大方向へ切り捨て）。
 * JS の Math.trunc はゼロ方向に切り捨てるため、負数で結果が変わってしまう。
 * 例: -35 // 15 は Python で -3、Math.trunc(-35/15) は -2。
 */
export function pyFloorDiv(a, b) {
  return Math.floor(a / b);
}

/**
 * ビットマスク整数を GF(2) 上の多項式表記に変換する。例: 6 → "x^2 + x"。
 */
export function toPoly(n) {
  if (n === 0) return '0';
  const terms = [];
  for (let i = 31; i >= 0; i -= 1) {
    if (n & (1 << i)) terms.push(i === 0 ? '1' : i === 1 ? 'x' : `x^${i}`);
  }
  return terms.join(' + ');
}
