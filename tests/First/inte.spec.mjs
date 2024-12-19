// @ts-check
import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';


test('Integrations', async () => {
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


  //pendo guide
  // Wait for the popup to appear with a timeout
  await page.waitForLoadState('domcontentloaded');
  const pendopopup = await page.locator('//button[@aria-label="Close"]');
  if (await pendopopup.isEnabled({ timeout: 5000 })) {
    await pendopopup.click(); // Click to close the popup
    console.log('Popup closed successfully');
  } else {
    console.log('Popup was not visible');
  }
    
    const settingsbutton = await page.locator('//img[@alt="GearUnfilled"]');
    await settingsbutton.click();

    await page.getByText("Integrations").click();
    await page.getByText("Available").click();
    await page.getByText("Connect Zoom with spendflo.").hover();
    await page.locator("//p[text()='Connect']/ancestor::button").click();

     // Select an iframe using its selector
    const frame = page.frameLocator('iframe#truto-link-iframe');




    await frame.locator("//h6[text()='Spendflo uses Truto to connect your account ']/ancestor::div[1]//button").click();
    await frame.locator("//button[text()='Connect']").click();

    // const [newPage] = await Promise.all([
    //     await context.waitForEvent('page'), // Wait for the new page event
    //     // await frame.locator("//button[text()='Connect']").click(), // Trigger the new window
    //   ]);
  
  const newPage = await context.waitForEvent('page')

  // Ensure the new page has loaded
  await newPage.waitForLoadState();

  await newPage.locator('//input[@name="email"]').pressSequentially(user2email);
  await newPage.locator('//input[@name="password"]').pressSequentially("Test@1233");
  await newPage.locator('//span[text()=" Sign In "]/ancestor::button').click();

  // const newPage1 = await context.waitForEvent('page');

  // Wait for the new page to load
  await newPage.waitForLoadState('domcontentloaded');
  
  // Perform actions if necessary before the page closes
  try {
      const allowButton = newPage.locator('//button[text()="Allow"]');
      await allowButton.waitFor({ state: 'visible' });
      await allowButton.click();
  } catch (error) {
      console.error("Allow button might not have appeared or the page closed too early.");
  }

//   await newPage.locator('//button[text()="Allow"]').click();

  await page.waitForTimeout(30000)
//   await expect(page.locator("body")).toContainText("Zoom is successfully integrated!");


});
