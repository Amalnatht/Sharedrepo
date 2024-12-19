import { chromium } from 'playwright';
import {login} from './login.mjs';
import {test,expect} from '@playwright/test';
import { updateFormattedCost ,dates, generateCost} from "./formatting.mjs";
import fs from 'fs';

// Utility function to generate random text
const generateRandomText = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

test("Contract creation- Non-SaaS",async () => {
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

    const loginResult = await login(page,expect,"rishi@spendfloone.com","Test@12345");

    // Step 2: Navigate to Vendor Management -> Agreements

  await page.getByText('Vendor Management').click();
  await page.locator("//h5[text()='Agreements']").click();
    await page.locator("//p[text()='+ Add Agreement']").click();

    //selecting non-saas contract creation manually
  await page.locator("//span[text()='Others']").click();
    await page.getByText('Add agreement manually').click();
    //await page.waitForTimeout(2000);

    // Step 4: Add Vendor Details
    const vendorName = generateRandomText(8); // Generate a random vendor name
    await page.locator("//input[@name='Vendor Name']").fill(vendorName);
    await page.locator('//button//span//p').click(); // Wait for dropdown and click "Add Vendor"
    //await page.waitForTimeout(2000);
    //await page.locator('//input[@name="vendorName"]').fill(vendorName); // Fill vendor name in slider
    const Vendoremail="https://example.com";
    await page.locator("//input[@placeholder='Enter URL']").fill(Vendoremail); // Fill vendor website
    await page.getByText("Add Vendor").click(); 
    await page.waitForTimeout(3000);
    await page.locator('//p[text()="Save & Continue"]').click();
   

    // Step 5: Fill Agreement Details
    //creating active contract
    const {startDate,endDate}= dates();
    await page.locator('//input[@id="startDate"]').fill(startDate); 
    await page.locator('//input[@id="endDate"]').fill(endDate); 

   //generating cost and FQ
    const { contractedCost, firstQuote } = generateCost(5000, 70000);
    
      await page.locator('//input[@name="cost"]').fill(contractedCost.toString()); // Contracted Value
      await page.locator('//input[@name="firstQuote"]').fill(firstQuote.toString()); // First Quote
      
      console.log(`Contracted Cost: ${contractedCost}, First Quote: ${firstQuote}`);
      
    // Handle Payment Terms dropdown
await page.locator('(//button[@aria-haspopup="listbox"])[3]').click(); // Open Payment Terms dropdown
await page.locator('//span[text()="Net 30"]').click(); // Select "Net 30"

// Handle Billing Frequency dropdown
await page.locator('(//button[@aria-haspopup="listbox"])[4]').click(); // Open Billing Frequency dropdown
await page.locator('//span[text()="Monthly"]').click(); // Select "Monthly"
await page.locator('//input[@name="Agreement Owner"]').pressSequentially('Huda');
const agreementOwner='Huda One';
await page.locator('//span[text()="Huda One"]').click();
  
 
//add line item
    await page.locator('//p[text()="+ Add Line Item"]').click();

    const offeringName = generateRandomText(5); // Random offering name
    await page.locator('//input[@name="Offering Name"]').fill(offeringName);
    await page.locator('//button//span//p').click();
    await page.locator('//p[text()="Add Offering"]').click();
    await page.locator('//input[@name="numberOfUnits"]').fill('10'); //number of units
    await page.locator('(//input[@name="cost"])[2]').fill('100'); // Cost Per Unit
    await page.locator('(//button[@aria-haspopup="listbox"])[6]').click(); //unit of measure
    await page.locator('//span[text()="Ea"]').click();  // Unit of Measure
    await page.locator('//p[text()="Save & Continue"]').click();
    await page.locator('//p[text()="Continue to view Agreement"]').click();

    // const dataToSave = {
    //   vendorName,
    //   Vendoremail,
    //   contractedCost,
    //   agreementOwner,
    //   offeringName,
    //   firstQuote
    // };
    // fs.writeFileSync('vendorData.json', JSON.stringify(dataToSave, null, 2));


  console.log('All validations passed!');
});

