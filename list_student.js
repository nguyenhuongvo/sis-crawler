const puppeteer = require('puppeteer');
const loginFile = require('./login');

async function getListStudent(studentCode,password,termcode,semester) {
  const page = await loginFile.login(studentCode,password);
  await page.waitFor(1000);
  await page.goto('http://sis.hust.edu.vn/ModuleRegisterClass/ClassRegisterList.aspx');

  await page.waitFor('#MainContent_rpInfoClass');
  await page.click('#MainContent_rpInfoClass_tbCourseID_I');
  await page.keyboard.type(termcode);
  await page.click('#MainContent_rpInfoClass_cbTermID_B-1Img');
  await page.waitFor(1000);
    const semester_select = await page.evaluate((semester) => {
      let elements = document.querySelectorAll('tr.dxeListBoxItemRow_SisTheme');
      elements = [...elements];
      let data = elements.filter((element)=>{  
        if(element.firstElementChild.getAttribute('id') !== null ){
          return  element.firstElementChild.getAttribute('id').includes('MainContent_rpInfoClass_cbTermID_DDD_L_LBI');
        }
      });
      data = data.map((subject) => { return [...subject.childNodes];
      });
      var str;
      for(let i = 3; i < data.length; i++){
        if(semester == data[i][1].innerText){
          str = '#MainContent_rpInfoClass_cbTermID_DDD_L_LBI'+(i-1)+'T0';
        }
      } 
      return str;   
    },semester)
     await page.click(semester_select);
     await page.waitFor('div#MainContent_gvClassList_DXPagerBottom')

  const totalClass = await page.evaluate(() => {
      let elements = document.querySelectorAll('div#MainContent_gvClassList_DXPagerBottom b.dxp-summary');
      var data = elements[0].textContent;
      var dataArray= data.split(' ');
      return dataArray[3];
    })
  console.log(totalClass);

  var result = [];
  for(var i =0;i<totalClass;i++){
    for(var j=0;j<=4;j++){
      console.log(i);
      var listStudent= [];
      await page.click('#MainContent_gvClassList_DXDataRow'+(j+(i*5)));
      await page.waitFor('div#MainContent_gvStudentClassList_DXPagerBottom')
      const totalPage = await page.evaluate(() => {
      let elements = document.querySelectorAll('div#MainContent_gvStudentClassList_DXPagerBottom b.dxp-summary');
      var data = elements[0].textContent;
      var dataArray= data.split(' ');
      return dataArray[3];
    })
      for(var i=1;i<totalPage;i++){
      await page.waitFor('table#MainContent_gvStudentClassList_DXMainTable')
      let text = await page.evaluate(() => {
        let elements = document.querySelectorAll('tr.dxgvDataRow_SisTheme');
      elements = [...elements];
      let data = elements.filter((element)=>{  
        if(element.getAttribute('id') !== null ){
          return  element.getAttribute('id').includes('MainContent_gvStudentClassList_DXDataRow');
        }
      });
        data = data.map((subject) => { return [...subject.childNodes];
          });
        let data_final = data.map((obj)=>{
         let student = {
          studentCode:obj[1].outerText,
          fullName:obj[2].outerText,
          class:obj[3].outerText,
          status:obj[4].outerText
         }
         return student;
        })
      return data_final;
    });
      console.log(text);
      listStudent.push(text);
      await page.click('div#MainContent_gvStudentClassList_DXPagerBottom .dxWeb_pNext_SisTheme');
    }
    console.log(listStudent);
    result.push(listStudent);
    await page.click('div#MainContent_gvClassList_DXPagerBottom .dxWeb_pNext_SisTheme');
  }
console.log(result);
return(result);
}
}
getListStudent('20142971','uongtriminh1996','MIL1110','20152');