let RiTa = require('rita');
let RiTwit = require('ritwit');
let config = require('./config');
let RiGrammar = RiTa.RiGrammar;

let loaded = false;

let order = 2;
let nameLastStatement = [];

let picP, parag, sen = [],
  onsSen;

const puppeteer = require('puppeteer');

console.log("");
console.log("loading");
console.log("");

async function scrapeStatement(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await Promise.all([
    page.goto(url)
  ]);

  for (i = 0; i < 100; i++) {

    let [el] = await page.$x('//*[@id="content_right"]/div[2]/table/tbody/tr[' + order + ']/td[4]');
    let txt = await el.getProperty('textContent');
    let rawTxt = await txt.jsonValue();

    let [el2] = await page.$x('//*[@id="content_right"]/div[2]/table/tbody/tr[' + order + ']/td[5]');
    let txt2 = await el2.getProperty('textContent');
    let rawTxt2 = await txt2.jsonValue();

    await Promise.all([
      page.waitForNavigation(),
      page.click('#content_right > div.overflow > table > tbody > tr:nth-child(' + order + ') > td:nth-child(3) > a')
    ]);

    let [el3] = await page.$x('//*[@id="content_right"]/p[6]');

    if (el3 != undefined) {

      let txt3 = await el3.getProperty('textContent');

      //if(txt3.jsonValue()=null){
      let rawTxt3 = await txt3.jsonValue();
      nameLastStatement.push(rawTxt2 + ' ' + rawTxt);
      nameLastStatement[rawTxt2 + ' ' + rawTxt] = {
        lastStatement: rawTxt3
      };
      //}
    }


    //console.log(nameLastStatement);
    order++;
    await page.goBack();

      await setTimeout(tweetStatment, 5000);


  }

  loaded = true;
  browser.close();
}

scrapeStatement('https://www.tdcj.texas.gov/death_row/dr_executed_offenders.html');

let rt = new RiTwit(config);

function tweetStatment() {
  let firstT = true;
  while (firstT || oneSen == "No statement given" || oneSen == "Spoken: No") {
    picP = nameLastStatement[Math.floor(Math.random() * nameLastStatement.length)];
    //console.log(nameLastStatement[0].lastStatement);
    parag = nameLastStatement[picP].lastStatement;
    sen = parag.split('.');
    sen.pop();
    oneSen = sen[Math.floor(Math.random() * sen.length)];
    firstT = false;
  }
  // console.log(nameLastStatement);
  // console.log('');
  console.log(oneSen + '.');
  console.log('');
  //rt.tweet(result); // uncomment to tweet
}
