// scripts/parser.js

function formatInline(text) {
    let escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // 加粗颜色跟主题走，fallback 到绿色系
    const boldColor  = (typeof SALT_STYLE !== 'undefined' && SALT_STYLE.boldColor)  || '#1A3A1A';
    const boldBg     = (typeof SALT_STYLE !== 'undefined' && SALT_STYLE.boldBg)     || '#E4EFE3';
    return escaped.replace(/\*\*(.*?)\*\*/g,
        `<strong style="color:${boldColor};background-color:${boldBg};padding:1px 4px;border-radius:3px;box-sizing:border-box;">$1</strong>`
    );
}

function saltParser(mdText, coverBase64 = null) {
    let cardBlocks = [];
    let refBlocks  = [];

    mdText = mdText.replace(/\n*\[card\]([\s\S]*?)\[\/card\]\n*/g, function(match, p1) {
        cardBlocks.push(p1.trim());
        return `\n__CARD_${cardBlocks.length - 1}__\n`;
    });

    mdText = mdText.replace(/\n*\[ref\]([\s\S]*?)\[\/ref\]\n*/g, function(match, p1) {
        refBlocks.push(p1.trim());
        return `\n__REF_${refBlocks.length - 1}__\n`;
    });

    let lines = mdText.split('\n');
    let finalHtml = SALT_STYLE.renderTopHeader(coverBase64);

    let i = 0;
    let pGroup = [];
    let h1Counter = 0;

    let pCounter = 0;

    function flushP() {
        if (pGroup.length > 0) {
            let inner = pGroup.map(p => `<p style="${SALT_STYLE.pStyle}">${p}</p>`).join('\n');
            finalHtml += `<section style="${SALT_STYLE.sectionStyle}">${inner}</section>`;
            pGroup = [];
        }
    }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    while (i < lines.length) {
        let line = lines[i];
        let trimmed = line.trim();

        // 空行
        if (!trimmed) {
            flushP();
            let j = i + 1;
            let extraBlanks = 0;
            while (j < lines.length && lines[j].trim() === '') { extraBlanks++; j++; }
            if (extraBlanks > 0) {
                for (let k = 0; k < extraBlanks; k++) {
                    finalHtml += `<section style="${SALT_STYLE.sectionStyle}"><p style="margin:0 0 15px;padding:0;"><br></p></section>`;
                }
            }
            i = j;
            continue;
        }

        // 分割线
        if (/^---+$/.test(trimmed)) {
            flushP();
            finalHtml += SALT_STYLE.renderHr();
            i++;
            continue;
        }

        // Card
        let cardMatch = trimmed.match(/^__CARD_(\d+)__$/);
        if (cardMatch) {
            flushP();
            let cardContent = cardBlocks[parseInt(cardMatch[1])];
            let cardHtml = cardContent.split('\n').map(l => {
                let lt = l.trim();
                return lt ? `<p style="margin:0 0 6px 0;">${formatInline(lt)}</p>`
                          : `<p style="margin:0;"><br></p>`;
            }).join('');
            finalHtml += SALT_STYLE.renderCard(cardHtml);
            i++;
            continue;
        }

        // Ref
        let refMatch = trimmed.match(/^__REF_(\d+)__$/);
        if (refMatch) {
            flushP();
            let refContent = refBlocks[parseInt(refMatch[1])];
            let refHtml = refContent.split('\n').map(l => {
                let lt = l.trim();
                return lt ? `<p style="margin:0 0 4px 0;">${formatInline(lt)}</p>`
                          : `<p style="margin:0;"><br></p>`;
            }).join('');
            finalHtml += SALT_STYLE.renderRef(refHtml);
            i++;
            continue;
        }

        // ── 标题：注意顺序，长前缀优先 ──────────────────────────────
        // #### → H3（最小层级）
        if (trimmed.startsWith('#### ')) {
            flushP();
            finalHtml += SALT_STYLE.renderH3(trimmed.replace(/^####\s+/, ''));
            i++;
            continue;
        }
        // ### → H2（小节）
        if (trimmed.startsWith('### ')) {
            flushP();
            finalHtml += SALT_STYLE.renderH2(trimmed.replace(/^###\s+/, ''));
            i++;
            continue;
        }
        // ## → H1（大章节，自动序号）
        if (trimmed.startsWith('## ')) {
            flushP();
            h1Counter++;
            finalHtml += SALT_STYLE.renderH1(pad(h1Counter), trimmed.replace(/^##\s+/, ''));
            i++;
            continue;
        }
        // # → 文章大标题，只渲染文字，不加序号，不参与计数
        if (trimmed.startsWith('# ')) {
            flushP();
            finalHtml += SALT_STYLE.renderTitle(trimmed.replace(/^#\s+/, ''));
            i++;
            continue;
        }
        // ─────────────────────────────────────────────────────────────

        // 引用
        if (trimmed.startsWith('>')) {
            flushP();
            let quoteHtml = '';
            while (i < lines.length) {
                let currTrim = lines[i].trim();
                if (currTrim.startsWith('>')) {
                    quoteHtml += `<p style="margin:0 0 4px;">${formatInline(currTrim.replace(/^>\s*/, ''))}</p>`;
                    i++;
                } else if (currTrim === '') {
                    let j = i + 1;
                    while (j < lines.length && lines[j].trim() === '') j++;
                    if (j < lines.length && lines[j].trim().startsWith('>')) {
                        quoteHtml += `<p style="margin:0;"><br></p>`;
                        i = j;
                    } else { break; }
                } else { break; }
            }
            finalHtml += SALT_STYLE.renderQuote(quoteHtml);
            continue;
        }

        // 列表：收集所有连续项，整体传给 renderList
        if (/^[-*]\s/.test(trimmed)) {
            flushP();
            let items = [];
            while (i < lines.length) {
                let currTrim = lines[i].trim();
                if (/^[-*]\s/.test(currTrim)) {
                    items.push(formatInline(currTrim.replace(/^[-*]\s/, '')));
                    i++;
                } else if (currTrim === '') {
                    let j = i + 1;
                    while (j < lines.length && lines[j].trim() === '') j++;
                    if (j < lines.length && /^[-*]\s/.test(lines[j].trim())) { i = j; }
                    else { break; }
                } else { break; }
            }
            finalHtml += SALT_STYLE.renderList(items);
            continue;
        }

        pGroup.push(formatInline(trimmed));
        i++;
    }

    flushP();
    finalHtml += SALT_STYLE.renderFooter();

    const paperLayer = SALT_STYLE.paperLayer || '';

    return `<section style="position:relative;background-color:${SALT_STYLE.bgPaper};padding:10px 0;font-size:15px;color:${SALT_STYLE.textColor};font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue','PingFang SC','Hiragino Sans GB','Microsoft YaHei UI','Microsoft YaHei',Arial,sans-serif;">${paperLayer}<section style="position:relative;">${finalHtml}</section></section><p><br></p>`;
}