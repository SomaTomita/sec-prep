const REGISTRY_BASE = new URL('./algo-steppers/', import.meta.url);

function splitTopLevel(raw) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    if (ch === '[') depth += 1;
    else if (ch === ']') depth -= 1;
    else if (ch === ',' && depth === 0) {
      parts.push(raw.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(raw.slice(start));
  return parts;
}

function parseInputDefaults(raw) {
  const inputs = {};
  if (!raw) return inputs;
  splitTopLevel(raw).forEach((pair) => {
    const [name, value] = pair.split(':');
    inputs[name.trim()] = value.trim();
  });
  return inputs;
}

function parseArgValue(raw) {
  const trimmed = raw.trim();
  if (trimmed.startsWith('[')) return JSON.parse(trimmed);
  return Number(trimmed);
}

function mkButton(label) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = label;
  return btn;
}

function renderCode(container, pySource) {
  const pre = document.createElement('pre');
  pre.className = 'algo-widget__code';
  pySource.replace(/\n$/, '').split('\n').forEach((text, i) => {
    const span = document.createElement('span');
    span.className = 'algo-widget__line';
    span.dataset.line = String(i + 1);
    span.textContent = text.length ? text : ' ';
    pre.appendChild(span);
  });
  container.appendChild(pre);
  return pre;
}

function highlightLine(pre, lineNo) {
  pre.querySelectorAll('.algo-widget__line--active').forEach((el) => {
    el.classList.remove('algo-widget__line--active');
  });
  if (lineNo == null) return;
  const target = pre.querySelector(`.algo-widget__line[data-line="${lineNo}"]`);
  if (target) target.classList.add('algo-widget__line--active');
}

async function initWidget(el) {
  if (el.dataset.algoReady) return;
  el.dataset.algoReady = '1';

  const slug = el.dataset.algo;
  const inputDefaults = parseInputDefaults(el.dataset.inputs);
  const mod = await import(new URL(`${slug}.js`, REGISTRY_BASE));
  const pySource = await mod.loadSource();

  el.innerHTML = '';

  const inputsBar = document.createElement('div');
  inputsBar.className = 'algo-widget__inputs';
  const inputEls = {};
  Object.entries(inputDefaults).forEach(([name, defaultValue]) => {
    const field = document.createElement('div');
    field.className = 'algo-widget__field';
    const id = `${slug}-${name}-${Math.random().toString(36).slice(2, 7)}`;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = name;
    const input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.value = defaultValue;
    field.append(label, input);
    inputsBar.appendChild(field);
    inputEls[name] = input;
  });
  el.appendChild(inputsBar);

  const codePre = renderCode(el, pySource);

  const controls = document.createElement('div');
  controls.className = 'algo-widget__controls';
  const resetBtn = mkButton('Reset');
  const prevBtn = mkButton('Prev');
  const nextBtn = mkButton('Next');
  const playBtn = mkButton('Play');
  controls.append(resetBtn, prevBtn, nextBtn, playBtn);
  el.appendChild(controls);

  const state = document.createElement('div');
  state.className = 'algo-widget__state';
  state.setAttribute('role', 'status');
  state.setAttribute('aria-live', 'polite');
  el.appendChild(state);

  let steps = [];
  let cursor = -1;
  let playTimer = null;

  function parseArgs() {
    const args = {};
    Object.entries(inputEls).forEach(([name, input]) => {
      args[name] = parseArgValue(input.value);
    });
    return args;
  }

  function renderState() {
    const step = steps[cursor];
    prevBtn.disabled = cursor <= 0;
    nextBtn.disabled = !steps.length || cursor >= steps.length - 1;
    if (!step) {
      highlightLine(codePre, null);
      state.textContent = '入力値を確認し、Reset を押すと実行を開始します。';
      return;
    }
    highlightLine(codePre, step.line);
    const varsText = Object.entries(step.vars)
      .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
      .join(', ');
    state.textContent = `[${cursor + 1}/${steps.length}] ${step.note} — ${varsText}`;
  }

  function stopPlay() {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
      playBtn.textContent = 'Play';
    }
  }

  function reset() {
    stopPlay();
    try {
      steps = mod.run(parseArgs());
      cursor = steps.length ? 0 : -1;
    } catch (e) {
      steps = [];
      cursor = -1;
      state.textContent = `入力エラー: ${e.message}`;
      return;
    }
    renderState();
  }

  resetBtn.addEventListener('click', reset);
  prevBtn.addEventListener('click', () => {
    stopPlay();
    if (cursor > 0) { cursor -= 1; renderState(); }
  });
  nextBtn.addEventListener('click', () => {
    stopPlay();
    if (cursor < steps.length - 1) { cursor += 1; renderState(); }
  });
  playBtn.addEventListener('click', () => {
    if (playTimer) { stopPlay(); return; }
    playBtn.textContent = 'Pause';
    playTimer = setInterval(() => {
      if (cursor >= steps.length - 1) { stopPlay(); return; }
      cursor += 1;
      renderState();
    }, 900);
  });

  reset();
}

function boot() {
  document.querySelectorAll('.algo-widget').forEach((el) => {
    initWidget(el).catch((e) => {
      el.textContent = `ウィジェットの読み込みに失敗しました: ${e.message}`;
    });
  });
}

// mkdocs-material の instant navigation（navigation.instant）はページ本文だけを
// 差し替えるため、通常の DOMContentLoaded は2ページ目以降で発火しない。
// document$ を購読して差し替えのたびに再初期化する。
if (window.document$) {
  window.document$.subscribe(boot);
} else {
  document.addEventListener('DOMContentLoaded', boot);
}
