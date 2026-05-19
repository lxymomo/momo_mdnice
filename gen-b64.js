const fs = require('fs');
const b64 = fs.readFileSync('assets/cover-bg.jpeg').toString('base64');
// 第3行改为
fs.writeFileSync('assets/cover-bg-b64.js', `const COVER_BG_BASE64="data:image/jpeg;base64,${b64}";`);
console.log('done');