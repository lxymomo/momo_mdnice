// app.js — 主逻辑

const App = (() => {
  const editor   = document.getElementById('md-editor');
  const preview  = document.getElementById('preview-box');

  // ── 从 Markdown 提取标题 ──
  function extractTitle(md) {
    const m = md.match(/^#\s+(.+)/m);
    return m ? m[1].replace(/^\d+\s+/, '').trim() : '';
  }

  // ── 实时预览 ──
  function renderPreview() {
    const md = editor.value;
    preview.innerHTML = saltParser(md, null);
  }

  // ── 封面 ──
  function renderCover() {
    const title = extractTitle(editor.value);
    CoverGen.render(title);
  }

  editor.addEventListener('input', () => {
    renderPreview();
    // 仅当标题输入框为空或与上次自动填入一致时，才同步更新
    const titleInput = document.getElementById('cover-title-input');
    const autoTitle = extractTitle(editor.value);
    if (!titleInput.dataset.manualEdit) {
      titleInput.value = autoTitle;
    }
  });

  // 用户手动编辑标题框后，不再自动同步
  document.getElementById('cover-title-input').addEventListener('input', (e) => {
    e.target.dataset.manualEdit = '1';
  });

  // ── 复制到公众号 ──
  document.getElementById('btn-copy').addEventListener('click', () => {
    // 用当前canvas封面重新渲染一次，把base64注入
    const coverBase64 = CoverGen.getDataURL();
    preview.innerHTML = saltParser(editor.value, coverBase64);

    const range = document.createRange();
    range.selectNodeContents(preview);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand('copy');
    sel.removeAllRanges();

    // 恢复预览（不带封面base64的普通预览）
    renderPreview();
    showToast();
  });

  // ── 模板管理 ──
  const STORAGE_KEY = 'salt_templates';

  function getTemplates() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  }
  function saveTemplates(tpls) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tpls));
  }

  document.getElementById('btn-save-tpl').addEventListener('click', () => {
    const name = prompt('模板名称：');
    if (!name) return;
    const tpls = getTemplates();
    tpls[name] = editor.value;
    saveTemplates(tpls);
    alert(`已保存「${name}」`);
  });

  document.getElementById('btn-load-tpl').addEventListener('click', () => {
    renderTplList();
    document.getElementById('modal-tpl').classList.remove('hidden');
  });

  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('modal-tpl').classList.add('hidden');
  });

  function renderTplList() {
    const tpls = getTemplates();
    const list = document.getElementById('tpl-list');
    const keys = Object.keys(tpls);
    if (!keys.length) {
      list.innerHTML = '<div style="color:#999;font-size:13px;">还没有保存的模板</div>';
      return;
    }
    list.innerHTML = keys.map(name => `
      <div class="tpl-item">
        <span>${name}</span>
        <div>
          <button class="btn-load" data-name="${name}">加载</button>
          <button class="btn-del"  data-name="${name}">删除</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.btn-load').forEach(btn => {
      btn.addEventListener('click', () => {
        editor.value = getTemplates()[btn.dataset.name];
        renderPreview();
        renderCover();
        document.getElementById('modal-tpl').classList.add('hidden');
      });
    });
    list.querySelectorAll('.btn-del').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm(`删除「${btn.dataset.name}」？`)) return;
        const tpls = getTemplates();
        delete tpls[btn.dataset.name];
        saveTemplates(tpls);
        renderTplList();
      });
    });
  }

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

** 加粗文字 **

[card]
心理盐的陪伴，从这里开始。
[/card]
`;

  editor.value = DEFAULT_MD;
  renderPreview();
  CoverGen.init(COVER_BG_BASE64).then(() => {
    const autoTitle = extractTitle(DEFAULT_MD);
    CoverGen.setTitle(autoTitle);
    CoverGen.render(autoTitle);
  });

  return { renderCover };
})();