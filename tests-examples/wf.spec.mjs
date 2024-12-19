// @ts-check 
import { test, expect } from '@playwright/test';
import { text } from 'stream/consumers';
// import { timeout } from '../../playwright.config';
import { chromium } from 'playwright';


const draganddrop = async (source,target,page)=>{
await page.waitForTimeout(5000);
let sourceBox = await source.boundingBox();
let targetBox = await target.boundingBox();


if (sourceBox && targetBox) {
  const sourceCenterX = sourceBox.x + sourceBox.width / 2;
  const sourceCenterY = sourceBox.y + sourceBox.height / 2;
  const targetCenterX = targetBox.x + targetBox.width / 2;
  const targetCenterY = targetBox.y + targetBox.height / 2;

  // Move to the source center and start the drag
  await page.mouse.move(sourceCenterX, sourceCenterY);
  await page.mouse.down();

  // Move in steps to simulate the drag smoothly
  const steps = 3;
  for (let i = 1; i <= steps; i++) {
      const x = sourceCenterX + ((targetCenterX - sourceCenterX) / steps) * i;
      const y = sourceCenterY + ((targetCenterY - sourceCenterY) / steps) * i;
      await page.mouse.move(x, y);
      await page.waitForTimeout(50);  // Small delay between steps
  }

  // Release the mouse button at the target location
  await page.mouse.up();
}

else {
  // Log an error or handle the case where boundingBox is null
  console.error('Either the source or target element is not visible or interactable.');
}

await page.waitForTimeout(3000);

}

//random text generator function
const generateRandomText = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

class Taskdetails {
  constructor(questionname , typeoftask, userrole, taskname) {
      this.questionname = questionname;
      this.typeoftask = typeoftask;
      this.userrole = userrole;
      this.taskname = taskname;
  }
}


let task1details;
let task2details;
let task3details;


let workflowName;





test('Login', async () => {
test.setTimeout(1500000);

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

const user1email = "amalnath@spendflo.com";
const user2email =  "selfserve-user2@dev-testing.spendflo.io";
const user1pwd = "Amalnath123@";
const user2pwd = "Test@1234";


await page.goto('https://app.spendflo.com');

const email = page.locator('//input[@name="email"]');

await email.click();
await email.pressSequentially(user2email);
await email.press('Enter');

const pwd = page.locator('//input[@name="password"]');
await pwd.click();
await pwd.pressSequentially(user2pwd);

await page.locator('button:has-text("Sign in")').click()  

const skipfornowbutton = await page.getByText('Skip for now')
if(await skipfornowbutton.isEnabled()){
  await skipfornowbutton.click();
}
await expect(page).toHaveURL("https://app.spendflo.com/");

const settingsbutton = await page.locator('//img[@alt="GearUnfilled"]');
await settingsbutton.click();
const workflows = await page.getByText('Workflows');
await workflows.click();
await page.getByText('+ Add Workflow').click();
await page.getByText('Create a New Workflow').click();
workflowName = generateRandomText(7);
await page.locator('//input[@name="workflowName"]').pressSequentially(workflowName);
await page.getByText('Create Workflow').click();
await page.locator('(//p[text()="Workflow Studio Guide"]/ancestor::div[2]//p)[2]').click();
const intakeform3dots = await page.locator('//span[text()="Intake Form"]/ancestor::div[2]//button')
await intakeform3dots.click();
await page.locator("//button[text()='Edit']").click();
await page.getByText('Save & Continue').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');



let source = page.locator('//p[text()="Short Text"]/ancestor::div[1]');
let target = page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
draganddrop(source,target,page);



await page.locator('//input[@name="title"]').pressSequentially("short text question");
await page.locator('(//p[text()="Save"])[2]').click();
await page.waitForTimeout(3000);
await page.getByText('Save & Continue').click();
await page.getByText('Add Checklist Item').click();
await page.keyboard.insertText('checklist1');
await page.keyboard.press('Enter');
await page.waitForTimeout(1000);
await page.getByText('Save & Continue').click();
task1details = new Taskdetails('shorttext', "completion" , "requester", "Intake Form");

//Creating a Phase
await page.locator("//h1[text()='Completed']").hover();
await page.locator("(//div[@id='2']//button)[1]").click();
await page.locator("//input[@name='phaseName']").pressSequentially(generateRandomText(5));
await page.locator("//p[text()='Create Phase']/ancestor::button").click();

//First task inside the Phase
await page.locator("//p[text()='+ Add Task']/ancestor::button[1]").click();
const task2name = generateRandomText(5);
await page.getByPlaceholder('Enter task name').pressSequentially(task2name);
await page.locator("//span[text()='Approval']/ancestor::span").click();
await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click();
await page.locator("//span[text()='CSM']/ancestor::div[@role='option']").click();
await page.waitForTimeout(3000);
await page.getByText('Save & Continue').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');


source = page.locator('//p[text()="Short Text"]/ancestor::div[1]');
target = page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
draganddrop(source,target,page);

await page.locator('//input[@name="title"]').pressSequentially("Long text question");
await page.locator('(//p[text()="Save"])[2]').click();
await page.waitForTimeout(3000);
await page.getByText('Save & Continue').click();
await page.getByText('Add Checklist Item').click();
await page.keyboard.insertText('checklist1');
await page.keyboard.press("Enter");
await page.waitForTimeout(1000);
await page.getByText('Save & Continue').click();
task2details = new Taskdetails('Longtext', "Approval", "csm",task2name);

const Postintakeform3dots = await page.locator('//span[text()="Post Intake"]/ancestor::div[2]//button')
await Postintakeform3dots.click();
await page.locator("//button[text()='Edit']").click();
await page.locator("//span[text()='Approval']/ancestor::span").click();
await page.locator("//span[text()='Select a Role']/ancestor::span").click();
await page.locator("//label[@for='Role:']/following-sibling::div//button").click();
await page.locator("//span[text()='CSM']/ancestor::div[@role='option']").click();
await page.waitForTimeout(3000);
await page.getByText('Save & Continue').click();
await page.getByText('Add Section').click();
await page.keyboard.press('Enter');


source = page.locator('//p[text()="Dropdown"]/ancestor::div[1]');
target = page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
draganddrop(source,target,page);


await page.locator('//input[@name="title"]').pressSequentially("Dropdown question");
await page.getByText("+ Add Option").click();
await page.keyboard.press('A');
await page.keyboard.press('Enter');
await page.locator('(//p[text()="Save"])[2]').click();
await page.waitForTimeout(3000);
await page.getByText('Save & Continue').click();
await page.getByText('Add Checklist Item').click();
await page.keyboard.insertText('checklist1');
await page.keyboard.press("Enter");
await page.waitForTimeout(1000);
await page.getByText('Save & Continue').click();
task3details = new Taskdetails('Dropdown', "Approval", "csm" , "Post Intake");

await page.getByText("Publish").click();
await page.locator("//textarea").pressSequentially("version1");
await page.locator("(//p[text()='Publish'])[2]").click();

});
export {Taskdetails,task1details,task2details,task3details,workflowName};

