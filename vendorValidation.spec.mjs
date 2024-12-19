import { test, expect } from '@playwright/test';
import { login } from './login.mjs';
import {updateFormattedCost} from './formatting.mjs';
import { chromium } from 'playwright';
import fs from 'fs';

test('Vendor Details Validations', async () => {
  test.setTimeout(1500000);
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
      recordVideo: {
        dir: './videos', // Directory where the video will be saved
        size: { width: 1280, height: 720 }, // Optional: specify resolution
      },
    });
  const page = await context.newPage();
  context.setDefaultTimeout(30000);


  // Use a distinct variable name for the login result
  const loginResult = await login(page,expect,"rishi@spendfloone.com","Test@12345");

  // Read data
  const data = JSON.parse(fs.readFileSync('vendorData.json', 'utf-8'));
  const formattedcost = updateFormattedCost(data.contractedCost);


  const vendorName = data.vendorName; // Replace this with a dynamically generated or imported value

  // Navigate to Vendor Management section
  await page.getByText('Vendor Management').click();
  await page.locator("//h5[text()='Vendors']").click();

  // Search for the vendor
  await page.locator('//input[@name="Search"]').pressSequentially(vendorName);
  await page.locator('//input[@name="Search"]').press('Enter');
  await page.waitForTimeout(5000); 

  // **Validate Vendor Agreement Columns**
  const activeAgreementSpend = await page.locator('//tbody/tr[1]//td[5]').textContent();
  const ownerColumn = await page.locator('//tbody/tr[1]//td[3]').textContent();
  const activeAgreementColumn = await page.locator('//tbody/tr[1]//td[10]').textContent();
  const noOfOfferings= await page.locator('//tbody/tr[1]//td[9]').textContent();
  const colTTM= await page.locator("//tbody/tr[1]//td[6]").textContent();

  // Assertions
  expect(activeAgreementSpend.trim()).toBe(formattedcost);
  expect(ownerColumn.trim()).toBe(data.agreementOwner);
  expect(activeAgreementColumn.trim()).toBe('1');
  expect(noOfOfferings.trim()).toBe('1');
  console.log('All vendor column validations passed.');

  // Navigate to the vendor's overview page
  await page.locator('//tr//td[1]').click();
  await page.waitForTimeout(50000); // Adjust timeout as necessary

  // **Vendor Overview Validations
   const overviewAgreementSpend = await page.locator('(//h4[contains(@class,"font-Rubik")]//following-sibling::h1)[4]').textContent();
   const overviewActiveAgreements = await page.locator('(//h4[contains(@class, "font-Rubik")]//following-sibling::h1)[1]').textContent();
   const overviewTTMSpend= await page.locator('(//h4[contains(@class,"font-Rubik")]//following-sibling::h1)[3]').textContent();
   const websiteField = await page.locator('//p[text()="Website"]//following-sibling::p').textContent();
   const ownerField = await page.locator('//p[text()="Owner"]//following-sibling::p').textContent();