test.describe.parallel('Parallel Test Group', () => {
test("Contract creation- SaaS",async () => {
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

    const loginResult = await login(page,expect,"rishi@spendfloone.com","Test@12345");

    // Step 2: Navigate to Vendor Management -> Agreements

  await page.getByText('Vendor Management').click();
  await page.locator("//h5[text()='Agreements']").click();
    await page.locator("//p[text()='+ Add Agreement']").click();


    //uploading doc for contract creation
  const filePath = "C:\\Users\\hudaf\\Downloads\\Playwright\\Contract.pdf"; 
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await page.getByText('Continue').click();
  await page.waitForURL('https://app.spendflo.com/create/product-and-vendor-v2');

    // Step 4: Add Vendor Details
    const vendorName = generateRandomText(8); // Generate a random vendor name
    await page.locator("//input[@name='Vendor Name']").fill(vendorName);
    await page.locator('//button//span//p').click(); // Wait for dropdown and click "Add Vendor"
    const Vendoremail="https://example.com";
    await page.locator("//input[@placeholder='Enter URL']").fill(Vendoremail); // Fill vendor website
    await page.getByText("Add Vendor").click(); 
    await page.waitForTimeout(3000);
    await page.locator('//p[text()="Save & Continue"]').click();


    // Step 5: Fill Agreement Details
    //creating active contract
    const { startDate, endDate } = dates();
    await page.locator('//input[@id="startDate"]').fill(startDate); 
    await page.locator('//input[@id="endDate"]').fill(endDate); 

    //generate cost and FQ
    const { contractedCost, firstQuote } = generateCost(5000, 70000);
    
      await page.locator('//input[@name="cost"]').fill(contractedCost.toString()); // Contracted Value
      await page.locator('//input[@name="firstQuote"]').fill(firstQuote.toString()); // First Quote
      
      console.log(`Contracted Cost: ${contractedCost}, First Quote: ${firstQuote}`);
      
    // Handle Payment Terms dropdown
await page.locator('(//button[@aria-haspopup="listbox"])[3]').click(); // Open Payment Terms dropdown
await page.locator('//span[text()="Net 30"]').click(); // Select "Net 30"

// Handle Billing Frequency dropdown
await page.locator('(//button[@aria-haspopup="listbox"])[4]').click(); // Open Billing Frequency dropdown
await page.locator('//span[text()="Monthly"]').click(); // Select "Monthly"
await page.locator('//input[@name="Agreement Owner"]').pressSequentially('Huda');
const agreementOwner='Huda One';
await page.locator('//span[text()="Huda One"]').click();
  
 
//add line item
    await page.locator('//p[text()="+ Add Line Item"]').click();
    await page.locator('(//button[@aria-haspopup="listbox"])[6]').click();
    await page.locator('//span[text()="License Info"]').click();
    const offeringName = generateRandomText(5); // Random offering name
    await page.locator('//input[@name="Offering Name"]').fill(offeringName);
    await page.locator('//button//span//p').click();
    await page.locator('//p[text()="Add Offering"]').click();
    await page.locator('//input[@name="plan"]').pressSequentially("Automation SaaS Contract");
    await page.locator('(//button[@aria-haspopup="listbox"])[7]').click();
    await page.locator('//span[text()="User-based: Per Seat"]').click();
    await page.locator('//span[@role="checkbox"]').click();
    await page.locator('//input[@name="numberOfUnits"]').fill("10");
    await page.locator('(//input[@name="cost"])[2]').fill("1000");
    await page.locator('(//button[@aria-haspopup="listbox"])[8]').click();
    await page.locator('//span[text()="User"]').click();
    await page.locator('(//button[@aria-haspopup="listbox"])[9]').click();
    await page.locator('//span[text()="Per Month"]').click();
    await page.locator('//p[text()="Save & Continue"]').click();
    await page.locator('//p[text()="Continue to view Agreement"]').click();
});


})