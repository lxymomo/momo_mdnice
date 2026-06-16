// scripts/parser.js

function formatInline(text) {
    let escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // ✅ 加粗：深墨绿色字 + 极浅绿底色，像克制的荧光笔效果
    return escaped.replace(/\*\*(.*?)\*\*/g,
        `<strong style="color: rgb(38, 70, 38); background-color: #E4EFE3; padding: 1px 3px; border-radius: 3px; box-sizing: border-box;">$1</strong>`
    );
}

function saltParser(mdText, coverBase64 = null) {
    let cardBlocks = [];

    mdText = mdText.replace(/\n*\[card\]([\s\S]*?)\[\/card\]\n*/g, function(match, p1) {
        cardBlocks.push(p1.trim());
        return `\n__CARD_${cardBlocks.length - 1}__\n`;
    });

    let lines = mdText.split('\n');
    let finalHtml = SALT_STYLE.renderTopHeader(coverBase64);
    
    let i = 0;
    let pGroup = [];

    function flushP() {
        if (pGroup.length > 0) {
            let inner = pGroup.map(p => `<p style="${SALT_STYLE.pStyle}">${p}</p>`).join('\n');
            finalHtml += `<section style="${SALT_STYLE.sectionStyle}">${inner}</section>`;
            pGroup = [];
        }
    }

    while (i < lines.length) {
        let line = lines[i];
        let trimmed = line.trim();

        if (!trimmed) {
            flushP();
            let j = i + 1;
            let extraBlanks = 0;
            while(j < lines.length && lines[j].trim() === '') {
                extraBlanks++;
                j++;
            }
            if (extraBlanks > 0) {
                for(let k = 0; k < extraBlanks; k++) {
                    finalHtml += `<section style="${SALT_STYLE.sectionStyle}"><p style="margin:0 0 15px; padding:0;"><br></p></section>`;
                }
            }
            i = j; 
            continue;
        }

        if (/^---+$/.test(trimmed)) {
            flushP();
            finalHtml += SALT_STYLE.renderHr();
            i++;
            continue;
        }

        let cardMatch = trimmed.match(/^__CARD_(\d+)__$/);
        if (cardMatch) {
            flushP();
            let cardContent = cardBlocks[parseInt(cardMatch[1])];
            let cardHtml = cardContent.split('\n').map(l => {
                let lt = l.trim();
                return lt
                    ? `<p style="margin: 0 0 6px 0;">${formatInline(lt)}</p>`
                    : `<p style="margin: 0;"><br></p>`;
            }).join('');
            finalHtml += SALT_STYLE.renderCard(cardHtml);
            i++;
            continue;
        }

        if (trimmed.startsWith('# ')) {
            flushP();
            const h1Match = trimmed.match(/^#\s+(\d+)\s+(.*)/);
            if (h1Match) {
                finalHtml += SALT_STYLE.renderH1(h1Match[1], h1Match[2]);
            } else {
                finalHtml += SALT_STYLE.renderH1('', trimmed.replace(/^#\s+/, ''));
            }
            i++;
            continue;
        }

        if (trimmed.startsWith('## ')) {
            flushP();
            finalHtml += SALT_STYLE.renderH2(trimmed.replace(/^##\s+/, ''));
            i++;
            continue;
        }

        if (trimmed.startsWith('>')) {
            flushP();
            let quoteHtml = '';
            while (i < lines.length) {
                let currTrim = lines[i].trim();
                if (currTrim.startsWith('>')) {
                    quoteHtml += `<p style="margin: 0px 0px 4px;">${formatInline(currTrim.replace(/^>\s*/, ''))}</p>`;
                    i++;
                } else if (currTrim === '') {
                    let j = i + 1;
                    while(j < lines.length && lines[j].trim() === '') j++;
                    if (j < lines.length && lines[j].trim().startsWith('>')) {
                        quoteHtml += `<p style="margin: 0;"><br></p>`;
                        i = j;
                    } else { break; }
                } else { break; }
            }
            finalHtml += SALT_STYLE.renderQuote(quoteHtml);
            continue;
        }

        if (/^[-*]\s/.test(trimmed)) {
            flushP();
            let listHtml = '';
            while (i < lines.length) {
                let currTrim = lines[i].trim();
                if (/^[-*]\s/.test(currTrim)) {
                    let text = formatInline(currTrim.replace(/^[-*]\s/, ''));
                    listHtml += SALT_STYLE.renderListItem(text);
                    i++;
                } else if (currTrim === '') {
                    let j = i + 1;
                    while(j < lines.length && lines[j].trim() === '') j++;
                    if (j < lines.length && /^[-*]\s/.test(lines[j].trim())) {
                        i = j; 
                    } else { break; }
                } else { break; }
            }
            finalHtml += SALT_STYLE.renderList(listHtml);
            continue;
        }

        pGroup.push(formatInline(trimmed));
        i++;
    }
    
    flushP(); 
    finalHtml += SALT_STYLE.renderFooter();

    return `<section style="background-color: ${SALT_STYLE.bgPaper}; padding: 10px 0; font-size: 15px; color: ${SALT_STYLE.textColor}; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;">${finalHtml}</section><p><br></p>`;
}