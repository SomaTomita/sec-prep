/**
 * 「OTP は鍵が平文と同じ長さ」という運用コストを目で見るためのデモ。
 * データ量スライダを動かすと、OTP の鍵長とストリーム暗号の鍵長（定数）を対数スケールで比較する。
 */

import { el, button } from './_ui.js';

/** 目盛りは桁が飛ぶので、線形スライダの各ノッチに直接バイト数を割り当てる。 */
const SIZES = [
  { label: '1 KB（短いメール）', bytes: 1e3 },
  { label: '1 MB（写真1枚）', bytes: 1e6 },
  { label: '100 MB（音楽アルバム）', bytes: 1e8 },
  { label: '1 GB（動画1本）', bytes: 1e9 },
  { label: '100 GB（バックアップ）', bytes: 1e11 },
  { label: '1 TB（ディスク丸ごと）', bytes: 1e12 },
];

const STREAM_KEY_BYTES = 32; // ChaCha20 / AES-256 の鍵長

/**
 * @param {number} bytes
 * @returns {string}
 */
function humanBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1000 && unit < units.length - 1) { value /= 1000; unit += 1; }
  const digits = value >= 100 || Number.isInteger(value) ? 0 : 1;
  return `${value.toFixed(digits)} ${units[unit]}`;
}

/**
 * 桁が 10^1〜10^12 まで開くので、バー幅は対数スケールにする（線形だと 32B が消える）。
 * @param {number} bytes
 * @returns {number} 0..100 の百分率
 */
function logWidth(bytes) {
  const lo = Math.log10(STREAM_KEY_BYTES);
  const hi = Math.log10(SIZES[SIZES.length - 1].bytes);
  const pct = ((Math.log10(bytes) - lo) / (hi - lo)) * 100;
  return Math.max(2, Math.min(100, pct));
}

/**
 * @param {HTMLElement} root
 */
export function mount(root) {
  root.appendChild(el('div', 'stream-lab__title', '鍵の運び賃 — OTP vs ストリーム暗号'));

  const slider = /** @type {HTMLInputElement} */ (document.createElement('input'));
  slider.type = 'range';
  slider.min = '0';
  slider.max = String(SIZES.length - 1);
  slider.step = '1';
  slider.value = '3';
  slider.className = 'stream-lab__slider';
  slider.setAttribute('aria-label', '暗号化したいデータ量');

  const sliderWrap = el('label', 'stream-lab__field');
  sliderWrap.appendChild(el('span', undefined, '暗号化したいデータ量'));
  sliderWrap.appendChild(slider);

  const bumpBtn = button('1 GB にする');
  const controls = el('div', 'stream-lab__controls');
  controls.append(sliderWrap, bumpBtn);
  root.appendChild(controls);

  const board = el('div', 'stream-lab__bars');
  const otpBar = makeBar('OTP の鍵（平文と同じ長さ）', 'stream-lab__bar--otp');
  const streamBar = makeBar('ストリーム暗号の鍵（固定 256 bit）', 'stream-lab__bar--stream');
  board.append(otpBar.wrap, streamBar.wrap);
  root.appendChild(board);

  const note = el('div', 'stream-lab__note');
  note.setAttribute('role', 'status');
  note.setAttribute('aria-live', 'polite');
  root.appendChild(note);

  root.appendChild(el('div', 'stream-lab__warn',
    '※ どちらの鍵も「事前に安全な経路で相手へ渡す」必要がある。'
    + 'OTP はその経路にデータ量ぶんの帯域が要り、しかも使い捨てなので毎回運び直しになる。'));

  /**
   * @param {string} label
   * @param {string} modifier
   */
  function makeBar(label, modifier) {
    const wrap = el('div', 'stream-lab__barrow');
    wrap.appendChild(el('div', 'stream-lab__barlabel', label));
    const track = el('div', 'stream-lab__bartrack');
    const fill = el('div', `stream-lab__barfill ${modifier}`);
    const value = el('span', 'stream-lab__barvalue');
    track.append(fill, value);
    wrap.appendChild(track);
    return { wrap, fill, value };
  }

  function render() {
    const size = SIZES[Number(slider.value)];
    otpBar.fill.style.width = `${logWidth(size.bytes)}%`;
    otpBar.value.textContent = humanBytes(size.bytes);
    streamBar.fill.style.width = `${logWidth(STREAM_KEY_BYTES)}%`;
    streamBar.value.textContent = `${STREAM_KEY_BYTES} B`;

    const ratio = size.bytes / STREAM_KEY_BYTES;
    note.innerHTML = `<b>${size.label}</b> を暗号化するとき —`
      + `<br>OTP: <b>${humanBytes(size.bytes)}</b> の完全ランダム鍵を生成し、安全な経路で配送する`
      + `<br>ストリーム暗号: <b>${STREAM_KEY_BYTES} B</b> の秘密鍵だけ配送し、残りは PRG が伸ばす`
      + `<br>→ 運ぶ鍵の量の比 <b>約 ${ratio.toExponential(1).replace('e+', " × 10^")} 倍</b>`;
  }

  slider.addEventListener('input', render);
  bumpBtn.addEventListener('click', () => {
    slider.value = '3';
    render();
  });

  render();
}
