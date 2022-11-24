let RiTa = require('rita');

let RiTwit = require('ritwit');

let config = require('./config');

let puppeteer = require('puppeteer');

let fs = require('fs');





let rt = new RiTwit(config);





let page, browser, entries = [];

let url = 'https://www.tdcj.texas.gov/death_row/dr_executed_offenders.html';


scrapeStatements(url);


async function scrapeStatements() {

  browser = await puppeteer.launch();

  page = await browser.newPage();


  for (let i = 2; i < 571; i++) {

    console.log('\nloading page ');

    await page.goto(url);

    console.log('trying row ' + i);

    let [el] = await page.$x('//*[@id="content_right"]/div[2]/table/tbody/tr[' + i + ']/td[4]');

    if (typeof el === 'undefined') {
      fail('el');
      continue;
    }

    let lnameEle = await el.getProperty('textContent');

    if (typeof lnameEle === 'undefined') {
      fail('lname');
      continue;
    }

    let lname = await lnameEle.jsonValue();

    let [el2] = await page.$x('//*[@id="content_right"]/div[2]/table/tbody/tr[' + i + ']/td[5]');
    let fnameEle = await el2.getProperty('textContent');

    if (typeof fnameEle === 'undefined') {
      fail('fname');
      continue;
    }

    let fname = await fnameEle.jsonValue();

    let [el3] = await page.$x('//*[@id="content_right"]/div[2]/table/tbody/tr[' + i + ']/td[7]');
    let ageEle = await el3.getProperty('textContent');

    if (typeof ageEle === 'undefined') {
      fail('age');
      continue;
    }

    let age = await ageEle.jsonValue();

    let [el4] = await page.$x('//*[@id="content_right"]/div[2]/table/tbody/tr[' + i + ']/td[8]');
    let dateEle = await el4.getProperty('textContent');

    if (typeof dateEle === 'undefined') {
      fail('date');
      continue;
    }

    let date = await dateEle.jsonValue();

    let [el5] = await page.$x('//*[@id="content_right"]/div[2]/table/tbody/tr[' + i + ']/td[9]');
    let raceEle = await el5.getProperty('textContent');

    if (typeof raceEle === 'undefined') {
      fail('race');
      continue;
    }

    let race = await raceEle.jsonValue();

    await Promise.all([
      page.waitForNavigation(),
      page.click('#content_right > div.overflow > table > tbody > tr:nth-child(' + i + ') > td:nth-child(2) > a')
    ]);

    let [el11] = await page.$x('//*[@id="content_right"]/table/tbody/tr[11]/td[3]');
      let gender = '';
    if (typeof el11 === 'undefined') {
      fail('el11');

    }else{
      let genderEle = await el11.getProperty('textContent');

    if (typeof genderEle === 'undefined') {
      fail('gender');
    }else{
      gender = await genderEle.jsonValue();
    }
  }


    await page.goBack();



    await Promise.all([
      page.waitForNavigation(),
      page.click('#content_right > div.overflow > table > tbody > tr:nth-child(' + i + ') > td:nth-child(3) > a')
    ]);



    let entry = {
      lname,
      fname,
      age,
      date,
      race,
      gender,
      statement: ""
    };



    let [el6] = await page.$x('//*[@id="content_right"]/p[6]');

    if (typeof el6 === 'undefined') {
      fail('el3', entry);
      continue;
    }

    let stmtEle = await el6.getProperty('textContent');

    if (typeof stmtEle === 'undefined') {
      fail('stmtEle', entry);
      continue;
    }

    let stmt = await stmtEle.jsonValue();

    if (typeof stmt === 'undefined' || stmt.toLowerCase() ===
      'none' || stmt.toLowerCase() ===
      'none.') {

      fail('stmt', entry);

      continue;

    } else {
      stmt = stmt.trim().replace(/\s+/g, ' ');
      if (stmt === "This offender declined to make a last statement.") {
        fail('stmt', entry);
        continue;
      }
      entry.statement += stmt;
    }

    let [el7] = await page.$x('//*[@id="content_right"]/p[7]');

    if (typeof el7 !== 'undefined') {

      let stmtEle2 = await el7.getProperty('textContent');

      if (typeof stmtEle2 !== 'undefined') {

        let stmt2 = await stmtEle2.jsonValue();

        entry.statement += stmt2;
      }
    }


    let [el8] = await page.$x('//*[@id="content_right"]/p[8]');

    if (typeof el8 !== 'undefined') {

      let stmtEle3 = await el8.getProperty('textContent');

      if (typeof stmtEle3 !== 'undefined') {

        let stmt3 = await stmtEle3.jsonValue();
        entry.statement += stmt3;
      }
    }

    let [el9] = await page.$x('//*[@id="content_right"]/p[9]');

    if (typeof el9 !== 'undefined') {

      let stmtEle4 = await el9.getProperty('textContent');

      if (typeof stmtEle4 !== 'undefined') {

        let stmt4 = await stmtEle4.jsonValue();
        entry.statement += stmt4;
      }
    }



    entry.statement = entry.statement.trim().replace(/“/g, '');
    entry.statement = entry.statement.trim().replace(/”/g, '');
    entry.statement = entry.statement.trim().replace(/"/g, '');
    entry.statement = entry.statement.trim().replace(/Last Statement:/g, '');
    entry.statement = entry.statement.trim().replace(/(Written statement)/g, '');
    entry.statement = entry.statement.trim().replace(/Written Statement: /g, '');
    entry.statement = entry.statement.trim().replace(/Spoken: No\./g, '');
    // success, fix spaces
    entry.statement = entry.statement.trim().replace(/\s+/g, ' ');

    if (stmt === "Last Statement:") {

      entry.statement = "";

      let [el6] = await page.$x('//*[@id="content_right"]/p[7]');

      if (typeof el6 === 'undefined') {
        fail('el3', entry);
        continue;
      }

      let stmtEle = await el6.getProperty('textContent');

      if (typeof stmtEle === 'undefined') {
        fail('stmtEle', entry);
        continue;
      }

      let stmt = await stmtEle.jsonValue();

      if (typeof stmt === 'undefined' || stmt.toLowerCase() === 'none' || stmt.toLowerCase() === 'none.') {

        fail('stmt', entry);

        continue;

      } else {
        stmt = stmt.trim().replace(/\s+/g, ' ');
        if (stmt === "This offender declined to make a last statement.") {
          fail('stmt', entry);
          continue;
        }
        entry.statement += stmt;
      }

      let [el7] = await page.$x('//*[@id="content_right"]/p[8]');

      if (typeof el7 !== 'undefined') {

        let stmtEle2 = await el7.getProperty('textContent');

        if (typeof stmtEle2 !== 'undefined') {

          let stmt2 = await stmtEle2.jsonValue();

          entry.statement += stmt2;
        }
      }


      let [el8] = await page.$x('//*[@id="content_right"]/p[9]');

      if (typeof el8 !== 'undefined') {

        let stmtEle3 = await el8.getProperty('textContent');

        if (typeof stmtEle3 !== 'undefined') {

          let stmt3 = await stmtEle3.jsonValue();
          entry.statement += stmt3;
        }
      }

      let [el9] = await page.$x('//*[@id="content_right"]/p[10]');

      if (typeof el9 !== 'undefined') {

        let stmtEle4 = await el9.getProperty('textContent');

        if (typeof stmtEle4 !== 'undefined') {

          let stmt4 = await stmtEle4.jsonValue();
          entry.statement += stmt4;
        }
      }



      entry.statement = entry.statement.trim().replace(/“/g, '');
      entry.statement = entry.statement.trim().replace(/”/g, '');
      entry.statement = entry.statement.trim().replace(/"/g, '');
      entry.statement = entry.statement.trim().replace(/Last Statement:/g, '');
      entry.statement = entry.statement.trim().replace(/(Written statement)/g, '');
      entry.statement = entry.statement.trim().replace(/Written Statement: /g, '');
      entry.statement = entry.statement.trim().replace(/Spoken: No\./g, '');
      // success, fix spaces
      entry.statement = entry.statement.trim().replace(/\s+/g, ' ');
    }

    // add to our array and print a sentence
    entries.push(entry);


    printOneSentence(entry);

  }


  // write our json data to a file

  fs.writeFile('last-statements.json', JSON.stringify(entries),
    (err) => {

      if (err) throw err;

      console.log('Data written to file');

      browser.close();

    });

}



function fail(msg, entry) {

  console.warn('failed on ' + msg, entry);

}



function printOneSentence(entry) {

  let sents = RiTa.splitSentences(entry.statement);
  let sent = sents[Math.floor(Math.random() * sents.length)]
  console.log(entry.fname, entry.lname + ':', sent);

}
