const loginFile = require('./login');
const puppeteer = require('puppeteer');
module.exports ={
getInfomation: async function run(mssv,password) {

  const page = await  loginFile.login(mssv,password);
  await page.waitFor(1000);
  await page.goto('http://sis.hust.edu.vn/ModuleUser/UserInformation.aspx');


  let text = await page.evaluate(() => {
    let elements = document.querySelectorAll('div#mainTextBody div table tbody tr td div p');
    elements = [...elements];
      let info = {};
      var property=['studentCode','fullname','birthday','class','program','learning','status'];
      elements.forEach((obj,index)=>{
        infos = obj.textContent.split(':');
        info[property[index]] = infos[1];
      })
    return info;
  })
return text;
}
}