// @ts-check 
import { test, expect } from '@playwright/test';
// import { timeout } from '../../playwright.config';
import { chromium } from 'playwright';
import fs from 'fs';
import { login , wfnavigation} from "./Login.mjs";
import { draganddrop } from "./Draganddrop.mjs";
import { randomizedQuestionSelection, checklist } from "./Randomizedquestionselection.mjs";
import { phaseCreation , generateRandomText, generateRandomNumber} from './Wffunctions.mjs';


let workflowName;
let questionselected;
let createdtask;
let newlycreatedtask;



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
const logout = async(page)=>{
     await page.locator("//img[@alt='UserCircleUnfilled']/ancestor::div[1]").click();    
     await page.waitForTimeout(3000);
     await page.getByText("Logout").click();
     await page.waitForTimeout(10000);
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
      //  await page.locator(`//label[@for='${task.question}']/following-sibling::div//button`).click();
      //  await page.locator("//div//span[text()='USD']").click();
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


test('Wfcreation', async () => {
test.setTimeout(1500000);

const browser = await chromium.launch({ headless: false });

const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/' // Specify the directory to save recordings
    }
  });

const page = await context.newPage();

context.setDefaultTimeout(30000);

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
let requesturl,questionpassed;
let vendorname = "Atlassian Inc";


await login(page, expect, requesteremail,requesterpwd,"admin");


await wfnavigation(page);

//Create a workflow
await page.getByText('+ Add Workflow').click();
await page.getByText('Create a New Workflow').click();
workflowName = generateRandomText(7);
await page.locator('//input[@name="workflowName"]').pressSequentially(workflowName);
await page.getByText('Create Workflow').click();
await page.locator('(//p[text()="Workflow Studio Guide"]/ancestor::div[2]//p)[2]').click();

//Intake task creation
const intakeform3dots = await page.locator('//span[text()="Intake Form"]/ancestor::div[2]//button')
await intakeform3dots.click();
await page.locator("//button[text()='Edit']").click();
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');


//Intake form vendor question drag and dropping
let source = await page.locator("//p[text()='Vendor']/ancestor::div[1]");
let target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
await draganddrop(source,target,page);
await page.locator('(//p[text()="Save"])[2]').click();
await page.waitForTimeout(3000);

source = await page.locator('//p[text()="Dropdown"]/ancestor::div[1]');
await source.scrollIntoViewIfNeeded();
target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
await draganddrop(source,target,page);
questionpassed="Dropdown question";
await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
await page.locator("//p[text()='+ Add Option']/ancestor::button").click();
await page.locator("//label[@for='Add Options']/ancestor::div[1]//input[@step='any']").fill("A");
await page.keyboard.press('Enter');
await page.locator("//p[text()='+ Add Option']/ancestor::button").click();
await page.locator("//label[@for='Add Options']/ancestor::div[1]//input[@step='any']").fill("B");
await page.keyboard.press('Enter');
await page.locator(`//span[text()='Include an "Other" option to let user specify another answer']/ancestor::div[2]//button`).click();
await page.locator(`//label[@for='Response required']//following-sibling::div//button`).click();
await page.locator('(//p[text()="Save"])[2]').click();
await page.waitForTimeout(3000);


source = await page.locator('//p[text()="User Select"]/ancestor::div[1]');
await source.scrollIntoViewIfNeeded();
target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
await draganddrop(source,target,page);
questionpassed="Userselect question";
await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
await page.locator("//label[text()='Users with role: Admin']").click();
await page.locator("//label[@for='Response required']//following-sibling::div//button").click();
await page.locator('(//p[text()="Save"])[2]').click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.waitForTimeout(2000);

//checklist

await checklist(page);


await phaseCreation(page);



//manager's task
await page.locator("//p[text()='+ Add Task']/ancestor::button[1]").click();
newlycreatedtask= generateRandomText(5);
let conditionFirsttask= newlycreatedtask;
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Completion']/ancestor::span").click();
await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click();
await page.locator(`//span[text()="Requester's Manager"]/ancestor::div[@role='option']`).click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
source = await page.locator('//p[text()="Short Text"]/ancestor::div[1]');
await source.scrollIntoViewIfNeeded();
target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
await draganddrop(source,target,page);
questionpassed="Short text question";
await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
await page.locator("//label[@for='Description']/following-sibling::textarea").pressSequentially("Description");
await page.locator("//label[@for='Response required']//following-sibling::div//button").click();
await page.locator('(//p[text()="Save"])[2]').click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await checklist(page);


