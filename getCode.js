let RiTa = require('rita');

let RiTwit = require('ritwit');

let config = require('./config');

let puppeteer = require('puppeteer');

let fs = require('fs');





let rt = new RiTwit(config);





let page, browser, entries = [];

let url = 'https://www.weibo.com/tw';


scrapeStatements(url);


async function scrapeStatements() {

  browser = await puppeteer.launch();

  page = await browser.newPage();




    await page.goto(url);


    let [el] = await page.$x('//*[@id="pl_login_form"]/div/div[3]/div[3]/a/img');

    if (typeof el === 'undefined') {
      fail('el');
    }

    // let lnameEle = await el.getProperty('textContent');
    //
    // if (typeof lnameEle === 'undefined') {
    //   fail('lname');
    // }
    //
    // let lname = await lnameEle.jsonValue();

  console.log(el);




}



function fail(msg, entry) {

  console.warn('failed on ' + msg, entry);

}
