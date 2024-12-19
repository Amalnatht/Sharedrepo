export async function login(page,expect,email, pwd , usertype){
    await page.goto('https://app.spendflo.com');
    
    const emailfield = page.locator('//input[@name="email"]');
    
    await emailfield.click();
    await emailfield.pressSequentially(email);
    await emailfield.press('Enter');
    
    const pwdfield = page.locator('//input[@name="password"]');
    await pwdfield.click();
    await pwdfield.pressSequentially(pwd);
    
    await page.locator('button:has-text("Sign in")').click();
    await page.waitForLoadState();
    
    await page.waitForTimeout(8000);
    const skipfornowbutton = await page.getByText('Skip for now');
    
    console.log(await skipfornowbutton.count(),"count for skip for now")
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
    await page.waitForTimeout(4000);
    await expect(page).toHaveURL("https://app.spendflo.com/");
    await page.waitForTimeout(5000);
 
  
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



  const rocketlocator = await page.locator('//img[@alt="Rocket"]/ancestor::div[2]/preceding-sibling::div[1]//span');
  if(await rocketlocator.count()>0){

       //check if the org is "test-org"
   await page.waitForTimeout(7000);
   let orgNameLocator = await page.locator('//img[@alt="Rocket"]/ancestor::div[2]/preceding-sibling::div[1]//span');
   await page.waitForTimeout(5000);
   let orgNameNavbar = await orgNameLocator.textContent();
   console.log(orgNameNavbar);
   if(orgNameNavbar=="spendflo"){
     await page.locator("(//span[text()='spendflo'])[1]/ancestor::button").click();
     await page.locator("//input[@name='orgsearch']").fill("test-org");
     await page.locator("//button/p[text()='test-org']").click();
     await page.waitForTimeout(3000);
   }

  // Break if the org is not test-org
  await page.waitForTimeout(9000);
  orgNameLocator = await page.locator('//img[@alt="Rocket"]/ancestor::div[2]/preceding-sibling::div[1]//span');
  orgNameNavbar = await orgNameLocator.textContent();
  if(orgNameNavbar!='test-org'){
    process.exit(0);
  }

  }

}

export async function wfnavigation(page){
const settingsbutton = await page.locator('//img[@alt="GearUnfilled"]');
await settingsbutton.click();
const workflows = await page.getByText('Workflows');
await workflows.click();

}