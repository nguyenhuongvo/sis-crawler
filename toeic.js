const loginFile = require('./login');
const puppeteer = require('puppeteer');
module.exports ={
  getToeic: async function run(username,password,studentCode) {


    const page = await  loginFile.login(username,password);
    await page.waitFor(1000);
    await page.goto('http://sis.hust.edu.vn/ModuleGradeBook/ViewToeicMarks.aspx');
    await page.click('#MainContent_tbStudentID_I');
    await page.keyboard.type(studentCode);
    await page.waitFor(1000);
    await page.click('#MainContent_cbTermID_B-1Img');
    await page.waitFor(1000);
    await page.click('#MainContent_cbTermID_DDD_L_LBI0T0');
    await page.waitFor(1000);

    await page.waitFor('#MainContent_gvStudents_DXMainTable');
    text = await page.evaluate(() => {
      let elements = document.querySelectorAll('tr.dxgvDataRow_SisTheme');
      elements = [...elements];
      let data = elements.filter((element)=>{  
        if(element.getAttribute('id') !== null ){
          return  element.getAttribute('id').includes('MainContent_gvStudents_DXDataRow');
        }
      });
      data = data.map((subject) => { return [...subject.childNodes];
      });
    function convertDate(date){
    var parts =date.split('.')
    var mydate = new Date(parts[2],parts[1]-1,parts[0]);
    var milisecond = mydate.getTime();
    return milisecond;
    }
      let data_final = data.map((obj)=>{
        let toeicMark = {
          studentCode:obj[1].textContent,
          fullName:obj[2].textContent,
          birthday:convertDate(obj[3].textContent),
          semester:obj[4].textContent,
          description:obj[5].textContent,
          testDay:convertDate(obj[6].textContent),
          mark:obj[9].textContent,
        }
        return toeicMark;
      })
      return data_final;
    })
    return text
  }
}