// scripts/templates.js

const SALT_STYLE = {
    primary: "rgb(62, 97, 61)",          // 比原来更深的墨绿，标题/装饰更有力
    bgPaper: "#F9F9F5", 
    textColor: "rgb(62, 62, 62)",
    cardLogoUrl: LOGO_BASE64, 

    pStyle: "margin: 0px 0px 15px !important; white-space: normal; padding: 0px; box-sizing: border-box; line-height: 1.6 !important; letter-spacing: 1px;",
    sectionStyle: "padding: 0px 15px; box-sizing: border-box;",

    renderTopHeader: (coverBase64) => {
        const defaultCover = "assets/cover-bg.png";
        const imgSrc = coverBase64 || defaultCover;
        return `
        <section style="text-align: left;justify-content: flex-start;display: flex;flex-flow: row;margin: 10px 15px 15px;box-sizing: border-box;">
            <section style="display: inline-block;vertical-align: middle;width: auto;padding: 0px 0px 0px 0px;box-sizing: border-box;">
                <section style="text-align: center;justify-content: center;display: flex;flex-flow: row;margin: 0px;box-sizing: border-box;">
                    <section style="display: inline-block;vertical-align: top;width: auto;border-right: 1px solid rgb(62, 97, 61);padding: 0px 10px 0px 0px;box-sizing: border-box;">
                        <span style="font-size: 12px; color: rgb(62, 97, 61); line-height: 1;">点击蓝字</span>
                    </section>
                    <section style="display: inline-block;vertical-align: top;width: auto;padding: 0px 0px 0px 10px;box-sizing: border-box;">
                        <span style="font-size: 12px; color: rgb(62, 97, 61); line-height: 1;">关注我们</span>
                    </section>
                </section>
            </section>
        </section>
        <section style="text-align: center;margin: 0px 15px 20px;box-sizing: border-box;">
            <section style="display: inline-block;width: 100%;border-radius: 8px;overflow: hidden;box-shadow: 0 4px 12px rgba(62, 97, 61, 0.12);box-sizing: border-box;">
                <img style="vertical-align: middle;width: 100%;box-sizing: border-box;display:block;" src="${imgSrc}">
            </section>
        </section>`;
    },

    renderH1: (num, title) => `
        <section style="display: flex; align-items: flex-end; margin: 40px 15px 25px; border-bottom: 1.5px solid rgba(62, 97, 61, 0.4); padding-bottom: 8px; box-sizing: border-box;">
            ${num ? `<span style="font-size: 22px; font-weight: bold; color: rgb(62, 97, 61); margin-right: 12px; font-family: Georgia, serif; line-height: 1;">${num}</span>` : ''}
            <strong style="font-size: 18px; color: rgb(62, 97, 61); letter-spacing: 1.5px; line-height: 1.2;">${title}</strong>
        </section>`,

    renderH2: (title) => `
        <section style="margin: 30px 15px 15px; display: flex; align-items: center; box-sizing: border-box;">
            <span style="display: inline-block; width: 6px; height: 6px; background-color: rgb(62, 97, 61); border-radius: 50%; margin-right: 8px; flex-shrink: 0;"></span>
            <strong style="font-size: 16px; color: rgb(62, 97, 61);">${title}</strong>
        </section>`,

    renderQuote: (linesHtml) => `
        <section style="background-color: #DBE3D4; border-left: 4px solid rgb(62, 97, 61); padding: 12px 15px 12px 20px; margin: 10px 15px 25px; line-height: 1.6; color: rgb(62, 62, 62); text-align: justify; box-sizing: border-box; font-size: 15px; border-radius: 0 4px 4px 0;">
            ${linesHtml}
        </section>`,

    renderList: (itemsHtml) => `
        <section style="text-align:left; justify-content:flex-start; display:flex; flex-flow:column; margin:10px 15px 20px; background-color: transparent; padding:15px 15px 5px 15px; border-radius: 6px; position:static; box-sizing:border-box;">
            ${itemsHtml}
        </section>`,

    renderListItem: (text) => `
        <section style="display:flex; align-items:flex-start; margin-bottom: 10px; box-sizing:border-box;">
            <section style="width: 24px; padding-top: 8px; flex-shrink: 0; display:flex; justify-content:center;">
                <section style="width: 5px; height: 5px; background-color: rgb(62, 97, 61); border-radius: 50%; margin: 0;"></section>
            </section>
            <section style="line-height: 1.6; color: rgb(62, 62, 62); text-align: justify; flex-grow: 1; font-size: 15px;">
                ${text}
            </section>
        </section>`,

    renderCard: (innerHtml) => {
        const logoImg = (SALT_STYLE.cardLogoUrl && SALT_STYLE.cardLogoUrl !== 'YOUR_PNG_LOGO_URL_HERE') ? 
            `<img style="max-height: 28px; margin-right: 12px; display: block;" src="${SALT_STYLE.cardLogoUrl}">` : '';

        return `
        <section style="margin: 20px 15px; background-color: #DBE3D4; padding: 17px; border-radius: 8px; box-shadow: 0 2px 10px rgba(62, 97, 61, 0.08); box-sizing: border-box;">
            <section style="display: flex; align-items: center; justify-content: start; margin-bottom: 15px;">
                ${logoImg}
                <strong style="font-size: 16px; color: rgb(62, 97, 61); border-bottom: 1.5px solid rgb(62, 97, 61); padding-bottom: 3px; font-weight: bold;">心理盐的陪伴</strong>
            </section>
            <section style="line-height: 1.6; color: rgb(62, 62, 62); text-align: justify; font-size: 15px;">
                ${innerHtml}
            </section>
        </section>`;
    },

    renderHr: () => `<section style="height: 1px; background-color: rgb(62, 97, 61); border: none; margin: 25px 15px; opacity: 0.2; box-sizing: border-box;"></section>`,

    renderFooter: () => `
        <section style="text-align: right; margin: 30px 15px 10px; padding-right: 10px; box-sizing: border-box;">
            <svg viewBox="0 0 180 40" width="160" style="display: inline-block; vertical-align: bottom;">
                <g>
                    <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="2s" repeatCount="indefinite" begin="0s"/>
                    <path d="M 0 5 C 0 2 2 0 5 0 h 34 C 42 0 44 2 44 5 v 16 C 44 24 42 26 39 26 h -8 l -4 6 l -4 -6 h -18 C 2 26 0 24 0 21 z" fill="rgb(62,97,61)"/>
                    <text x="22" y="17" fill="#fff" font-size="11" text-anchor="middle">求分享</text>
                </g>
                <g>
                    <animateTransform attributeName="transform" type="translate" values="60,0; 60,-5; 60,0" dur="2s" repeatCount="indefinite" begin="0.3s"/>
                    <path d="M 0 5 C 0 2 2 0 5 0 h 34 C 42 0 44 2 44 5 v 16 C 44 24 42 26 39 26 h -8 l -4 6 l -4 -6 h -18 C 2 26 0 24 0 21 z" fill="rgb(62,97,61)"/>
                    <text x="22" y="17" fill="#fff" font-size="11" text-anchor="middle">求点赞</text>
                </g>
                <g>
                    <animateTransform attributeName="transform" type="translate" values="120,0; 120,-5; 120,0" dur="2s" repeatCount="indefinite" begin="0.6s"/>
                    <path d="M 0 5 C 0 2 2 0 5 0 h 34 C 42 0 44 2 44 5 v 16 C 44 24 42 26 39 26 h -8 l -4 6 l -4 -6 h -18 C 2 26 0 24 0 21 z" fill="rgb(62,97,61)"/>
                    <text x="22" y="17" fill="#fff" font-size="11" text-anchor="middle">求在看</text>
                </g>
            </svg>
        </section>
        <section style="text-align: center; margin: 20px 0 20px; font-size: 12px; color: #999;">
            <p style="margin:0;">—— The End ——</p>
        </section>`
};