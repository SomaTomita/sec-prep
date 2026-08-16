/**
 * ストリーム暗号を有限状態機械（FSM）として描くデモ。
 * K と IV から状態を初期化し、next state function / output function を1ステップずつ動かして
 * キーストリーム Z を出し、左レーンで C = P ⊕ Z、右レーンで P = C ⊕ Z を同時に見せる。
 */

import { parseBits, randomBits, bitsToText, el, button, textField, setBit } from './_ui.js';

const DEFAULT_KEY = '10110101';
const DEFAULT_IV = '00110011';
const DEFAULT_P = '10110010';
const PLAY_MS = 900;

/**
 * 教材用の next state function。x^8 + x^6 + x^5 + x^4 + 1 の LFSR。
 * @param {number[]} state
 * @returns {number[]}
 */
function nextState(state) {
  const feedback = state[7] ^ state[5] ^ state[4] ^ state[3];
  return [feedback, ...state.slice(0, 7)];
}

/**
 * 教材用の output function。状態の右端ビットを取り出すだけ。
 * @param {number[]} state
 * @returns {number}
 */
function outputBit(state) {
  return state[7];
}

/**
 * ブロック間をつなぐ縦線。order は上から数えた通し番号で、パルスの遅延に使う。
 * @param {number} order
 * @param {string} [label]
 * @returns {HTMLElement}
 */
function wire(order, label) {
  const node = el('div', 'stream-lab__wire');
  node.dataset.wire = String(order);
  if (label) node.appendChild(el('span', 'stream-lab__wirelabel', label));
  return node;
}

/**
 * 1レーンぶんのブロック図を組み立てる。
 * @param {string} title
 * @param {string} inLabel 入力側のラベル（"P" or "C"）
 * @param {string} outLabel 出力側のラベル（"C" or "P"）
 */
function buildLane(title, inLabel, outLabel) {
  const lane = el('div', 'stream-lab__lane');
  lane.appendChild(el('div', 'stream-lab__lanetitle', title));

  const keys = el('div', 'stream-lab__chips');
  const kChip = el('span', 'stream-lab__chip', 'K');
  const ivChip = el('span', 'stream-lab__chip', 'IV');
  keys.append(kChip, ivChip);
  lane.appendChild(keys);

  // data-wire は「信号が上から下へ流れる順番」。CSS 側の animation-delay がこれを見る。
  lane.appendChild(wire(1));
  lane.appendChild(el('div', 'stream-lab__box', 'next state function'));
  lane.appendChild(wire(2, 'state'));
  const stateCells = el('div', 'stream-lab__staterow');
  /** @type {HTMLElement[]} */
  const cells = [];
  for (let i = 0; i < 8; i += 1) {
    const cell = el('span', 'stream-lab__bit', '0');
    stateCells.appendChild(cell);
    cells.push(cell);
  }
  lane.appendChild(stateCells);
  lane.appendChild(wire(3));
  lane.appendChild(el('div', 'stream-lab__box', 'output function'));
  lane.appendChild(wire(4, 'Z'));

  const xorRow = el('div', 'stream-lab__xorrow');
  const inChip = el('span', 'stream-lab__chip', `${inLabel} = ?`);
  const zChip = el('span', 'stream-lab__chip stream-lab__chip--z', 'Z = ?');
  xorRow.append(inChip, el('span', 'stream-lab__xorsign', '⊕'), zChip);
  lane.appendChild(xorRow);

  lane.appendChild(wire(5));
  const outChip = el('div', 'stream-lab__out', `${outLabel} = ?`);
  lane.appendChild(outChip);

  return { lane, kChip, ivChip, cells, inChip, zChip, outChip };
}

/**
 * @param {HTMLElement} root
 * @param {{ registerTeardown: (fn: () => void) => void }} ctx
 */
