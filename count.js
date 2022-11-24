let RiTa = require('rita');
let RiGrammar = RiTa.RiGrammar;
let config = require('./config');
const fs = require('fs');
const rawdata = fs.readFileSync('last-statements.json', 'utf8');
let content = JSON.parse(rawdata);


countSent();

function countSent(){
let sentCount=0;
for(let i=0;i<content.length;i++){
    let sents = RiTa.splitSentences(content[i].statement);
    sentCount+=sents.length;
  }

  console.log(sentCount);
}
