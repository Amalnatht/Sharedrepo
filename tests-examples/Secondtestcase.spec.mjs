// @ts-check 
import { test, expect } from '@playwright/test';
// import { timeout } from '../../playwright.config';
import { chromium } from 'playwright';

// import  { Taskdetails,task1details, task2details,task3details } from '../../tests-examples/wfcreation.spec.mjs';
// import { workflowName } from '../../tests-examples/wfcreation.spec.mjs';

import path from 'path';
import fs from 'fs';

const filePath = path.join(process.cwd(), 'data.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Read the JSON data from the file


const questionassertion =async (questiontype, page)=>{
  if(questiontype=="shorttext"){
    await expect(page.locator("body")).toContainText('short text question');
  }
  else if (questiontype=="Longtext"){
    await expect(page.locator("body")).toContainText("Long text question");
  }
  else if (questiontype=="Dropdown"){
    await expect(page.locator("body")).toContainText("Dropdown question")
  }
}

const login= async (useremail, pwd, usertype, page)=>{
  await page.goto('https://app.spendflo.com');
    
    const emailfield = page.locator('//input[@name="email"]');
    
    await emailfield.click();
    await emailfield.pressSequentially(useremail);
    await emailfield.press('Enter');
    
    const pwdfield = page.locator('//input[@name="password"]');
    await pwd.click();
    await pwd.pressSequentially(pwd);
    
    await page.locator('button:has-text("Sign in")').click()  
    
    const skipfornowbutton = await page.getByText('Skip for now')
    if(await skipfornowbutton.isEnabled()){
      await skipfornowbutton.click();
    }
    await expect(page).toHaveURL("https://app.spendflo.com/");
}

const logout = async(page)=>{
  await page.locator("//img[@alt='UserCircleUnfilled']/ancestor::div[1]").click();
  await page.getByText("Logout").click();
}

test.only('Requestcreation', async () => {
    test.setTimeout(1500000); 
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const csmemail = "amalnath@spendflo.com";
    const user2email =  "selfserve-user2@dev-testing.spendflo.io";
    const csmpwd = "Amalnath123@";
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

    await page.locator("(//p[text()='Create a Request'])[1]").click();
    await page.getByText(workflowName).click();
    await page.getByText("Continue").click();
    questionassertion(task1details.questionname,page);
    await page.locator(`//label[@for="${task1details.questionname}"]/following-sibling::div//input`).fill("short text answer");
    await page.getByText("Continue").click();
    await page.getByRole("checkbox").click();
    await page.getByText("Submit").click();
    await page.getByText("Go to Request Details").click();
    await page.waitForTimeout(1000);
    const requesturl = await page.url();

    logout(page);
   


    //csm login
    login(csmemail,csmpwd,"csm",page);
    await page.waitForTimeout(3000);
    await page.locator("(//span[text()='spendflo'])[1]/ancestor::button").click();
    await page.locator("//input[@name='orgsearch']").fill("test-org");
    await page.locator("//button/p[text()='test-org']").click();
    await page.waitForTimeout(3000);
    if (await page.locator("(//div[@aria-label='Close Stonly widget'])[3]").isVisible({timeout:3000})){
      await page.locator("(//div[@aria-label='Close Stonly widget'])[3]").click();
    }

    await page.goto(requesturl);
    await page.getByText(`Start "${task2details.taskname}"`).click();
    questionassertion(task2details.questionname,page);
    await page.locator(`//label[@for="${task2details.questionname}"]/following-sibling::div//input`).fill("Long text answer");
    await page.locator("//nav//p[text()='Checklist']").click();
    await page.getByRole("checkbox").click();
    if(task2details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await page.waitForTimeout(1000);


    await page.getByText(`Start "${task3details.taskname}"`).click();
    questionassertion(task3details.questionname,page);
    await page.locator(`//label[@for="${task3details.questionname}"]/following-sibling::div//button`).click();
    await page.locator("//div[@role='option'][1]").click();
    await page.locator("//nav//p[text()='Checklist']").click();
    await page.getByRole("checkbox").click();
    if(task2details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await page.waitForTimeout(1000);

    await page.locator("//p[text()='Link Existing Contract']/ancestor::button").click();
    await page.locator("//label[@for='Select contract']//following-sibling::div//input[@placeholder='Search']").waitFor({state:'visible'});
    await page.locator("//label[@for='Select contract']//following-sibling::div//input[@placeholder='Search']").click();
    await page.locator("//label[@for='Select contract']//following-sibling::div//input[@placeholder='Search']").fill("atlassian");
    await page.waitForTimeout(2000);
    await page.locator("(//div[@role='listbox']//button)[1]").click();
    await page.waitForTimeout(2000);
    await page.locator("//p[text()='Add']/ancestor::button").click();
    await page.waitForTimeout(2000);
    await expect(page.locator("body")).toContainText("Contract linked successfully !!");

    await page.waitForTimeout(5000);

    logout(page);





    });
