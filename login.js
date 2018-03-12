const puppeteer = require('puppeteer');

module.exports ={
 login:async function (username,password) {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto('http://sis.hust.edu.vn/');

  const userId = '#cLogIn1_tb_cLogIn_User_I';
  const passwordId = '#cLogIn1_tb_cLogIn_Pass_I';

  
  await page.click(userId);
  await page.keyboard.type(username);
  await page.click(passwordId);
  await page.keyboard.type(password);
  await page.click('#cLogIn1_bt_cLogIn_CD');
  return page;
}
}