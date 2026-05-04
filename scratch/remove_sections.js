const fs = require('fs');

const path = 'c:/Users/harsh/Desktop/Machinga/aava.html';
const content = fs.readFileSync(path, 'utf8');

const newContent = content.replace(/<!-- Next Project Banner -->[\s\S]*?<!-- Footer -->/, '<!-- Footer -->');

fs.writeFileSync(path, newContent, 'utf8');
console.log('Done');