//TBD task
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='right']`).click();
await page.locator("//span[text()='Add Task']").click();

newlycreatedtask= generateRandomText(5);
let tbdtask = newlycreatedtask;
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Approval']/ancestor::span").click();
await page.locator("//span[text()='Select a User from Previous Task ']").click();
await page.locator(`(//label[@for='Task:']/ancestor::div[1]/div/button)[1]`).click();
await page.locator(`//div[@role='option']//span[text()='Intake Form']`).click();
await page.locator(`(//label[@for='Task:']/ancestor::div[1]/div/button)[2]`).click();
await page.locator(`//div[@role='option']`).click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');

//currency step group
source = await page.locator('//p[text()="Currency"]/ancestor::div[1]');
await source.scrollIntoViewIfNeeded();
target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
await draganddrop(source,target,page);
questionpassed="Currency question";
await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
await page.locator('(//p[text()="Save"])[2]').click();
await page.waitForTimeout(3000);


//number step group
source = await page.locator('//p[text()="Number"]/ancestor::div[1]');
await source.scrollIntoViewIfNeeded();
target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
await draganddrop(source,target,page);
questionpassed="Number question";
await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
await page.locator('(//p[text()="Save"])[2]').click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();


await checklist(page);

//Adding condition
newlycreatedtask=conditionFirsttask;
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='left']`).click();
await page.locator("//span[text()='Add Condition']").click();


await page.locator("//input[@name='taskName']").fill("Dropdown=A");
await page.locator("//p[text()='+ Add Condition']/ancestor::button").click();
await page.locator("//label[@for='Task']/following-sibling::div//button").click();
await page.locator("//div[@role='option']//span[text()='Intake Form']").click();
await page.locator("//label[@for='Question']/following-sibling::div//button").click();
await page.locator("(//div[@role='option'])[1]").click();

await page.locator("//label[@for='Condition']/following-sibling::div//button").click();
await page.locator("//div[@role='option']//span[text()='is']").click();
await page.locator("//label[@for='Value']/following-sibling::form//button").click();
await page.locator("//div[@role='option']//span[text()='A']").click();
await page.locator("(//p[text()='Save'])[2]").click();


//Adding task in no path
await page.locator(`//span[text()='NO']/ancestor::div[1]//button`).click();

newlycreatedtask = generateRandomText(5);
let conditionNotask = newlycreatedtask;
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Approval']/ancestor::span").click();
await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click();
await page.locator("//span[text()='CSM']/ancestor::div[@role='option']").click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
source = await page.locator('//p[text()="Date"]/ancestor::div[1]');
await source.scrollIntoViewIfNeeded();
target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
await draganddrop(source,target,page);
questionpassed="Date question";
await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
await page.locator('(//p[text()="Save"])[2]').click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await checklist(page);


//post intake form

const Postintakeform3dots = await page.locator('//span[text()="Post Intake"]/ancestor::div[2]//button')
let postintaketask = {
    taskname : "Post Intake"
};
await Postintakeform3dots.click();
await page.locator("//button[text()='Edit']").click();
await page.locator("//span[text()='Completion']/ancestor::span").click();
await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click();
await page.locator("//span[text()='CSM']/ancestor::div[@role='option']").click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
questionselected = await randomizedQuestionSelection(page);
postintaketask.question = questionselected;
await checklist(page);

await page.waitForTimeout(5000);
await page.locator("//p[text()='Publish']/ancestor::button").click();
await page.locator("//label[@for='Version Description']/following-sibling::textarea").fill("Version 1");
await page.waitForTimeout(3000);
await page.locator("(//p[text()='Publish'])[2]").click();
await page.waitForTimeout(15000);

await logout(page);


//REQUEST CREATION PART


