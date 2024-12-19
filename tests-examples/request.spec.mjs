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
    await pwdfield.click();
    await pwdfield.pressSequentially(pwd);
    
    await page.locator('button:has-text("Sign in")').click()  
    

    const skipfornowbutton = await page.getByText('Skip for now')
    if (await skipfornowbutton.count() > 0) {
      // If the button exists, check if it is enabled and then click it
      if (await skipfornowbutton.isEnabled()) {
        await skipfornowbutton.click();
        console.log('Skip for now button clicked successfully');
      } else {
        console.log('Skip for now button is not enabled');
      }
    } else {
      // If the button does not exist, skip the interaction
      console.log('Skip for now button does not exist. Continuing...');
    }
    await expect(page).toHaveURL("https://app.spendflo.com/");
    await page.waitForTimeout(5000);


  //pendo guide
  // Wait for the popup to appear with a timeout





}

const logout = async(page)=>{
  await page.locator("//img[@alt='UserCircleUnfilled']/ancestor::div[1]").click();    
  await page.getByText("Logout").click();
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
    const user2email =  "selfserve-user2@dev-testing.spendflo.io";
    const csmpwd = "Amalnath123@";
    const user2pwd = "Test@1234";
    
    
    // await page.goto('https://app.spendflo.com');
    
    // const email = page.locator('//input[@name="email"]');
    
    // await email.click();
    // await email.pressSequentially(user2email);
    // await email.press('Enter');
    
    // const pwd = page.locator('//input[@name="password"]');
    // await pwd.click();
    // await pwd.pressSequentially(user2pwd);
    
    // await page.locator('button:has-text("Sign in")').click()  
    
    // const skipfornowbutton = await page.getByText('Skip for now')
    // if(await skipfornowbutton.isEnabled()){
    //   await skipfornowbutton.click();
    // }
    // await expect(page).toHaveURL("https://app.spendflo.com/");

    await login(user2email,user2pwd,"Requester",page);

    await page.locator("(//p[text()='Create a Request'])[1]").click();
    await page.waitForTimeout(10000);
    await page.locator(`//h2[text()='What kind of Request do you want to raise today?']/ancestor::div[1]//span[text()='${data.workflowName}']`).click();
    await page.getByText("Continue").click();
    questionassertion(data.task1details.question,page);
    await page.locator(`//label[@for="${data.task1details.question}"]/following-sibling::div//input`).fill("short text answer");
    await page.locator("//p[text()='Continue']").click();
    await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
    await page.getByText("Submit").click();
    await page.getByText("Go to Request Details").click();
    await page.waitForTimeout(1000);
    const requesturl = await page.url();

    await logout(page);
   


    //csm login
    await login(csmemail,csmpwd,"csm",page);
    await page.waitForTimeout(3000);
    await page.locator("(//span[text()='spendflo'])[1]/ancestor::button").click();
    await page.locator("//input[@name='orgsearch']").fill("test-org");
    await page.locator("//button/p[text()='test-org']").click();
    await page.waitForTimeout(3000);
    if (await page.locator("(//div[@aria-label='Close Stonly widget'])[3]").isVisible({timeout:3000})){
      await page.locator("(//div[@aria-label='Close Stonly widget'])[3]").click();
    }

    await page.goto(requesturl);
    await page.getByText(`Start "${data.task2details.taskname}"`).click();
    questionassertion(data.task2details.question,page);
    await page.locator(`//label[@for="${data.task2details.question}"]/following-sibling::div//input`).fill("Long text answer");
    await page.locator("//nav//p[text()='Checklist']").click();
    await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
    if(data.task2details.typeoftask=="Approval"){
      await page.locator("//p[text()='Approve']/ancestor::button").click();
    }
    else {
      await page.getByText("Submit").click();
    }
    await page.waitForTimeout(1000);


    await page.getByText(`Start "${data.task3details.taskname}"`).click();
    questionassertion(data.task3details.question,page);
    await page.locator(`//label[@for="${data.task3details.question}"]/following-sibling::div//button`).click();
    await page.locator("//div[@role='option'][1]").click();
    await page.locator("//nav//p[text()='Checklist']").click();
    await page.locator('//label[@role="checkbox"][@aria-checked="false"]').click();
    if(data.task2details.typeoftask=="Approval"){
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

    // await logout(page);


    });
