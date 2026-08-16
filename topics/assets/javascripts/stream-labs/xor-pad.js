/**
 * Vernam 暗号 / ワンタイムパッドの1ビット単位デモ。
 * 暗号化 C = P ⊕ K を1ビットずつ進め、続けて復号 C ⊕ K が P に戻るところまで見せる。
 */

import {
  parseBits, randomBits, bitsToText, el, button, textField,
  bitRow, setBit, highlightColumn,
} from './_ui.js';

const DEFAULT_P = '10110010';
const DEFAULT_K = '01101101';
const PLAY_MS = 620;

/**
 * @param {HTMLElement} root
 * @param {{ registerTeardown: (fn: () => void) => void }} ctx
 */
export function mount(root, ctx) {
  root.appendChild(el('div', 'stream-lab__title', 'Vernam / OTP — 1ビットずつ XOR する'));

  const pField = textField('平文 P', root.dataset.plaintext || DEFAULT_P);
  const kField = textField('鍵 K（＝キーストリーム）', root.dataset.key || DEFAULT_K);
  const randBtn = button('鍵をランダムに');
  const stepBtn = button('1ビット進む');
  const playBtn = button('自動再生');
  const resetBtn = button('最初から');

  const controls = el('div', 'stream-lab__controls');
  controls.append(pField.wrap, kField.wrap, randBtn, stepBtn, playBtn, resetBtn);
  root.appendChild(controls);

  const rows = el('div', 'stream-lab__rows');
  root.appendChild(rows);

  const note = el('div', 'stream-lab__note');
  note.setAttribute('role', 'status');
  note.setAttribute('aria-live', 'polite');
  root.appendChild(note);

  /** @type {{ p: number[], k: number[], c: number[] }} */
  let data = { p: [], k: [], c: [] };
  /** @type {Record<string, HTMLElement[]>} */
  let cells = {};
  let cursor = -1;      // -1 = 未開始。0..n-1 が暗号化、n..2n-1 が復号。
  let timer = null;

  function stopPlay() {
    if (timer === null) return;
    clearInterval(timer);
    timer = null;
    playBtn.textContent = '自動再生';
  }
  ctx.registerTeardown(stopPlay);

  /** 入力値を読み直して盤面を組み直す。 */
  function rebuild() {
    stopPlay();
    rows.textContent = '';
    cursor = -1;
    try {
      const p = parseBits(pField.input.value, 24);
      const k = parseBits(kField.input.value, 24);
      if (p.length !== k.length) {
        throw new Error(`OTP は鍵が平文と同じ長さでなければなりません（P=${p.length}bit, K=${k.length}bit）`);
      }
      data = { p, k, c: p.map((v, i) => v ^ k[i]) };
    } catch (e) {
      note.textContent = `入力エラー: ${e.message}`;
      stepBtn.disabled = true;
      playBtn.disabled = true;
      return;
    }

    const n = data.p.length;
    const encP = bitRow('平文 P', n);
    const encK = bitRow('⊕ 鍵 K', n);
    const encC = bitRow('= 暗号文 C', n, { blank: true });
    const decC = bitRow('暗号文 C', n, { blank: true });
    const decK = bitRow('⊕ 同じ鍵 K', n);
    const decP = bitRow('= 復号 P′', n, { blank: true });

    data.p.forEach((v, i) => setBit(encP.cells[i], v));
    data.k.forEach((v, i) => { setBit(encK.cells[i], v); setBit(decK.cells[i], v); });

    rows.append(
      el('div', 'stream-lab__op', '暗号化'),
      encP.row, encK.row, el('div', 'stream-lab__rule'), encC.row,
      el('div', 'stream-lab__op', '復号'),
      decC.row, decK.row, el('div', 'stream-lab__rule'), decP.row,
    );
    cells = {
      encP: encP.cells, encK: encK.cells, encC: encC.cells,
      decC: decC.cells, decK: decK.cells, decP: decP.cells,
    };
    stepBtn.disabled = false;
    playBtn.disabled = false;
    note.innerHTML = '「1ビット進む」で <b>C = P ⊕ K</b> を1桁ずつ計算します。'
      + '後半では同じ鍵で <b>P′ = C ⊕ K</b> を計算し、元の平文に戻ることを確認します。';
  }

  /** カーソルを1つ進めて、その1ビットぶんの表示と説明を更新する。 */
  function step() {
    const n = data.p.length;
    if (cursor >= 2 * n - 1) { stopPlay(); return; }
    cursor += 1;

    if (cursor < n) {
      const i = cursor;
      setBit(cells.encC[i], data.c[i], { pop: true });
      setBit(cells.decC[i], data.c[i]);
      highlightColumn([cells.encP, cells.encK, cells.encC], i);
      highlightColumn([cells.decC, cells.decK, cells.decP], null);
      note.innerHTML = `暗号化 ${i + 1}/${n} 桁目 — <b>${data.p[i]} ⊕ ${data.k[i]} = ${data.c[i]}</b>`
        + `（XOR は「違えば 1、同じなら 0」）`;
    } else {
      const i = cursor - n;
      setBit(cells.decP[i], data.p[i], { pop: true });
      highlightColumn([cells.encP, cells.encK, cells.encC], null);
      highlightColumn([cells.decC, cells.decK, cells.decP], i);
      note.innerHTML = `復号 ${i + 1}/${n} 桁目 — <b>${data.c[i]} ⊕ ${data.k[i]} = ${data.p[i]}</b>`
        + `　同じ鍵を2回 XOR すると打ち消し合う（K ⊕ K = 0）ので平文が戻る`;
    }

    if (cursor === 2 * n - 1) {
      stopPlay();
      highlightColumn([cells.decC, cells.decK, cells.decP], null);
      note.innerHTML = `完了 — P = <b>${bitsToText(data.p)}</b> / C = <b>${bitsToText(data.c)}</b> / `
        + `P′ = <b>${bitsToText(data.p)}</b>。P′ が元の P と一致した。`
        + '<br>C ⊕ K = (P ⊕ K) ⊕ K = P ⊕ (K ⊕ K) = P ⊕ 0 = P';
    }
  }

  randBtn.addEventListener('click', () => {
    const n = pField.input.value.replace(/\s+/g, '').length || DEFAULT_P.length;
    kField.input.value = bitsToText(randomBits(n));
    rebuild();
  });
  stepBtn.addEventListener('click', () => { stopPlay(); step(); });
  resetBtn.addEventListener('click', rebuild);
  pField.input.addEventListener('change', rebuild);
  kField.input.addEventListener('change', rebuild);
  playBtn.addEventListener('click', () => {
    if (timer !== null) { stopPlay(); return; }
    playBtn.textContent = '一時停止';
    timer = setInterval(step, PLAY_MS);
  });

  rebuild();
}
