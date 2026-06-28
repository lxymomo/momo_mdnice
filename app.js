// app.js — 主逻辑

const App = (() => {
  const editor  = document.getElementById('md-editor');
  const preview = document.getElementById('preview-box');

  // ── 从 Markdown 提取标题 ──
  function extractTitle(md) {
    const m = md.match(/^#\s+(.+)/m);
    return m ? m[1].replace(/^\d+\s+/, '').trim() : '';
  }

  // ── 实时预览 ──
  function renderPreview() {
    preview.innerHTML = saltParser(editor.value, null);
  }

  // ── 封面 ──
  function renderCover() {
    const title = extractTitle(editor.value);
    CoverGen.render(title);
  }

  // ── 字数统计 ──
  function updateCharCount() {
    document.getElementById('char-count').textContent =
      editor.value.length.toLocaleString();
  }

  // ── 自动保存草稿 ──
  const DRAFT_KEY = 'salt_draft';
  let draftTimer = null;
  function saveDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, editor.value);
      const ind = document.getElementById('save-indicator');
      ind.textContent = '已保存';
      ind.classList.add('saved');
      clearTimeout(ind._t);
      ind._t = setTimeout(() => {
        ind.textContent = '自动保存';
        ind.classList.remove('saved');
      }, 1500);
    }, 800);
  }

  editor.addEventListener('input', () => {
    renderPreview();
    updateCharCount();
    saveDraft();
    const titleInput = document.getElementById('cover-title-input');
    const autoTitle = extractTitle(editor.value);
    if (!titleInput.dataset.manualEdit) {
      titleInput.value = autoTitle;
    }
  });

  // ── Markdown 工具栏 ──
  function insertMd(before, after = '', placeholder = '') {
    const start = editor.selectionStart;
    const end   = editor.selectionEnd;
    const sel   = editor.value.slice(start, end);
    const body  = sel || placeholder;
    editor.value = editor.value.slice(0, start) + before + body + after + editor.value.slice(end);
    editor.focus();
    editor.setSelectionRange(start + before.length, start + before.length + body.length);
    renderPreview();
    updateCharCount();
    saveDraft();
  }

  function insertLinePrefix(prefix) {
    const pos       = editor.selectionStart;
    const lineStart = editor.value.lastIndexOf('\n', pos - 1) + 1;
    editor.value    = editor.value.slice(0, lineStart) + prefix + editor.value.slice(lineStart);
    editor.focus();
    editor.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    renderPreview();
    updateCharCount();
    saveDraft();
  }

  document.querySelector('.md-toolbar').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    switch (btn.dataset.action) {
      case 'heading': insertLinePrefix('# '); break;
      case 'bold':    insertMd('**', '**', '加粗文字'); break;
      case 'quote':   insertLinePrefix('> '); break;
      case 'list':    insertLinePrefix('- '); break;
      case 'card':    insertMd('[card]\n', '\n[/card]', '输入卡片内容'); break;
    }
  });

  document.getElementById('cover-title-input').addEventListener('input', (e) => {
    e.target.dataset.manualEdit = '1';
  });

  // ── 复制到公众号 ──
  document.getElementById('btn-copy').addEventListener('click', () => {
    const coverBase64 = CoverGen.getDataURL();
    preview.innerHTML = saltParser(editor.value, coverBase64);

    const range = document.createRange();
    range.selectNodeContents(preview);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand('copy');
    sel.removeAllRanges();

    renderPreview();
    showToast();
  });

  // ── 主题切换 ──────────────────────────────────────────────────
  const THEME_STORAGE_KEY = 'salt_active_theme';
  const themeSelect = document.getElementById('theme-select');

  // 用 THEMES 填充下拉选项
  Object.entries(THEMES).forEach(([key, theme]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = theme.label;
    themeSelect.appendChild(opt);
  });

  // 恢复上次选择的主题
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme && THEMES[savedTheme]) {
    themeSelect.value = savedTheme;
    window.SALT_STYLE = THEMES[savedTheme].style;
  }

  // 切换时：更新 SALT_STYLE → 重新渲染预览 → 记住选择
  themeSelect.addEventListener('change', () => {
    const key = themeSelect.value;
    if (!THEMES[key]) return;
    window.SALT_STYLE = THEMES[key].style;
    localStorage.setItem(THEME_STORAGE_KEY, key);
    renderPreview();
  });
  // ──────────────────────────────────────────────────────────────

  // ── Toast ──
  function showToast() {
    const t = document.getElementById('toast');
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 2500);
  }

  // ── 初始化 ──
  const DEFAULT_MD = `

# 01 章节

在这里写你的内容...

> 引用一段话

- 列表项一
- 列表项二

**加粗文字**

[card]
心理盐的陪伴，从这里开始。
[/card]
`;

  const savedDraft = localStorage.getItem(DRAFT_KEY);
  editor.value = savedDraft !== null ? savedDraft : DEFAULT_MD;
  renderPreview();
  updateCharCount();
  CoverGen.init(COVER_BG_BASE64).then(() => {
    const autoTitle = extractTitle(DEFAULT_MD);
    CoverGen.setTitle(autoTitle);
    CoverGen.render(autoTitle);
  });

  return { renderCover };
})();

