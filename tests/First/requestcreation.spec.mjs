// @ts-check 
import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';
import { login , wfnavigation} from "./Login.mjs";
import {generateRandomNumber} from "./Wffunctions.mjs";



import path from 'path';
import fs from 'fs';


// Read the JSON data from the file
const filePath = path.join(process.cwd(), 'data.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let requestidfromdb,requestNo;

const requestIdFromUrl = async(page,url)=>{
  return await url.substring(37);
}
const requestNoFromColumn = async(page,requestid)=>{
  await page.goto('https://app.spendflo.com/v2/requests');
  await page.waitForTimeout(3000);
  let e = await page.locator(`(//a[contains(@href,'${requestid}')]//p)[1]`)
  let requestno = await e.textContent();
  return requestno;
}

const homepagevalidation = async(page,vendorname,requestdbid,wfname,taskname,username)=>{
  await page.goto("https://app.spendflo.com");

  await page.waitForLoadState('domcontentloaded');
//pendo guide
// Wait for the popup to appear with a timeout
await page.waitForTimeout(7000);
const pendopopup = await page.locator('//div[@id="pendo-base"]//button[@aria-label="Close"]');
if (await pendopopup.count() > 0) { // Check if the element exists
  if (await pendopopup.isEnabled()) { // Check if the element is enabled
    await pendopopup.click();
    console.log('Pendo popup closed successfully');
  } else {
    console.log('Pendo popup is not enabled');
  }
} else {
  console.log('Pendo popup is not present on the page');
}


  const element = await page.locator(`(//h4[text()='My Requests']/ancestor::div[3]//h3[text()='${vendorname}'])[1]`);
  const isPresent = await element.count() > 0;
  console.log('Is element present:', isPresent);
  const x = page.locator(`//a[contains(@href,'${requestdbid}')]//h3`);
  await expect(x).toHaveText(vendorname);
  const y = page.locator(`(//a[contains(@href,'${requestdbid}')]/ancestor::div[3]//h5)[2]`);
  await expect(y).toHaveText(wfname);
  const z = page.locator(`(//a[contains(@href,'${requestdbid}')]/ancestor::div[2]//h5)[4]`);
  await expect(z).toHaveText(taskname);
  const c = page.locator(`(//a[contains(@href,'${requestdbid}')]/ancestor::div[2]//h5)[6]`);
  await expect(c).toHaveText(username);
}
const requestlistingvalidaton = async(page,requester,vendorname,requestno,wfname,taskname,username)=>{
  await page.goto("https://app.spendflo.com/v2/requests");
  await page.waitForTimeout(3000);

  await page.waitForLoadState('domcontentloaded');
//pendo guide
// Wait for the popup to appear with a timeout
await page.waitForTimeout(7000);
const pendopopup = await page.locator('//div[@id="pendo-base"]//button[@aria-label="Close"]');
if (await pendopopup.count() > 0) { // Check if the element exists
  if (await pendopopup.isEnabled()) { // Check if the element is enabled
    await pendopopup.click();
    console.log('Pendo popup closed successfully');
  } else {
    console.log('Pendo popup is not enabled');
  }
} else {
  console.log('Pendo popup is not present on the page');
}


  await page.locator(`//p[text()='All']`).click();
  const a = page.locator(`//p[text()='${requestno}']/ancestor::td/following-sibling::td[2]//p`);
  await expect(a).toHaveText(requester);
  const b = page.locator(`//p[text()='${requestno}']/ancestor::td/following-sibling::td[1]//p`);
  await expect(b).toHaveText(vendorname);
  const c = page.locator(`//p[text()='${requestno}']/ancestor::td/following-sibling::td[7]//p`);
  await expect(c).toHaveText(wfname);
  const d = page.locator(`//p[text()='${requestno}']/ancestor::td/following-sibling::td[9]//p`);
  await expect(d).toHaveText(taskname);
  const e = page.locator(`//p[text()='${requestno}']/ancestor::td/following-sibling::td[10]//p`);
  await expect(e).toHaveText(username);
}

const questionassertionandfillinganswer =async (task, page)=>{
 await page.waitForTimeout(4000);
  if(task.question=="Short text question"){
    // await expect(page.locator("body")).toContainText('Short text question');
    await page.locator(`//label[@for='${task.question}']/following-sibling::div//input`).fill("Short text answer");
  }
  else if (task.question=="Long text question"){
    // await expect(page.locator("body")).toContainText("Long text question");
    await page.locator(`//label[@for='${task.question}']/following-sibling::div//textarea`).fill("Long text answer");
  }
  else if (task.question=="Dropdown question"){
    // await expect(page.locator("body")).toContainText("Dropdown question")
    await page.locator(`//label[@for='${task.question}']/following-sibling::div//button`).click();
    await page.locator("//div[@role='option'][1]").click();
  }
  else if (task.question=="Single choice question"){
    // await expect(page.locator("body")).toContainText("Single choice question")
    await page.locator(`//label[@for='${task.question}']/following-sibling::div//span[@role='radio'][1]`).click();

  }
  else if (task.question=="Mulitple choice question"){
    // await expect(page.locator("body")).toContainText("Mulitple choice question")
    await page.locator(`(//label[@for='${task.question}']/following-sibling::div//label[@role='checkbox'])[1]`).click();
  }
  else if (task.question=="Number question"){
    // await expect(page.locator("body")).toContainText("Number question")
    await page.locator(`//label[@for='${task.question}']/following-sibling::div//input`).pressSequentially("34567");
  }
  else if (task.question=="Date question"){ 
    // await expect(page.locator("body")).toContainText("Date question")
    await page.locator(`//label[@for='${task.question}']/following-sibling::div//input`).click();
    const datevar = generateRandomNumber(35);
    await page.locator(`(//div[@role='option'])[${datevar}]`).click();
  }
  else if (task.question=="Attachement question"){
    // await expect(page.locator("body")).toContainText("Attachement question")
    const filePath = './tests/First/Cypress-Renewal.pdf'; 
    
    await page.setInputFiles(`//label[@for='${task.question}']/following-sibling::button//input[@type="file"]`, filePath);
    await page.waitForTimeout(10000);
    // await page.locator(`[label@for='${task.question}']/following-sibling::button`).click();
  }
  else if (task.question=="Currency question"){
    // await expect(page.locator("body")).toContainText("Currency question")
    await page.locator(`//label[@for='${task.question}']/following-sibling::div//button`).click();
    await page.locator("//div//span[text()='USD']").click();
    await page.waitForTimeout(3000);
    await page.locator(`//label[@for='${task.question}']/following-sibling::div//input`).fill("12000");
  }
  else if (task.question=="Userselect question"){
    // await expect(page.locator("body")).toContainText("Userselect question");
    await page.locator(`//label[@for='${task.question}']/following-sibling::div//input`).pressSequentially("Selfserve user 2");
    await page.locator(`//label[@for='${task.question}']/following-sibling::div//span[text()='Selfserve user 2']`).click();
    await page.waitForTimeout(5000);
  }

  let checklisttab = await page.locator("//nav//p[text()='Checklist']");
  if(await checklisttab.count()>0){
    await page.waitForTimeout(4000);
    await checklisttab.click();
    await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
  }
}

const logout = async(page)=>{
  await page.locator("//img[@alt='UserCircleUnfilled']/ancestor::div[1]").click();    
  await page.waitForTimeout(3000);
  await page.getByText("Logout").click();
  await page.waitForTimeout(10000);
}

const linkcontracct = async(page,contractname)=>{
await page.locator("//p[text()='Link Existing Contract']/ancestor::button").click();
await page.waitForTimeout(7000);
await page.locator("//label[@for='Select contract']//following-sibling::div//input[@placeholder='Search']").click();
await page.locator("//label[@for='Select contract']//following-sibling::div//input[@placeholder='Search']").fill(contractname);
await page.waitForTimeout(4000);
await page.locator("(//div[@role='listbox']//button)[1]").click();
await page.waitForTimeout(3000);
await page.locator("//p[text()='Add']/ancestor::button").click();
await page.waitForTimeout(3000);
await page.locator(`//p[text()="Got it"]`).click();
await page.waitForTimeout(3000);
}

test('Requestcreation', async () => {
    test.setTimeout(3000000); 
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      recordVideo: {
        dir: 'videos/' // Specify the directory to save recordings
      }
    });
    context.setDefaultTimeout(30000);

    const page = await context.newPage();
    
    const csmemail = "amalnath@spendflo.com";
    const requesteremail =  "selfserve-user2@dev-testing.spendflo.io";
    const csmpwd = "Amalnath123@";
    const requesterpwd = "Test@1234";
    const ememail = "ganesh.aravind@spendflo.com";
    const  empwd = "Spen*011";
    const requestermanageremail ="selfserve-user1@dev-testing.spendflo.io";
    const requestermanagerpwd = "Test@123";
    const requesterteamowneremail = "spendflotest01@gmail.com";
    const requesterteamownerpwd = "Spendflo@1234";


    //requester login

    await login(page, expect, requesteremail,requesterpwd,"requester");
    await page.waitForTimeout(3000);
    
    //Creating a new request
    await page.locator("(//p[text()='Create a Request'])[1]").click();
    await page.waitForTimeout(10000);
    await page.locator(`//h2[text()='What kind of Request do you want to raise today?']/ancestor::div[1]//span[text()='${data.workflowName}']`).click();
    await page.getByText("Continue").click();

    //Intake task completion by requester
    let vendorname = "Atlassian Inc";
    let modifiedvendorname = "Atlassian,Inc";
    await page.locator("//input[@name='search-input']").pressSequentially(vendorname);
    await page.waitForTimeout(2000);
    await page.locator("(//label[@for='Select a vendor']//following-sibling::div[1]//div[@role='option'])[1]").click();
    await questionassertionandfillinganswer(data.task1details,page);
    await page.locator("//p[text()='Continue']").click();
    await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
    await page.getByText("Submit").click();
    await page.getByText("Go to Request Details").click();
    const requesturl = await page.url();
    //storing request id
    console.log(requesturl)
    requestidfromdb = await requestIdFromUrl(page,requesturl);
    //storing requestno
    requestNo = await requestNoFromColumn(page,requestidfromdb);

    await logout(page);



    //Requester Manager login
    await login(page, expect, requestermanageremail,requestermanagerpwd,"requester manager");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task16details.taskname,"selfserve user1")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task16details.taskname,"selfserve user1");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task16details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task16details, page)
    if(data.task16details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await logout(page);


    //Csm Login
    await login(page, expect, csmemail,csmpwd,"csm");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task2details.taskname,"Amalnath T");
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task2details.taskname,"Amalnath T");
    await page.waitForTimeout(3000);


    await page.goto(requesturl);
    await page.getByText(`Start "${data.task2details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task2details, page)
    if(data.task2details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await logout(page);



    // Em manager Login
    await login(page, expect, ememail,empwd,"Engagement manager");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task4details.taskname,"Ganesh Aravind")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task4details.taskname,"Ganesh Aravind");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task4details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task4details, page)
    if(data.task4details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await logout(page);

    // Requester manager Login
    await login(page, expect, requestermanageremail,requestermanagerpwd,"Requester manager");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task3details.taskname,"selfserve user1")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task3details.taskname,"selfserve user1");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task3details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task3details, page)
    if(data.task3details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await logout(page);   

    // csm Login
    await login(page, expect, csmemail,csmpwd,"csm");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task5details.taskname,"Amalnath T")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task5details.taskname,"Amalnath T");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task5details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task5details, page)
    if(data.task5details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await logout(page);   


    // user select Login
    await login(page, expect, requesteremail,requesterpwd,"requesterr");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task6details.taskname,"Selfserve user 2")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task6details.taskname,"Selfserve user 2");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task6details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task6details, page)
    if(data.task6details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await logout(page);   


    // em Login
    await login(page, expect, ememail,empwd,"Engagement manager");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task7details.taskname,"Ganesh Aravind")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task7details.taskname,"Ganesh Aravind");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task7details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task7details, page)
    if(data.task7details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await logout(page);   


    // requester Login
    await login(page, expect, requesteremail,requesterpwd,"requester");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task8details.taskname,"Selfserve user 2")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task8details.taskname,"Selfserve user 2");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task8details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task8details, page)
    if(data.task8details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }

    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task11details.taskname,"Selfserve user 2")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task11details.taskname,"Selfserve user 2");
    await page.goto(requesturl);

    await page.waitForTimeout(4000);
    await page.getByText(`Start "${data.task11details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task11details, page)
    if(data.task11details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await logout(page);   

    // Requester teamowner Login
    await login(page, expect, requesterteamowneremail,requesterteamownerpwd,"Team owner");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task12details.taskname,"spendflotest 01")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task12details.taskname,"spendflotest 01");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task12details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task12details, page)
    if(data.task12details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await logout(page);  


    // Userselect Login
    await login(page, expect, requesteremail,requesterpwd,"User select");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task9details.taskname,"Selfserve user 2")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task9details.taskname,"Selfserve user 2");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task9details.taskname}"`).click();
    await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
    if(data.task9details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }

    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task10details.taskname,"Selfserve user 2")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task10details.taskname,"Selfserve user 2");
    await page.goto(requesturl);

    await page.waitForTimeout(4000);
    await page.getByText(`Start "${data.task10details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task10details, page)
    await page.waitForTimeout(5000);
    if(data.task10details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await page.waitForTimeout(10000);
    await logout(page);  



    // team owner Login
    await login(page, expect, requesterteamowneremail,requesterteamownerpwd,"Team owner");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task13details.taskname,"spendflotest 01")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task13details.taskname,"spendflotest 01");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task13details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task13details, page)
    if(data.task13details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await logout(page);   

    // User select Login
    await login(page, expect, requesteremail,requesterpwd,"User select");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task14details.taskname,"Selfserve user 2")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task14details.taskname,"Selfserve user 2");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task14details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task14details, page)
    await page.waitForTimeout(4000);
    if(data.task14details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await logout(page);   

    // CSM Login
    await login(page, expect, csmemail,csmpwd,"Csm");
    await homepagevalidation(page,modifiedvendorname,requestidfromdb,data.workflowName,data.task15details.taskname,"Amalnath T")
    await requestlistingvalidaton(page,"Selfserve user 2",modifiedvendorname,requestNo,data.workflowName,data.task15details.taskname,"Amalnath T");
    await page.waitForTimeout(3000);

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task15details.taskname}"`).click();
    await questionassertionandfillinganswer(data.task15details, page)
    if(data.task15details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }


    //Audit log validation


      await page.waitForTimeout(4000);
      await linkcontracct(page,"Atlassian")
      await logout(page);   

    });