//Assertions
  expect(overviewAgreementSpend.trim()).toBe(formattedcost);
  expect(overviewTTMSpend.trim()).toBe(data.amount);
  expect(overviewActiveAgreements.trim()).toBe('01');
  expect(websiteField.trim()).toBe('https://example.com');
  expect(ownerField.trim()).toBe(data.agreementOwner);
  
  console.log("Vendor overview validations are done");

  //Insights-Reports redirection
  const expectedURL="https://app.spendflo.com/reports/vendors";


  //Offerings tab validation
  await page.locator('//p[text()="Offerings"]').click();
  const offeringname= await page.locator('//td[1]').textContent();
  expect(offeringname.trim()).toBe(data.offeringName);
  const offeringCategory= await page.locator('//td[2]').textContent();
  expect(offeringCategory.trim()).toBe('Others');
  
  console.log("Offerings tab is validated.");

  //Agreements tab validation
  await page.locator('//p[text()="Agreements"]').click();
  const agreementTable= await page.locator('//td[1]').textContent();
  const contractOwner= await page.locator('//td[3]').textContent();
  const agreementcost= await page.locator('//td[4]').textContent();
  const agreementType= await page.locator('//td[5]').textContent();
  const agreementCategory= await page.locator('//td[6]').textContent();
  //assertions
  expect(agreementTable.trim()).toBe(data.vendorName);
  expect(contractOwner.trim()).toBe(data.agreementOwner);
  expect(agreementcost.trim()).toBe(formattedcost);
  expect(agreementType.trim()).toBe('Contract');
  expect(agreementCategory.trim()).toBe('Others');
  //insights redirection
  await page.click('//p[text()="Insights"]');
  await expect(page).toHaveURL(expectedURL);
  await page.goBack();

  console.log("Vendor details - Agreements tab is validated.")

  //Validating spend tab
  await page.locator('//p[text()="Spend"]').click();
  const spendData= await page.locator('//td[3]').textContent();
  const TTMSpendGraph= await page.locator('//h4').textContent();
  //assertions
  expect(spendData.trim()).toBe(data.amount);
  expect(TTMSpendGraph.trim()).toBe(data.amount + " USD");
   //insights redirection
   await page.click('//p[text()="Insights"]');
   await expect(page).toHaveURL(expectedURL);
   await page.goBack();

   console.log("Vendor-details : Spend Validated");

   //checking vendor on vendor mapping page
   await page.locator('//img[@src="/assets/gear-unfilled-DPrU36XC.svg"]').click();
   await page.locator('//span[text()="Vendors"]').click();
   await page.locator('//input[@name="Search"]').click();
   await page.locator('//input[@name="Search"]').pressSequentially(data.vendorName);
   await page.waitForTimeout(8000);

  const vendorCell= await page.locator('//td[1]').textContent();
  const status= await page.locator('//td[3]').textContent();
  expect(vendorCell.trim()).toBe(data.vendorName);
  expect(status.trim()).toBe("Unrecognized");
  
   
  //deleting and seeing if vendor still exists
  //console.log("starting poingt")
  await page.locator("//h5[text()='Vendor Management']").click();
  await page.locator("//h5[text()='Agreements']").click();
  await page.waitForTimeout(4000);
  await page.locator('//input[@name="Search"]').pressSequentially(data.vendorName);
  await page.locator('//input[@name="Search"]').press('Enter');
  //console.log("end point");
  await page.waitForTimeout(15000);
  await page.locator('//td[2]').click();
  await page.waitForTimeout(5000);


  //deleting agreement
  await page.locator('//button[@class="outline-none"]').click();
  await page.getByText("Delete").click();
  await page.getByText("Continue").click();
  await page.waitForURL("https://app.spendflo.com/agreements?view=All+Agreements");
  //checking if vendor exists
  await page.locator("//h5[text()='Vendor Management']").click();
  await page.locator("//h5[text()='Vendors']").click();
  await page.locator('//input[@name="Search"]').click();
  await page.locator('//input[@name="Search"]').pressSequentially(vendorName);
  await page.locator('//input[@name="Search"]').press('Enter');
  await page.waitForTimeout(3000); 
  const emptyField= await page.locator("//p[text()='No data to display']").textContent();
  expect(emptyField.trim()).toBe('No data to display');

 console.log("Agreement and vendor have been deleted successfully");

 //going and deleting the transaction csv from connected
 await page.locator('//img[@src="/assets/gear-unfilled-DPrU36XC.svg"]').click();
  await page.locator('//span[text()="Integrations"]').click();
  await page.locator('//h1[text()="Transaction CSV"]').hover();
  await page.locator('(//h1[text()="Transaction CSV"]/ancestor::div[3]//button)[1]').click();
  await page.locator('(//p[text()="Remove Transactions CSV"]/ancestor::div[3]//p)[4]').click();
  await page.waitForTimeout(5000);

});
