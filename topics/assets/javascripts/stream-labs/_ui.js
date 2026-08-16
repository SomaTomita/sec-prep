/**
 * ストリーム暗号ウィジェット共通のビット演算 / DOM 組み立てヘルパ。
 * 状態は持たず、常に新しい配列・新しい要素を返す（呼び出し側で組み合わせる）。
 */

/** @typedef {0|1} Bit */

/**
 * "1011 0010" のような文字列を 0/1 配列に変換する。空白は無視する。
 * @param {string} text
 * @param {number} maxLen 受け付ける最大ビット数
 * @returns {Bit[]}
 */
export function parseBits(text, maxLen = 32) {
  const cleaned = text.replace(/\s+/g, '');
  if (!cleaned.length) throw new Error('ビット列が空です');
  if (!/^[01]+$/.test(cleaned)) throw new Error('0 と 1 だけで入力してください');
  if (cleaned.length > maxLen) throw new Error(`長すぎます（最大 ${maxLen} ビット）`);
  return [...cleaned].map((c) => /** @type {Bit} */ (c === '1' ? 1 : 0));
}

/**
 * 教材用の乱数ビット列。鍵素材の生成には使えない（crypto.getRandomValues を使うこと）。
 * @param {number} n
 * @returns {Bit[]}
 */
export function randomBits(n) {
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  return [...buf].map((v) => /** @type {Bit} */ (v & 1));
}

/**
 * @param {Bit[]} a
 * @param {Bit[]} b
 * @returns {Bit[]}
 */
export function xorBits(a, b) {
  if (a.length !== b.length) throw new Error('XOR する2つの列は同じ長さでなければなりません');
  return a.map((v, i) => /** @type {Bit} */ (v ^ b[i]));
}

/**
 * @param {Bit[]} bits
 * @returns {string}
 */
export function bitsToText(bits) {
  return bits.join('');
}

/**
 * @param {string} tag
 * @param {string} [className]
 * @param {string} [text]
 * @returns {HTMLElement}
 */
export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * @param {string} label
 * @returns {HTMLButtonElement}
 */
export function button(label) {
  const btn = /** @type {HTMLButtonElement} */ (document.createElement('button'));
  btn.type = 'button';
  btn.textContent = label;
  return btn;
}

/**
 * ラベル付きテキスト入力。
 * @param {string} labelText
 * @param {string} value
 * @returns {{ wrap: HTMLElement, input: HTMLInputElement }}
 */
export function textField(labelText, value) {
  const wrap = el('label', 'stream-lab__field');
  wrap.appendChild(el('span', undefined, labelText));
  const input = /** @type {HTMLInputElement} */ (document.createElement('input'));
  input.type = 'text';
  input.value = value;
  input.spellcheck = false;
  wrap.appendChild(input);
  return { wrap, input };
}

/**
 * ビット行を作る。cells は後から中身と強調を差し替えられるよう呼び出し側へ返す。
 * @param {string} labelText 左端に出す行名（"⊕ 鍵 K" など記号込みで渡す）
 * @param {number} length
 * @param {{ blank?: boolean }} [opts] blank=true なら中身を "?" にして薄く表示する
 * @returns {{ row: HTMLElement, cells: HTMLElement[] }}
 */
export function bitRow(labelText, length, opts = {}) {
  const row = el('div', 'stream-lab__row');
  row.appendChild(el('span', 'stream-lab__rowlabel', labelText));
  const cells = [];
  for (let i = 0; i < length; i += 1) {
    const cell = el('span', 'stream-lab__bit', opts.blank ? '?' : '0');
    if (opts.blank) cell.classList.add('stream-lab__bit--blank');
    row.appendChild(cell);
    cells.push(cell);
  }
  return { row, cells };
}

/**
 * ビット1個ぶんのセル表示を更新する。
 * @param {HTMLElement} cell
 * @param {Bit|null} value null で未確定（"?"）表示に戻す
 * @param {{ pop?: boolean }} [opts] pop=true で出現アニメーションを付け直す
 */
export function setBit(cell, value, opts = {}) {
  cell.classList.remove('stream-lab__bit--pop');
  if (value === null) {
    cell.textContent = '?';
    cell.classList.add('stream-lab__bit--blank');
    cell.classList.remove('stream-lab__bit--one');
    return;
  }
  cell.textContent = String(value);
  cell.classList.remove('stream-lab__bit--blank');
  cell.classList.toggle('stream-lab__bit--one', value === 1);
  if (opts.pop) {
    // クラスを外した直後に付け直してもアニメーションは再生されないため、
    // レイアウトを1度読んでリスタートさせる。
    void cell.offsetWidth;
    cell.classList.add('stream-lab__bit--pop');
  }
}

/**
 * 指定列だけ強調する。cols に null を渡すと全解除。
 * @param {HTMLElement[][]} groups 強調対象のセル配列（行ごと）
 * @param {number|null} index
 */
export function highlightColumn(groups, index) {
  groups.forEach((cells) => {
    cells.forEach((cell, i) => {
      cell.classList.toggle('stream-lab__bit--active', index !== null && i === index);
    });
  });
}
