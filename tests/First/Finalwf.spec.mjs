// @ts-check 
import { test, expect } from '@playwright/test';
// import { timeout } from '../../playwright.config';
import { chromium } from 'playwright';
import fs from 'fs';
import { login , wfnavigation} from "./Login.mjs";
import { draganddrop } from "./Draganddrop.mjs";
import { randomizedQuestionSelection, checklist } from "./Randomizedquestionselection.mjs";
import { phaseCreation , generateRandomText} from './Wffunctions.mjs';

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
let task9details;
let task10details;
let task11details;
let task12details;
let task13details;
let task14details;
let task15details;
let task16details;



let workflowName;
let questionselected;
let createdtask;
let newlycreatedtask;





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

questionselected = await randomizedQuestionSelection(page);
await checklist(page);
console.log("questionselected: ",questionselected)
task1details = new Taskdetails(questionselected, "completion" , "requester", "Intake Form");

await phaseCreation(page);


//First task inside the Phase
await page.locator("//p[text()='+ Add Task']/ancestor::button[1]").click();
newlycreatedtask = generateRandomText(5);
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
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='left']`).click();
await page.locator("//span[text()='Add Task']").click();

newlycreatedtask= generateRandomText(5);
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


//Second Phase creation
phaseCreation(page);

//4th task

await page.locator("//p[text()='+ Add Task']/ancestor::button[1]").click();
newlycreatedtask = generateRandomText(5);
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
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
task5details = new Taskdetails(questionselected,"Completion", "csm",newlycreatedtask);


//5th task
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
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
task6details = new Taskdetails(questionselected,"Approval", "Selfserve user 2",newlycreatedtask);

//6th task
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator("//button[contains(@class, 'absolute bottom')]").click();

newlycreatedtask= generateRandomText(5);
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Completion']/ancestor::span").click();
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
task7details = new Taskdetails(questionselected,"Completion", "Enagagement Manager",newlycreatedtask);

//7th task
//3rd phase creation
phaseCreation(page);
let phasecreated = await page.locator(`//h1[text()='Completed']`);
await phasecreated.scrollIntoViewIfNeeded();
await phasecreated.hover();

await page.waitForTimeout(5000);
await page.locator("//p[text()='+ Add Task']/ancestor::button[1]").click();
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
task8details = new Taskdetails(questionselected,"Approval", "Requester",newlycreatedtask);
let requesterApproval = newlycreatedtask;


//8th task without form and with checklist
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
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
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
questionselected = "No question selected";

await checklist(page);

console.log("questionselected: ",questionselected)

task9details = new Taskdetails(questionselected,"Completion", "Selfserve user 2",newlycreatedtask);

//9th task with form and without checklist
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.waitForTimeout(2000);
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='right']`).click();
await page.waitForTimeout(2000);
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
//checklist
await page.waitForTimeout(7000);
await page.locator('//p[text()="Save & Continue"]').click();
//notification tab
await page.waitForTimeout(7000);
await page.locator('//p[text()="Save & Continue"]').click();
task10details = new Taskdetails(questionselected,"Completion", "Selfserve user 2",newlycreatedtask);
let withformandwithoutchecklist = newlycreatedtask;

//10th task
await page.waitForTimeout(7000);
newlycreatedtask = requesterApproval;
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
console.log("newlycreatedtask;",newlycreatedtask);
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator("//button[contains(@class, 'absolute bottom')]").click();

newlycreatedtask= generateRandomText(5);
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Completion']/ancestor::span").click();
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
task11details = new Taskdetails(questionselected,"Completion", "Requester",newlycreatedtask);

//11th task
await page.waitForTimeout(4000);
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator("//button[contains(@class, 'absolute bottom')]").click();

newlycreatedtask= generateRandomText(5);
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Approval']/ancestor::span").click();
await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click(); 
await page.locator(`//span[text()="Requester's Team Owner"]/ancestor::div[@role='option']`).click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
questionselected = await randomizedQuestionSelection(page);
await checklist(page);
console.log("questionselected: ",questionselected)
task12details = new Taskdetails(questionselected,"Approval", "Requester Teamowner",newlycreatedtask);

//12th task
newlycreatedtask= withformandwithoutchecklist;
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator("//button[contains(@class, 'absolute bottom')]").click();

newlycreatedtask= generateRandomText(5);
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Completion']/ancestor::span").click();
await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click(); 
await page.locator(`//span[text()="Requester's Team Owner"]/ancestor::div[@role='option']`).click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
questionselected = await randomizedQuestionSelection(page);
await checklist(page);
console.log("questionselected: ",questionselected)
task13details = new Taskdetails(questionselected,"Completion", "Requester Teamowner",newlycreatedtask);
await page.waitForTimeout(5000);

//task 13 left of post intake
newlycreatedtask="Post Intake";
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='left']`).click();

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
task14details = new Taskdetails(questionselected,"Completion", "Selfserve user 2",newlycreatedtask);
await page.waitForTimeout(5000);



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
task15details = new Taskdetails(questionselected, "Completion", "csm" , "Post Intake");



//task 15 right to intake task
await page.waitForTimeout(6000);
phasecreated = await page.locator(`//h1[text()='Intake']`);
await phasecreated.scrollIntoViewIfNeeded();
await phasecreated.hover();

newlycreatedtask="Intake Form";
createdtask = page.locator(`//span[text()='${newlycreatedtask}']`)
await createdtask.scrollIntoViewIfNeeded();
await createdtask.hover();  
await page.locator(`//span[text()='${newlycreatedtask}']/ancestor::div[4]//div[@data-handlepos='right']`).click();


newlycreatedtask= generateRandomText(5);
await page.getByPlaceholder('Enter task name').pressSequentially(newlycreatedtask);
await page.locator("//span[text()='Approval']/ancestor::span").click();

await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click(); 
await page.locator(`//span[text()="Requester's Manager"]/ancestor::div[@role='option']`).click();
await page.waitForTimeout(3000);
await page.locator('//p[text()="Save & Continue"]').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');
questionselected = await randomizedQuestionSelection(page);
await checklist(page);
task16details = new Taskdetails(questionselected,"Approval", "Requester manager",newlycreatedtask);

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
  task9details,
  task10details,
  task11details,
  task12details,
  task13details,
  task14details,
  task15details,
  task16details,
  workflowName
}
// Write the combined object to a JSON file
fs.writeFileSync('data.json', JSON.stringify(Information, null, 2), 'utf-8');

});