let selecteddropdown = "A";
for(let i =0;i<2;i++){    
    
//requester login

await login(page, expect, requesteremail,requesterpwd,"requester");
await page.waitForTimeout(3000);

//Creating a new request
await page.locator("(//p[text()='Create a Request'])[1]").click();
await page.waitForTimeout(10000);
await page.locator(`//h2[text()='What kind of Request do you want to raise today?']/ancestor::div[1]//span[text()='${workflowName}']`).click();
await page.getByText("Continue").click();

let vendorname = "Atlassian Inc";

if(selecteddropdown=="A"){
await page.locator("//input[@placeholder='Search vendor']").pressSequentially(vendorname);
await page.waitForTimeout(2000);
await page.locator("(//label[@for='Select a vendor']//following-sibling::div[1]//div[@role='option'])[1]").click();
//dropdown
await page.locator('//label[@for="Dropdown question"]/following-sibling::div//button').click();
await page.locator(`//span[text()="${selecteddropdown}"]`).click();
//user select
await page.locator(`//label[@for='Userselect question']/following-sibling::div//input`).pressSequentially("Selfserve user 2");
await page.locator(`//label[@for='Userselect question']/following-sibling::div//span[text()='Selfserve user 2']`).click();
await page.waitForTimeout(5000);

//checklist completion
await page.locator("//p[text()='Continue']").click();
await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
await page.getByText("Submit").click();
await page.getByText("Go to Request Details").click();
await page.waitForTimeout(1000);
requesturl = await page.url();
await logout(page); 

//Manager login and task completion for yes path
await login(page, expect, requestermanageremail,requestermanagerpwd,"requester");
await page.waitForTimeout(3000);

await page.goto(requesturl);
await page.getByText(`Start "${conditionFirsttask}"`).click();
await page.locator(`//label[@for='Short text question']/following-sibling::div//input`).fill("Short text answer");
//checklist
await page.waitForTimeout(2000);
await page.locator("//nav//p[text()='Checklist']").click();
await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();

await page.getByText("Submit").click();

await logout(page);

//TBD task completion by requester (selfserveuser2)
await login(page, expect, requesteremail,requesterpwd,"requester");

await page.waitForTimeout(3000);

await page.goto(requesturl);
await page.getByText(`Start "${tbdtask}"`).click();
//currency fill
await page.waitForTimeout(3000);
await page.locator(`//label[@for='Currency question']/following-sibling::div//input`).fill("12000");
//number fill
await page.locator(`//label[@for='Number question']/following-sibling::div//input`).pressSequentially("34567");

//checklist
await page.waitForTimeout(2000);
await page.locator("//nav//p[text()='Checklist']").click();
await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();

await page.waitForTimeout(2000);
await page.locator("//p[text()='Approve']/ancestor::button").click();

await logout(page);

//Post intake form completion
await login(page, expect, csmemail,csmpwd,"csm");
await page.waitForTimeout(3000);

await page.goto(requesturl);
await page.getByText(`Start "${postintaketask.taskname}"`).click();
await questionassertionandfillinganswer(postintaketask.question, page);
await page.waitForTimeout(2000);
await page.getByText("Submit").click();

//link contract
await page.waitForTimeout(4000);
await linkcontracct(page,"Atlassian")
await logout(page);  
selecteddropdown = "B";
}
else{

    await page.locator("//input[@placeholder='Search vendor']").pressSequentially(vendorname);
    await page.waitForTimeout(2000);
    await page.locator("(//label[@for='Select a vendor']//following-sibling::div[1]//div[@role='option'])[1]").click();
    //dropdown
    await page.locator('//label[@for="Dropdown question"]/following-sibling::div//button').click();
    await page.locator(`//span[text()="${selecteddropdown}"]`).click();
    //user select
    await page.locator(`//label[@for='Userselect question']/following-sibling::div//input`).pressSequentially("Selfserve user 2");
    await page.locator(`//label[@for='Userselect question']/following-sibling::div//span[text()='Selfserve user 2']`).click();
    await page.waitForTimeout(5000);
    
    //checklist completion
    await page.locator("//p[text()='Continue']").click();
    await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
    await page.getByText("Submit").click();
    await page.getByText("Go to Request Details").click();
    await page.waitForTimeout(1000);
    requesturl = await page.url();
    await logout(page); 
    
    //Csm login and task completion for no path
    await login(page, expect, csmemail,csmpwd,"csm");
    await page.waitForTimeout(3000);
    
    await page.goto(requesturl);
    await page.getByText(`Start "${conditionNotask}"`).click();
    //date question
    await page.locator(`//label[@for='Date question']/following-sibling::div//input`).click();
    const datevar = generateRandomNumber(35);
    await page.locator(`(//div[@role='option'])[${datevar}]`).click();
    //checklist
    await page.waitForTimeout(2000);
    await page.locator("//nav//p[text()='Checklist']").click();
    await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
    await page.waitForTimeout(2000);
    await page.locator("//p[text()='Approve']/ancestor::button").click();
    
    await logout(page);
    
    //TBD task completion by requester (selfserveuser2)
    await login(page, expect, requesteremail,requesterpwd,"requester");
    
    await page.waitForTimeout(3000);
    
    await page.goto(requesturl);
    await page.getByText(`Start "${tbdtask}"`).click();
    //currency fill
    await page.waitForTimeout(3000);
    await page.locator(`//label[@for='Currency question']/following-sibling::div//input`).fill("12000");
    //number fill
    await page.locator(`//label[@for='Number question']/following-sibling::div//input`).pressSequentially("34567");
    
    //checklist
    await page.waitForTimeout(2000);
    await page.locator("//nav//p[text()='Checklist']").click();
    await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
    
    await page.waitForTimeout(2000);
    await page.locator("//p[text()='Approve']/ancestor::button").click();
    
    await logout(page);
    
    //Post intake form completion
    await login(page, expect, csmemail,csmpwd,"csm");
    await page.waitForTimeout(3000);
    
    await page.goto(requesturl);
    await page.getByText(`Start "${postintaketask.taskname}"`).click();
    await questionassertionandfillinganswer(postintaketask.question, page);
    await page.waitForTimeout(2000);
    await page.getByText("Submit").click();
    
    //link contract
    await page.waitForTimeout(4000);
    await linkcontracct(page,"Atlassian")
    await logout(page); 
    
}




}




});
