const puppeteer = require('puppeteer');

module.exports ={
getTimeTables:async function run(studentCode) {
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();
  await page.goto('http://sis.hust.edu.vn/ModulePlans/Timetables.aspx');

  const inputId = '#MainContent_Studentid_I';

  
  await page.click(inputId);
  await page.keyboard.type(studentCode);
  
  console.log('done');
  await page.click('#MainContent_btFind_CD');
 
  console.log('clicked');

  await page.waitFor('#MainContent_gvStudentRegister_DXMainTable');
  let text = await page.evaluate(() => {
      let elements = document.querySelectorAll('tr.dxgvDataRow_SisTheme');
      elements = [...elements];
      let data = elements.filter((element)=>{  
        if(element.getAttribute('id') !== null ){
          return  element.getAttribute('id').includes('MainContent_gvStudentRegister_DXDataRow');
        }
      });
        data = data.map((subject) => { return [...subject.childNodes];
          });
        let data_final = data.map((obj)=>{
          let schedule = {
          time:obj[1].outerText,
          week:obj[2].outerText,
          classRoom:obj[3].outerText,
          classCode:obj[4].outerText,
          classType:obj[5].outerText,
          group:obj[6].outerText,
          termCode:obj[7].outerText,
          className:obj[8].outerText,
          Description:obj[9].outerText
         }
          return schedule;
        })
      return data_final;
    });
  return text
}
}
