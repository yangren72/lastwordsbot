let RiTa = require('rita');
let RiTwit = require('ritwit');
let RiGrammar = RiTa.RiGrammar;
let moment = require('moment');
moment().format();
let config = require('./config');
const fs = require('fs');
const rawdata = fs.readFileSync('last-statements.json', 'utf8');
let content = JSON.parse(rawdata);
let rt = new RiTwit(config);


// setInterval(tweetStatment, 60000);
tweetStatment();



function tweetStatment() {

  let tweetedContents = fs.readFileSync('tweeted.json', 'utf8');
  let refTweetedContents = JSON.parse(tweetedContents);

  let newTweet = generateText();

  for(let i=0;i<tweetedContents.length;i++){
  if(newTweet===tweetedContents[i]){
    newTweet = generateText();
  }
}




  rt.tweet(newTweet); // uncomment to tweet
  //console.log(newTweet);

  refTweetedContents.push(newTweet);
  fs.writeFile('tweeted.json', JSON.stringify(refTweetedContents),
    (err) => {

      if (err) throw err;

      console.log('Data refreshed');
      console.log("--------------------------");

    });

}

function generateText(){


    let randomPick = Math.floor(Math.random() * content.length);
    let sents = RiTa.splitSentences(content[randomPick].statement);
    let sent = sents[Math.floor(Math.random() * sents.length)];
    let newMoment = moment(content[randomPick].date, "MM-DD-YYYY").format('ll');

    let tweetStmt = ('"' + sent + '"');
    let tweetNameGenderAge="";

    let ageWithoutSpace=content[randomPick].age.replace(/\s+/g, '');

    if(content[randomPick].gender=== ""){
    tweetNameGenderAge = ("Last words of " + content[randomPick].fname + " " + content[randomPick].lname + " " + "(" + "age " + ageWithoutSpace + ")");
  }else{
    tweetNameGenderAge = ("Last words of " + content[randomPick].fname + " " + content[randomPick].lname + " " + "(" + content[randomPick].gender.toLowerCase() + ", age " + ageWithoutSpace + ")");
  }
    let tweetDate = ("Executed by lethal injection on " + newMoment);
    tweetNameGenderAge = tweetNameGenderAge.trim().replace(/\s+/g, ' ');
    tweetDate = tweetDate.trim().replace(/\s+/g, ' ');
    let myTweet = (tweetStmt + '\n' + '\n' + tweetNameGenderAge + '\n' + tweetDate);

  return myTweet;
}
