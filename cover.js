// cover.js — Canvas 封面生成

const CoverGen = (() => {
  const canvas = document.getElementById('cover-canvas');
  const ctx = canvas.getContext('2d');

  let bgImage = null;         // 用户上传的背景图
  let defaultBgLoaded = null; // 默认背景图

  // 默认背景色（无图时用渐变兜底）
  function drawFallbackBg() {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, 'rgb(62, 97, 61)');
    grad.addColorStop(1, 'rgb(100, 140, 98)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawTitle(title, textColor, fontSize) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${fontSize}px "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif`;

    const maxWidth = canvas.width * 0.75;
    const words = title.split('');
    let line = '';
    const lines = [];
    for (let ch of words) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = ch;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);

    const lineHeight = fontSize * 1.4;
    const totalH = lines.length * lineHeight;
    const startY = canvas.height / 2 - totalH / 2 + lineHeight / 2;

    ctx.fillStyle = textColor;
    lines.forEach((l, idx) => {
      ctx.fillText(l, canvas.width / 2, startY + idx * lineHeight);
    });

    ctx.restore();
  }
  function render(title) {
    const textColor = document.getElementById('cover-text-color').value;
    const fontSize  = parseInt(document.getElementById('cover-font-size').value);
    const img = bgImage || defaultBgLoaded;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (img) {
      // cover-fit：裁切填满
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const dw = img.width * scale, dh = img.height * scale;
      ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    } else {
      drawFallbackBg();
    }

    if (title) drawTitle(title, textColor, fontSize);
  }

  // 加载默认背景（把你的图放 assets/cover-bg.png）
  function loadDefaultBg(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { defaultBgLoaded = img; resolve(); };
      img.onerror = () => resolve(); // 失败则用渐变兜底
      img.src = url;
    });
  }

  // 用户上传背景图
  document.getElementById('cover-bg-upload').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => { bgImage = img; App.renderCover(); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // 下载
  document.getElementById('btn-download-cover').addEventListener('click', () => {
    const a = document.createElement('a');
    a.download = '封面.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  });

  // 更新封面按钮
  document.getElementById('btn-update-cover').addEventListener('click', () => {
    const title = document.getElementById('cover-title-input').value;
    render(title);
  });

  return {
    init: (defaultBgUrl) => loadDefaultBg(defaultBgUrl).then(() => render('')),
    render,
    getDataURL: () => canvas.toDataURL('image/png'),
    setTitle: (t) => { document.getElementById('cover-title-input').value = t; },
  };
})();