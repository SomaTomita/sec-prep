/**
 * 「短い鍵 → PRG → 長いキーストリーム」の展開を、中身が見える LFSR で実演する。
 * LFSR は暗号学的には安全でない（Berlekamp–Massey で 2n ビットから復元される）が、
 * 「状態を更新しながら1ビットずつ出力する」という骨格は実用の PRG と共通なので教材に使う。
 */

import { parseBits, bitsToText, el, button, textField, bitRow, setBit } from './_ui.js';

const DEFAULT_SEED = '10110101';
const MAX_SHOWN = 64;    // 表示するキーストリーム長の上限（横スクロールが破綻しない範囲）
const PLAY_MS = 260;

/**
 * x^8 + x^6 + x^5 + x^4 + 1 に対応する Fibonacci LFSR を1ステップ進める。
 * @param {number[]} state 長さ8のビット配列（state[0] が入力側、state[7] が出力側）
 * @returns {{ out: number, next: number[] }}
 */
function stepLfsr(state) {
  const out = state[7];
  const feedback = state[7] ^ state[5] ^ state[4] ^ state[3];
  return { out, next: [feedback, ...state.slice(0, 7)] };
}

/**
 * @param {HTMLElement} root
 * @param {{ registerTeardown: (fn: () => void) => void }} ctx
 */
export function mount(root, ctx) {
  root.appendChild(el('div', 'stream-lab__title', '短い鍵をキーストリームに伸ばす（PRG の中身）'));

  const seedField = textField('秘密鍵（シード, 8bit）', root.dataset.seed || DEFAULT_SEED);
  const stepBtn = button('1ビット生成');
  const burstBtn = button('16ビット生成');
  const playBtn = button('自動再生');
  const resetBtn = button('最初から');
  const controls = el('div', 'stream-lab__controls');
  controls.append(seedField.wrap, stepBtn, burstBtn, playBtn, resetBtn);
  root.appendChild(controls);

  const regWrap = el('div', 'stream-lab__rows');
  root.appendChild(regWrap);

  const tape = el('div', 'stream-lab__tape');
  root.appendChild(tape);

  const note = el('div', 'stream-lab__note');
  note.setAttribute('role', 'status');
  note.setAttribute('aria-live', 'polite');
  root.appendChild(note);

  root.appendChild(el('div', 'stream-lab__warn',
    '※ この LFSR は「仕組みが見える」ことだけを目的にした玩具。実用の ChaCha20 などは'
    + '出力から内部状態を逆算できないよう設計されている。ここでの LFSR は出力 16 ビットから状態を復元できる。'));

  /** @type {number[]} */
  let state = [];
  /** @type {number[]} */
  let keystream = [];
  /** @type {HTMLElement[]} */
  let regCells = [];
  let timer = null;

  function stopPlay() {
    if (timer === null) return;
    clearInterval(timer);
    timer = null;
    playBtn.textContent = '自動再生';
  }
  ctx.registerTeardown(stopPlay);

  function renderTape() {
    tape.textContent = '';
    const shown = keystream.slice(-MAX_SHOWN);
    const head = el('div', 'stream-lab__tapehead',
      `キーストリーム Z（生成済み ${keystream.length} ビット`
      + `${keystream.length > MAX_SHOWN ? `／末尾 ${MAX_SHOWN} ビットを表示` : ''}）`);
    const row = el('div', 'stream-lab__taperow');
    shown.forEach((bit, i) => {
      const cell = el('span', 'stream-lab__bit', String(bit));
      if (bit === 1) cell.classList.add('stream-lab__bit--one');
      if (i === shown.length - 1) cell.classList.add('stream-lab__bit--pop');
      row.appendChild(cell);
    });
    tape.append(head, row);
  }

  function reset() {
    stopPlay();
    regWrap.textContent = '';
    keystream = [];
    try {
      const seed = parseBits(seedField.input.value, 8);
      if (seed.length !== 8) throw new Error('8 ビットちょうどで入力してください');
      if (seed.every((b) => b === 0)) {
        // LFSR の 0 状態は自己ループ。「鍵が悪いと PRG が死ぬ」典型例なので黙って直さず見せる。
        throw new Error('全 0 のシードは LFSR の固定点。出力が永久に 0 になる（＝鍵として使えない）');
      }
      state = seed;
    } catch (e) {
      note.textContent = `入力エラー: ${e.message}`;
      stepBtn.disabled = true; burstBtn.disabled = true; playBtn.disabled = true;
      tape.textContent = '';
      return;
    }
    stepBtn.disabled = false; burstBtn.disabled = false; playBtn.disabled = false;

    const reg = bitRow('内部状態（8bit）', 8);
    state.forEach((v, i) => setBit(reg.cells[i], v));
    regCells = reg.cells;
    regWrap.append(reg.row);
    renderTape();
    note.innerHTML = 'シードは <b>8 ビット</b>だけ。ここから何ビットでもキーストリームを引き出せる —— '
      + 'これが「短い鍵を運ぶだけでよい」理由。';
  }

  function step() {
    const { out, next } = stepLfsr(state);
    state = next;
    state.forEach((v, i) => setBit(regCells[i], v, { pop: i === 0 }));
    keystream.push(out);
    renderTape();
    const ratio = (keystream.length / 8).toFixed(1);
    note.innerHTML = `出力ビット <b>${out}</b> を取り出し、フィードバック <b>${state[0]}</b> を左端に押し込んで状態を更新した。`
      + `<br>8 ビットのシードから <b>${keystream.length} ビット</b>（シードの <b>${ratio} 倍</b>）を生成済み。`;
    if (keystream.length >= 255) stopPlay();
  }

  stepBtn.addEventListener('click', () => { stopPlay(); step(); });
  burstBtn.addEventListener('click', () => {
    stopPlay();
    for (let i = 0; i < 16; i += 1) step();
  });
  resetBtn.addEventListener('click', reset);
  seedField.input.addEventListener('change', reset);
  playBtn.addEventListener('click', () => {
    if (timer !== null) { stopPlay(); return; }
    playBtn.textContent = '一時停止';
    timer = setInterval(step, PLAY_MS);
  });

  reset();
  // 既定で少し流しておくと「伸びている」ことが一目で伝わる。
  // reset() が入力エラーで止まった場合は step() を呼べないので、ボタンの状態で判定する。
  if (!stepBtn.disabled) {
    const seedText = bitsToText(state);
    for (let i = 0; i < 12; i += 1) step();
    note.innerHTML = `8 ビットのシード <b>${seedText}</b> から、すでに `
      + `<b>${keystream.length} ビット</b>のキーストリームが出ている。ボタンでさらに伸ばせる。`;
  }
}
