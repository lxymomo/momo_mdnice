// @ts-nocheck
// scripts/templates.js — 双主题版本
// 主题一：观夏·留白（绿色系，宣纸纹理）
// 主题二：晴山·烟青（青灰系，水彩纸纹理）

const _TEX_WASHI = "data:image/jpeg;base64,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";
const _TEX_WATERCOLOR = "data:image/jpeg;base64,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";

function buildTheme({
  primary, accent, bgPaper, textColor,
  quoteBg, cardBg,
  hrColor, hrStyle,
  h1NumStyle, h1NumColor,
  listBg, listText,
  boldColor, boldBg,
  paperTex, paperOpacity,
  footerStyle,
  lineHeight, letterSpacing,
}) {
  const lh = lineHeight    || '1.85';
  const ls = letterSpacing || '0.5px';

  // 纸纹覆盖层：用绝对定位的 section 铺在最外层内部
  // 微信粘贴后 background-image base64 会被保留
  const paperLayer = paperTex
    ? `<section style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;background-image:url('${paperTex}');background-repeat:repeat;background-size:300px;opacity:${paperOpacity || 0.12};mix-blend-mode:multiply;box-sizing:border-box;"></section>`
    : '';

  return {
    primary, accent, bgPaper, textColor,
    boldColor, boldBg,
    paperLayer,
    cardLogoUrl: typeof LOGO_BASE64 !== 'undefined' ? LOGO_BASE64 : '',

    pStyle: `margin:0 0 22px !important;white-space:normal;padding:0;box-sizing:border-box;line-height:${lh} !important;letter-spacing:${ls};font-size:15px;`,
    sectionStyle: `padding:0 20px;box-sizing:border-box;font-size:15px;`,

    renderTopHeader(coverBase64) {
      const imgSrc = coverBase64 || 'assets/cover-bg.png';
      return `
      <section style="display:flex;flex-flow:row;margin:14px 20px 20px;box-sizing:border-box;">
        <section style="display:flex;align-items:center;">
          <section style="padding:0 10px 0 0;margin-right:10px;">
            <span style="font-size:11px;color:${accent};line-height:1;letter-spacing:1px;">点击蓝字</span>
          </section>
          <section style="padding:0;">
            <span style="font-size:11px;color:${accent};line-height:1;letter-spacing:1px;">关注我们</span>
          </section>
        </section>
      </section>
      <section style="text-align:center;margin:0px 15px 28px;box-sizing:border-box;">
        <section style="display:inline-block;width:100%;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(62,97,61,0.12);box-sizing:border-box;">
          <img style="vertical-align:middle;width:100%;box-sizing:border-box;display:block;" src="${imgSrc}">
        </section>
      </section>`;
    },

    renderTitle(title) {
      return `
      <section style="margin:20px 20px 30px;box-sizing:border-box;">
        <strong style="display:block;font-size:22px;font-weight:700;color:${primary};letter-spacing:1.5px;line-height:1.5;">${title}</strong>
      </section>`;
    },

    renderH1(num, title) {
      const numColor = h1NumColor || accent;
      return `
      <section style="margin:56px 20px 8px;box-sizing:border-box;">
        ${num ? `<span style="display:block;font-size:11px;font-weight:400;color:${numColor};letter-spacing:3px;margin-bottom:10px;opacity:0.55;${h1NumStyle || ''}">${num}</span>` : ''}
        <strong style="display:block;font-size:19px;font-weight:600;color:${primary};letter-spacing:2.5px;line-height:1.4;">${title}</strong>
      </section>`;
    },

    renderH2(title) {
      return `
      <section style="margin:36px 20px 10px;box-sizing:border-box;">
        <strong style="display:block;font-size:15px;font-weight:600;color:${primary};letter-spacing:1.5px;line-height:1.6;">${title}</strong>
      </section>`;
    },

    renderH3(title) {
      return `
      <section style="margin:26px 20px 8px;box-sizing:border-box;">
        <strong style="display:block;font-size:14px;font-weight:500;color:${primary};letter-spacing:1px;opacity:0.75;">${title}</strong>
      </section>`;
    },

    renderQuote(linesHtml) {
      return `
      <section style="margin:16px 20px 36px;padding:0 0 0 22px;box-sizing:border-box;">
        <section style="line-height:${lh};color:rgb(90,100,88);font-size:14.5px;letter-spacing:0.5px;font-style:italic;">
          ${linesHtml}
        </section>
      </section>`;
    },

    renderList(items) {
      const rows = items.map(text => `
        <section style="display:flex;align-items:flex-start;padding:10px 16px;box-sizing:border-box;border-bottom:1px solid rgba(0,0,0,0.06);">
          <span style="color:${accent};font-size:15px;line-height:2;margin-right:10px;flex-shrink:0;">•</span>
          <span style="line-height:2;color:${listText || primary};font-size:15px;letter-spacing:0.4px;flex-grow:1;">${text}</span>
        </section>`).join('');
      return `
      <section style="margin:6px 20px 24px;background-color:${listBg};border-radius:4px;overflow:hidden;box-sizing:border-box;">
        ${rows}
      </section>`;
    },

    renderListItem(text) { return ''; },

    renderCard(innerHtml) {
      const logoImg = (this.cardLogoUrl && this.cardLogoUrl !== 'YOUR_PNG_LOGO_URL_HERE')
        ? `<img style="max-height:24px;margin-right:10px;display:block;opacity:0.75;" src="${this.cardLogoUrl}">`
        : '';
      return `
      <section style="margin:20px;background-color:${cardBg};padding:18px 20px;border-radius:8px;box-sizing:border-box;">
        <section style="display:flex;align-items:center;margin-bottom:14px;padding-bottom:0;">
          ${logoImg}
          <strong style="font-size:12px;color:${accent};font-weight:400;letter-spacing:2.5px;opacity:0.8;">心理盐的陪伴</strong>
        </section>
        <section style="line-height:${lh};color:${textColor};text-align:justify;font-size:14.5px;letter-spacing:0.3px;">
          ${innerHtml}
        </section>
      </section>`;
    },

    renderHr() {
      return `<section style="height:40px;box-sizing:border-box;"></section>`;
    },

    renderFooter() {
      if (footerStyle === 'text') {
        return `
        <section style="text-align:center;margin:60px 20px 20px;box-sizing:border-box;">
          <p style="margin:0 0 8px;font-size:11px;color:${accent};letter-spacing:3px;opacity:0.6;">如有启发，欢迎</p>
          <p style="margin:0;font-size:11px;color:${accent};letter-spacing:3px;opacity:0.6;">分享 · 点赞 · 在看</p>
        </section>
        <section style="text-align:center;margin:16px 0 32px;font-size:10px;color:${accent};letter-spacing:4px;opacity:0.35;">
          <p style="margin:0;">the end</p>
        </section>`;
      }
      const bubble = (label, delay) => `
        <svg viewBox="0 0 44 32" width="40" height="29" style="display:inline-block;vertical-align:bottom;margin-right:8px;" xmlns="http://www.w3.org/2000/svg">
          <g><animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="2.4s" repeatCount="indefinite" begin="${delay}s"/>
          <path d="M 0 5 C 0 2 2 0 5 0 h 34 C 42 0 44 2 44 5 v 16 C 44 24 42 26 39 26 h -8 l -4 6 l -4 -6 h -18 C 2 26 0 24 0 21 z" fill="${accent}"/>
          <text x="22" y="17" fill="#fff" font-size="11" text-anchor="middle" letter-spacing="0.5">${label}</text></g>
        </svg>`;
      return `
      <section style="text-align:right;margin:40px 20px 10px;box-sizing:border-box;">
        ${bubble('求分享',0)}${bubble('求点赞',0.35)}${bubble('求在看',0.7)}
      </section>
      <section style="text-align:center;margin:16px 0 28px;font-size:11px;color:${accent};letter-spacing:3px;opacity:0.7;">
        <p style="margin:0;">— The End —</p>
      </section>`;
    },
  };
}

