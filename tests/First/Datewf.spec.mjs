// @ts-check 
import { test, expect } from '@playwright/test';
// import { timeout } from '../../playwright.config';
import { chromium } from 'playwright';
import fs from 'fs';
import { login , wfnavigation} from "./Login.mjs";
import { draganddrop } from "./Draganddrop.mjs";
import { randomizedQuestionSelection, checklist } from "./Randomizedquestionselection.mjs";
import { phaseCreation , generateRandomText, formattedDate} from './Wffunctions.mjs';

class Taskdetails {
  constructor(question, typeoftask, userrole, taskname) {
      this.question = question;
      this.typeoftask = typeoftask;
      this.userrole = userrole;
      this.taskname = taskname;
  }
}


let task1details;
let task2details;
let task3details;
let task4details;
let task5details;
let task6details;
let task7details;
let task8details;


let workflowName;
let questionselected;
let createdtask;
let newlycreatedtask;
let questionpassed;
let conditionFirsttask,conditonSecondtask,conditionThirdtask;
let currentDate;
let conditionName;


test('Conditonwfcreation', async () => {
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
const user2email =  "selfserve-user2@dev-testing.spendflo.io";
const csmpwd = "Amalnath123@";
const user2pwd = "Test@1234";

await login(page, expect, csmemail,csmpwd,"admin");

// await page.locator("//div[@class='beamerAnnouncementBarClose']").click();

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
console.log("questionselected: ",questionselected)
task1details = new Taskdetails(questionselected, "completion" , "requester", "Intake Form");

await phaseCreation(page);


//First task inside the Phase
await page.locator("//p[text()='+ Add Task']/ancestor::button[1]").click();
newlycreatedtask = generateRandomText(5);
conditionFirsttask=newlycreatedtask;
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Approval']/ancestor::span").click();
await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click();
await page.locator("//span[text()='CSM']/ancestor::div[@role='option']").click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
questionselected = await randomizedQuestionSelection(page);
await checklist(page);
console.log("questionselected: ",questionselected)
task2details = new Taskdetails(questionselected,"Approval", "csm",newlycreatedtask);

//second task
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator("//button[contains(@class, 'absolute bottom')]").click();

newlycreatedtask= generateRandomText(5);
conditonSecondtask=newlycreatedtask;
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Completion']/ancestor::span").click();
await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click();
await page.locator(`//span[text()="Requester's Manager"]/ancestor::div[@role='option']`).click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
questionselected = await randomizedQuestionSelection(page);
await checklist(page);
console.log("questionselected: ",questionselected)
task3details = new Taskdetails(questionselected,"Completion", "Requester Manager",newlycreatedtask);

//third task
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator("//button[contains(@class, 'absolute bottom')]").click();

newlycreatedtask= generateRandomText(5);
conditionThirdtask=newlycreatedtask;
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Approval']/ancestor::span").click();
await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click();
await page.locator("//span[text()='Engagement Manager']/ancestor::div[@role='option']").click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
questionselected = await randomizedQuestionSelection(page);
await checklist(page);
console.log("questionselected: ",questionselected)
task4details = new Taskdetails(questionselected,"Approval", "Engagement Manager",newlycreatedtask);

//Adding first condition

newlycreatedtask=conditionFirsttask;
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='left']`).click();
await page.locator("//span[text()='Add Condition']").click();

currentDate= formattedDate();
await page.locator("//input[@name='taskName']").fill(currentDate);
await page.locator("//input[@name='taskName']").click();
await page.keyboard.press('Control+A');
await page.keyboard.press('Control+X');


conditionName = "Date is less than today";
await page.locator("//input[@name='taskName']").fill(conditionName);
await page.locator("//p[text()='+ Add Condition']/ancestor::button").click();
await page.locator("//label[@for='Task']/following-sibling::div//button").click();
await page.locator("//div[@role='option']//span[text()='Intake Form']").click();
await page.locator("//label[@for='Question']/following-sibling::div//button").click();
await page.locator("(//div[@role='option'])[1]").click();
await page.locator("//label[@for='Condition']/following-sibling::div//button").click();
await page.locator("//div[@role='option']//span[text()='before']").click();
await page.locator(`//input[@type='text' and @placeholder='MM/dd/yyyy']`).click();
await page.keyboard.press('Control+V');
await page.locator("(//p[text()='Save'])[2]").click();
await page.waitForTimeout(3000);



//Adding second condition
newlycreatedtask=conditonSecondtask;
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='left']`).click();
await page.locator("//span[text()='Add Condition']").click();


await page.locator("//input[@name='taskName']").fill(currentDate);
await page.locator("//input[@name='taskName']").click();
await page.keyboard.press('Control+A');
await page.keyboard.press('Control+X');


conditionName = "Date is greater than today";
await page.locator("//input[@name='taskName']").fill(conditionName);
await page.locator("//p[text()='+ Add Condition']/ancestor::button").click();
await page.locator("//label[@for='Task']/following-sibling::div//button").click();
await page.locator("//div[@role='option']//span[text()='Intake Form']").click();
await page.locator("//label[@for='Question']/following-sibling::div//button").click();
await page.locator("(//div[@role='option'])[1]").click();
await page.locator("//label[@for='Condition']/following-sibling::div//button").click();
await page.locator(`//div[@role='option']//span[text()='after']`).click();
await page.locator(`//input[@type='text' and @placeholder='MM/dd/yyyy']`).click();
await page.keyboard.press('Control+V');
await page.locator("(//p[text()='Save'])[2]").click();
await page.waitForTimeout(3000);