// ── 查找替换模块 ──────────────────────────────────────────────────
const FindReplace = (() => {
  const FIND_KEY    = 'salt_find_history';
  const REPLACE_KEY = 'salt_replace_history';
  const MAX_HIST    = 10;

  const panel      = document.getElementById('find-replace-panel');
  const findInput  = document.getElementById('fr-find');
  const replInput  = document.getElementById('fr-replace');
  const status     = document.getElementById('fr-status');
  const findDD     = document.getElementById('fr-find-dropdown');
  const replDD     = document.getElementById('fr-replace-dropdown');
  const undoBtn    = document.getElementById('fr-undo');
  const editor     = document.getElementById('md-editor');

  let matchIndex = -1;
  let matches    = [];
  const undoStack = [];

  function pushUndo() {
    undoStack.push(editor.value);
    undoBtn.disabled = false;
  }

  // ── 历史记录 ──
  function getHist(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  function addHist(key, val) {
    if (!val) return;
    let list = getHist(key).filter(v => v !== val);
    list.unshift(val);
    if (list.length > MAX_HIST) list = list.slice(0, MAX_HIST);
    localStorage.setItem(key, JSON.stringify(list));
  }

  function renderDropdown(dd, key, targetInput) {
    const hist = getHist(key);
    if (!hist.length) {
      dd.innerHTML = '<div class="fr-dropdown-empty">暂无历史记录</div>';
    } else {
      dd.innerHTML = hist.map(v =>
        `<div class="fr-dropdown-item" title="${v}">${v}</div>`
      ).join('');
      dd.querySelectorAll('.fr-dropdown-item').forEach((el, i) => {
        el.addEventListener('click', () => {
          targetInput.value = hist[i];
          dd.classList.add('hidden');
          updateMatches();
        });
      });
    }
    dd.classList.remove('hidden');
  }

  // ── 历史按钮 ──
  document.querySelectorAll('.fr-hist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.dataset.target;
      const targetInput = document.getElementById(targetId);
      const dd = targetId === 'fr-find' ? findDD : replDD;
      const key = targetId === 'fr-find' ? FIND_KEY : REPLACE_KEY;
      const isHidden = dd.classList.contains('hidden');
      findDD.classList.add('hidden');
      replDD.classList.add('hidden');
      if (isHidden) renderDropdown(dd, key, targetInput);
    });
  });

  document.addEventListener('click', () => {
    findDD.classList.add('hidden');
    replDD.classList.add('hidden');
  });

  // ── 查找逻辑 ──
  function updateMatches() {
    const keyword = findInput.value;
    matches = [];
    matchIndex = -1;
    if (!keyword) { status.textContent = ''; return; }
    const text = editor.value;
    let idx = 0;
    while ((idx = text.indexOf(keyword, idx)) !== -1) {
      matches.push(idx);
      idx += keyword.length;
    }
    status.textContent = matches.length ? `找到 ${matches.length} 处` : '未找到匹配内容';
  }

  function findNext() {
    updateMatches();
    if (!matches.length) return;
    matchIndex = (matchIndex + 1) % matches.length;
    const start = matches[matchIndex];
    const end   = start + findInput.value.length;
    editor.focus();
    editor.setSelectionRange(start, end);
    status.textContent = `第 ${matchIndex + 1} / ${matches.length} 处`;
  }

  function replaceOne() {
    const keyword = findInput.value;
    const replVal = replInput.value;
    if (!keyword) return;
    updateMatches();
    if (!matches.length) return;
    matchIndex = Math.max(0, matchIndex) % matches.length;
    const start = matches[matchIndex];
    const text  = editor.value;
    pushUndo();
    editor.value = text.slice(0, start) + replVal + text.slice(start + keyword.length);
    addHist(FIND_KEY, keyword);
    addHist(REPLACE_KEY, replVal);
    document.getElementById('preview-box').innerHTML = saltParser(editor.value, null);
    updateMatches();
    if (matches.length) findNext();
    else status.textContent = '替换完成，无更多匹配';
  }

  function replaceAll() {
    const keyword = findInput.value;
    const replVal = replInput.value;
    if (!keyword) return;
    const count = (editor.value.split(keyword).length - 1);
    if (!count) { status.textContent = '未找到匹配内容'; return; }
    pushUndo();
    editor.value = editor.value.split(keyword).join(replVal);
    addHist(FIND_KEY, keyword);
    addHist(REPLACE_KEY, replVal);
    document.getElementById('preview-box').innerHTML = saltParser(editor.value, null);
    matchIndex = -1;
    matches = [];
    status.textContent = `已替换 ${count} 处`;
  }

  // ── 面板开关 ──
  document.getElementById('btn-find-replace').addEventListener('click', () => {
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) findInput.focus();
  });
  document.getElementById('fr-close').addEventListener('click', () => {
    panel.classList.add('hidden');
  });

  // ── 按钮事件 ──
  document.getElementById('fr-find-next').addEventListener('click', findNext);
  document.getElementById('fr-replace-one').addEventListener('click', replaceOne);
  document.getElementById('fr-replace-all').addEventListener('click', replaceAll);
  undoBtn.addEventListener('click', () => {
    if (!undoStack.length) return;
    editor.value = undoStack.pop();
    document.getElementById('preview-box').innerHTML = saltParser(editor.value, null);
    updateMatches();
    undoBtn.disabled = undoStack.length === 0;
    status.textContent = undoStack.length ? `已撤销，还可撤销 ${undoStack.length} 步` : '已撤销';
  });

  findInput.addEventListener('input', updateMatches);
  findInput.addEventListener('keydown', e => { if (e.key === 'Enter') findNext(); });
  replInput.addEventListener('keydown', e => { if (e.key === 'Enter') replaceOne(); });

  // ── 键盘快捷键 ──
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      panel.classList.remove('hidden');
      findInput.focus();
      findInput.select();
    }
    if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
      panel.classList.add('hidden');
    }
  });
})();