const THEMES = {

  // ── 主题一：观夏·留白 ──────────────────────────────
  guanxia: {
    label: '🍵 观夏·留白',
    style: buildTheme({
      primary:       '#375637',
      accent:        '#375637',
      bgPaper:       '#F7F7F3',
      textColor:     '#00241C',
      quoteBg:       'transparent',
      cardBg:        '#EAEEE8',
      hrColor:       'none',
      hrStyle:       'none',
      listBg:        '#E8EFE6',    // 浅绿底色
      listText:      '#00241C',    // 深绿字，同色系
      boldColor:     '#1A3A1A',    // 加粗字色：深绿
      boldBg:        '#DFF0DA',    // 加粗底色：浅绿
      h1NumStyle:    'font-family:Georgia,"Times New Roman",serif;',
      h1NumColor:    '#8AAE8A',
      footerStyle:   'text',
      paperTex:      _TEX_WASHI,
      paperOpacity:  0.13,
      lineHeight:    '2.0',
      letterSpacing: '0.8px',
    }),
  },

  // ── 主题二：晴山·烟青 ──────────────────────────────
  // 青灰系，同色系贯穿，水彩纸纹理
  qingshan: {
    label: '🏔 晴山·烟青',
    style: buildTheme({
      primary:       '#2E4A52',
      accent:        '#5C8A92',
      bgPaper:       '#F5F7F7',
      textColor:     '#1A2E32',
      quoteBg:       'transparent',
      cardBg:        '#E8F0F1',
      hrColor:       'none',
      hrStyle:       'none',
      listBg:        '#E2EDEF',    // 浅青底色
      listText:      '#1A2E32',    // 深青字，同色系
      boldColor:     '#1A3540',    // 加粗字色：深青
      boldBg:        '#D4E8EC',    // 加粗底色：浅青，跟绿色完全区分
      h1NumStyle:    'font-family:Georgia,"Times New Roman",serif;',
      h1NumColor:    '#8AADB4',
      footerStyle:   'bubble',
      paperTex:      _TEX_WATERCOLOR,
      paperOpacity:  0.10,
      lineHeight:    '1.95',
      letterSpacing: '0.6px',
    }),
  },

};

window.SALT_STYLE = THEMES.guanxia.style;