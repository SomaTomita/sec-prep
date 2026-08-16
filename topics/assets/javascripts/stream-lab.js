/**
 * ストリーム暗号ビジュアル教材のブートストラップ。
 *
 * Markdown 側は `<div class="stream-lab" data-lab="xor-pad" data-...></div>` と書くだけで、
 * ここが `stream-labs/<data-lab>.js` を動的 import して DOM を組み立てる。
 * 描画ロジックを持たないのは、ページごとに必要なモジュールだけ読み込ませるため。
 */

const REGISTRY_BASE = new URL('./stream-labs/', import.meta.url);

// 各ウィジェットが登録した「後片付け関数」。mkdocs-material の instant navigation は
// 本文だけを差し替えるので、DOM から外れたウィジェットの setInterval が生き残る。
// boot() のたびに前ページ分をまとめて止める。
/** @type {Set<() => void>} */
const teardowns = new Set();

/**
 * ウィジェット側から呼ばれる後片付けの登録口。
 * @param {() => void} fn
 */
export function registerTeardown(fn) {
  teardowns.add(fn);
}

/**
 * @param {HTMLElement} el
 * @returns {Promise<void>}
 */
async function initLab(el) {
  if (el.dataset.labReady) return;
  el.dataset.labReady = '1';

  const slug = el.dataset.lab;
  if (!slug) throw new Error('data-lab が指定されていません');
  // slug はビルド時に自分で書く値だが、パス片が混ざると import 先が想定外になる。
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`data-lab が不正です: ${slug}`);

  const mod = await import(new URL(`${slug}.js`, REGISTRY_BASE));
  el.textContent = '';
  mod.mount(el, { registerTeardown });
}

function boot() {
  teardowns.forEach((fn) => {
    try {
      fn();
    } catch {
      // 後片付けの失敗で新しいページの初期化を止めない。
    }
  });
  teardowns.clear();

  document.querySelectorAll('.stream-lab').forEach((el) => {
    initLab(/** @type {HTMLElement} */ (el)).catch((e) => {
      el.textContent = `ウィジェットの読み込みに失敗しました: ${e.message}`;
    });
  });
}

// navigation.instant 有効時、2ページ目以降は DOMContentLoaded が発火しない。
// mkdocs-material が公開する document$ を購読して差し替えごとに再初期化する。
if (window.document$) {
  window.document$.subscribe(boot);
} else {
  document.addEventListener('DOMContentLoaded', boot);
}