//Adding Third condition
newlycreatedtask=conditionThirdtask;
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='left']`).click();
await page.locator("//span[text()='Add Condition']").click();


await page.locator("//input[@name='taskName']").fill(currentDate);
await page.locator("//input[@name='taskName']").click();
await page.keyboard.press('Control+A');
await page.keyboard.press('Control+X');


conditionName = "Date is equal to today";
await page.locator("//input[@name='taskName']").fill(conditionName);
await page.locator("//p[text()='+ Add Condition']/ancestor::button").click();
await page.locator("//label[@for='Task']/following-sibling::div//button").click();
await page.locator("//div[@role='option']//span[text()='Intake Form']").click();
await page.locator("//label[@for='Question']/following-sibling::div//button").click();
await page.locator("(//div[@role='option'])[1]").click();
await page.locator("//label[@for='Condition']/following-sibling::div//button").click();
await page.locator("//div[@role='option']//span[text()='is']").click();
await page.locator(`//input[@type='text' and @placeholder='MM/dd/yyyy']`).click();
await page.keyboard.press('Control+V');
await page.locator("(//p[text()='Save'])[2]").click();
await page.waitForTimeout(3000);




//Adding a serial task to first task

newlycreatedtask=conditionFirsttask;
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.waitForTimeout(3000);
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='right']`).click();
await page.locator("//span[text()='Add Task']").click();

newlycreatedtask= generateRandomText(5);
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Approval']/ancestor::span").click();
await page.locator("//span[text()='Select a User']/ancestor::span").click();
await page.locator('//input[@name="search-input"]').pressSequentially("Selfserve user 2");
await page.waitForTimeout(3000);
await page.locator("//div[@role='listbox']/div[1]").click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
questionselected = await randomizedQuestionSelection(page);
await checklist(page);
console.log("questionselected: ",questionselected)
task5details = new Taskdetails(questionselected,"Approval", "Selfserve user 2",newlycreatedtask);

//Adding a serial task to second task
newlycreatedtask=conditonSecondtask;
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.waitForTimeout(3000);
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='right']`).click();
await page.locator("//span[text()='Add Task']").click();

newlycreatedtask= generateRandomText(5);
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Completion']/ancestor::span").click();
await page.locator("//span[text()='Select a User']/ancestor::span").click();
await page.locator('//input[@name="search-input"]').pressSequentially("Selfserve user 2");
await page.waitForTimeout(3000);
await page.locator("//div[@role='listbox']/div[1]").click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
questionselected = await randomizedQuestionSelection(page);
await checklist(page);
task6details = new Taskdetails(questionselected,"Completion", "Selfserve user 2",newlycreatedtask);


//Adding a serial task to third task

newlycreatedtask=conditionThirdtask;
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.waitForTimeout(3000);
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='right']`).click();
await page.locator("//span[text()='Add Task']").click();

newlycreatedtask= generateRandomText(5);
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Approval']/ancestor::span").click();
await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click(); 
await page.locator("//div[@role='option']//span[text()='Requester']").click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
questionselected = await randomizedQuestionSelection(page);
await checklist(page);
console.log("questionselected: ",questionselected)
task7details = new Taskdetails(questionselected,"Approval", "Requester",newlycreatedtask);



const Postintakeform3dots = await page.locator('//span[text()="Post Intake"]/ancestor::div[2]//button')
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
await checklist(page);
console.log("questionselected: ",questionselected)
task8details = new Taskdetails(questionselected, "Completion", "csm" , "Post Intake");



await page.waitForTimeout(7000);
await page.locator("//p[text()='Publish']/ancestor::button").click();
await page.locator("//label[@for='Version Description']/following-sibling::textarea").fill("Version 1");
await page.waitForTimeout(3000);
await page.locator("(//p[text()='Publish'])[2]").click();
await page.waitForTimeout(15000);

const Information = {
  task1details,
  task2details,
  task3details,
  task4details,
  task5details,
  task6details,
  task7details,
  task8details,
  workflowName
}
// Write the combined object to a JSON file
fs.writeFileSync('datafordatecondition.json', JSON.stringify(Information, null, 2), 'utf-8');

});
