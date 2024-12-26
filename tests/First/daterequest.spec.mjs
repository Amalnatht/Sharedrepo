// @ts-check 
import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';
import { login , wfnavigation} from "./Login.mjs";
import {generateRandomNumber, formattedDate,formattedNextDate,formattedPreviousDate} from "./Wffunctions.mjs";



import path from 'path';
import fs from 'fs';


// Read the JSON data from the file
const filePath = path.join(process.cwd(), 'datafordatecondition.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));



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
       test.setTimeout(1500000); 
       
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
       let requesturl;
   
       let datePassed = formattedPreviousDate();

       let i = 3;
       for(let i =0;i<3;i++){
   
       //requester login
   
       await login(page, expect, requesteremail,requesterpwd,"requester");
       await page.waitForTimeout(3000);
       
       //Creating a new request
       await page.locator("(//p[text()='Create a Request'])[1]").click();
       await page.waitForTimeout(10000);
       await page.locator(`//h2[text()='What kind of Request do you want to raise today?']/ancestor::div[1]//span[text()='${data.workflowName}']`).click();
       await page.getByText("Continue").click();
   
       let vendorname = "Atlassian Inc";
   
   
       if(datePassed==formattedPreviousDate()){
   
       //Intake task completion by requester
       await page.locator("//input[@name='search-input']").pressSequentially(datePassed);
       await page.locator("//input[@name='search-input']").click();
       await page.keyboard.press("Control+A");
       await page.keyboard.press("Control+X");

       await page.locator("//input[@name='search-input']").pressSequentially(vendorname);
       await page.waitForTimeout(2000);
       await page.locator("(//label[@for='Select a vendor']//following-sibling::div[1]//div[@role='option'])[1]").click();
       await page.waitForTimeout(3000);
       await page.locator(`//label[@for='Date question']/following-sibling::div//input`).click();
       await page.keyboard.press("Control+V");
       await page.waitForTimeout(2000);
       await page.locator("//p[text()='Continue']").click();
       await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
       await page.getByText("Submit").click();
       await page.getByText("Go to Request Details").click();
       await page.waitForTimeout(1000);
       requesturl = await page.url();
       await logout(page); 
   
       // csm manager Login
       await login(page, expect, csmemail,csmpwd,"csm");
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
       
       // user select Login
       await login(page, expect, requesteremail,requesterpwd,"Engagement manager");
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
       datePassed=formattedNextDate();
   
       }
   
       else if(datePassed==formattedNextDate()){
   
        await page.locator("//input[@name='search-input']").pressSequentially(datePassed);
        await page.locator("//input[@name='search-input']").click();
        await page.keyboard.press("Control+A");
        await page.keyboard.press("Control+X");
 
        await page.locator("//input[@name='search-input']").pressSequentially(vendorname);
        await page.waitForTimeout(2000);
        await page.locator("(//label[@for='Select a vendor']//following-sibling::div[1]//div[@role='option'])[1]").click();
        await page.waitForTimeout(3000);
        await page.locator(`//label[@for='Date question']/following-sibling::div//input`).click();
        await page.keyboard.press("Control+V");
        await page.waitForTimeout(2000);
        await page.locator("//p[text()='Continue']").click();
        await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
        await page.getByText("Submit").click();
        await page.getByText("Go to Request Details").click();
        await page.waitForTimeout(1000);
        requesturl = await page.url();
        await logout(page); 
   
       //Requester manager login
   
       await login(page, expect, requestermanageremail,requestermanagerpwd,"requester manager");
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
   
   
       //User select login
   
       await login(page, expect, requesteremail,requesterpwd,"User selected");
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
       datePassed=formattedDate();
   
       }
   
       else{  
   
        await page.locator("//input[@name='search-input']").pressSequentially(datePassed);
        await page.locator("//input[@name='search-input']").click();
        await page.keyboard.press("Control+A");
        await page.keyboard.press("Control+X");
 
        await page.locator("//input[@name='search-input']").pressSequentially(vendorname);
        await page.waitForTimeout(2000);
        await page.locator("(//label[@for='Select a vendor']//following-sibling::div[1]//div[@role='option'])[1]").click();
        await page.waitForTimeout(3000);
        await page.locator(`//label[@for='Date question']/following-sibling::div//input`).click();
        await page.keyboard.press("Control+V");
        await page.waitForTimeout(2000);
        await page.locator("//p[text()='Continue']").click();
        await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
        await page.getByText("Submit").click();
        await page.getByText("Go to Request Details").click();
        await page.waitForTimeout(1000);
        requesturl = await page.url();
        await logout(page); 

       //Engagement manager login
   
       await login(page, expect, ememail,empwd,"Engagement manager");
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
   
   
       //Requester login
   
       await login(page, expect, requesteremail,requesterpwd,"requester");
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
       i++;
       }
   
       //Post intake completion
       
       
       // CSM Login
       await login(page, expect, csmemail,csmpwd,"Csm");
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
       
       
       await page.waitForTimeout(4000);
       await linkcontracct(page,"Atlassian")
       await logout(page);   
   }
   
       });
   