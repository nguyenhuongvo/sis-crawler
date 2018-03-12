const puppeteer = require('puppeteer');
const loginFile = require('./login');
module.exports ={
getMarks: async function run(studentCode,password) {

  const page = await loginFile.login(studentCode,password)
  await page.waitFor(1000);
  await page.goto('http://sis.hust.edu.vn/ModuleGradeBook/StudentCourseMarks.aspx');

  await page.waitFor('#MainContent_gvCourseMarks_DXMainTable');

  let text = await page.evaluate(() => {
      let elements = document.querySelectorAll('tr.dxgvDataRow_SisTheme');
      elements = [...elements];
      let data = elements.filter((element)=>{  
        if(element.getAttribute('id') !== null ){
          return  element.getAttribute('id').includes('MainContent_gvCourseMarks_DXDataRow');
        }
      });
        data = data.map((subject) => { return [...subject.childNodes];
          });
        let data_final = data.map((obj)=>{
         let mark = {
         	semester:obj[1].outerText,
         	termCode:obj[2].outerText,
         	termName:obj[3].outerText,
         	numberOfCredits:obj[4].outerText,
         	classCode:obj[5].outerText,
         	pointProcess:obj[6].outerText,
         	endOfPeriod:obj[7].outerText,
         	pointOfTheLetter:obj[8].outerText,
         }
         return mark;
        })
      return data_final;
    });
  return text
}
}