export function mount(root, ctx) {
  root.appendChild(el('div', 'stream-lab__title', 'ストリーム暗号 = 状態機械（FSM）'));

  const kField = textField('鍵 K（8bit）', root.dataset.key || DEFAULT_KEY);
  const ivField = textField('IV（8bit）', root.dataset.iv || DEFAULT_IV);
  const pField = textField('平文 P', root.dataset.plaintext || DEFAULT_P);
  const ivBtn = button('IV を変える');
  const stepBtn = button('1ステップ');
  const playBtn = button('自動再生');
  const resetBtn = button('最初から');
  const controls = el('div', 'stream-lab__controls');
  controls.append(kField.wrap, ivField.wrap, pField.wrap, ivBtn, stepBtn, playBtn, resetBtn);
  root.appendChild(controls);

  const stage = el('div', 'stream-lab__stage');
  const enc = buildLane('暗号化：C = P ⊕ Z', 'P', 'C');
  const dec = buildLane('復号：P = C ⊕ Z', 'C', 'P');
  stage.append(enc.lane, dec.lane);
  root.appendChild(stage);

  const note = el('div', 'stream-lab__note');
  note.setAttribute('role', 'status');
  note.setAttribute('aria-live', 'polite');
  root.appendChild(note);

  root.appendChild(el('div', 'stream-lab__warn',
    '※ 初期化を state₀ = K ⊕ IV、next state function を LFSR、output function を「右端ビットを取る」に'
    + '単純化している。実在の暗号（ChaCha20 等）は同じ骨格のまま、これらを解析困難な関数に置き換えている。'));

  /** @type {{ key: number[], iv: number[], p: number[], encState: number[], decState: number[] }} */
  let s = { key: [], iv: [], p: [], encState: [], decState: [] };
  let cursor = -1;
  /** @type {number[]} */
  let cipher = [];
  let timer = null;

  function stopPlay() {
    if (timer === null) return;
    clearInterval(timer);
    timer = null;
    playBtn.textContent = '自動再生';
  }
  ctx.registerTeardown(stopPlay);

  /** 両レーンのワイヤに沿ってパルスを流し直す。 */
  function pulse() {
    [enc.lane, dec.lane].forEach((lane) => {
      lane.classList.remove('stream-lab__lane--pulse');
      void lane.offsetWidth; // アニメーションを頭から再生させるための強制リフロー
      lane.classList.add('stream-lab__lane--pulse');
    });
  }

  /**
   * @param {{ cells: HTMLElement[] }} lane
   * @param {number[]} state
   */
  function paintState(lane, state) {
    state.forEach((v, i) => setBit(lane.cells[i], v));
  }

  function reset() {
    stopPlay();
    cursor = -1;
    cipher = [];
    try {
      const key = parseBits(kField.input.value, 8);
      const iv = parseBits(ivField.input.value, 8);
      if (key.length !== 8 || iv.length !== 8) throw new Error('K と IV は 8 ビットちょうどで入力してください');
      const p = parseBits(pField.input.value, 24);
      const init = key.map((v, i) => v ^ iv[i]);
      if (init.every((b) => b === 0)) throw new Error('K ⊕ IV が全 0 になり LFSR が停止する。IV を変えてください');
      s = { key, iv, p, encState: init, decState: [...init] };
    } catch (e) {
      note.textContent = `入力エラー: ${e.message}`;
      stepBtn.disabled = true; playBtn.disabled = true;
      return;
    }
    stepBtn.disabled = false; playBtn.disabled = false;

    [enc, dec].forEach((lane) => {
      lane.kChip.textContent = `K = ${bitsToText(s.key)}`;
      lane.ivChip.textContent = `IV = ${bitsToText(s.iv)}`;
      paintState(lane, s.encState);
    });
    enc.inChip.textContent = 'P = ?';
    dec.inChip.textContent = 'C = ?';
    enc.zChip.textContent = 'Z = ?';
    dec.zChip.textContent = 'Z = ?';
    enc.outChip.textContent = 'C = ?';
    dec.outChip.textContent = 'P = ?';
    note.innerHTML = `state₀ = K ⊕ IV = <b>${bitsToText(s.encState)}</b> で初期化した。`
      + '「1ステップ」で状態を1回更新し、Z を1ビット取り出す。左右のレーンは同じ K・IV を持つので'
      + '<b>同じ Z</b> が出る —— それが復号できる理由。';
  }

  function step() {
    if (cursor >= s.p.length - 1) { stopPlay(); return; }
    cursor += 1;

    s.encState = nextState(s.encState);
    s.decState = nextState(s.decState);
    const z = outputBit(s.encState);
    const pBit = s.p[cursor];
    const cBit = pBit ^ z;
    const recovered = cBit ^ outputBit(s.decState);
    cipher.push(cBit);

    paintState(enc, s.encState);
    paintState(dec, s.decState);
    enc.inChip.textContent = `P = ${pBit}`;
    enc.zChip.textContent = `Z = ${z}`;
    enc.outChip.textContent = `C = ${cBit}`;
    dec.inChip.textContent = `C = ${cBit}`;
    dec.zChip.textContent = `Z = ${outputBit(s.decState)}`;
    dec.outChip.textContent = `P = ${recovered}`;
    pulse();

    note.innerHTML = `ステップ ${cursor + 1}/${s.p.length} — `
      + `暗号化 <b>${pBit} ⊕ ${z} = ${cBit}</b>／復号 <b>${cBit} ⊕ ${z} = ${recovered}</b>`
      + `<br>ここまでの C = <b>${bitsToText(cipher)}</b>`;

    if (cursor === s.p.length - 1) {
      stopPlay();
      note.innerHTML += `<br>完了 — P = <b>${bitsToText(s.p)}</b> が C = <b>${bitsToText(cipher)}</b> になり、`
        + '同じ FSM を回した右レーンで元通りに戻った。';
    }
  }

  ivBtn.addEventListener('click', () => {
    ivField.input.value = bitsToText(randomBits(8));
    reset();
  });
  stepBtn.addEventListener('click', () => { stopPlay(); step(); });
  resetBtn.addEventListener('click', reset);
  [kField, ivField, pField].forEach((f) => f.input.addEventListener('change', reset));
  playBtn.addEventListener('click', () => {
    if (timer !== null) { stopPlay(); return; }
    playBtn.textContent = '一時停止';
    timer = setInterval(step, PLAY_MS);
  });

  reset();
}
