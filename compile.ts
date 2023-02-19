const path = require('path');
const fs = require('fs');
const solc = require('solc');
// __dirname 為node.js 常量 他始終設定為當前的工作目錄
const inboxPath = path.resolve(__dirname, 'contracts', 'lottery.sol');
const source = fs.readFileSync(inboxPath, 'utf8');
// 合約來源 編譯合約數量
module.exports = solc.compile(source, 1).contracts[':Lottery'];
