import { chromium } from 'playwright';
import {login} from './login.mjs';
import {test,expect} from '@playwright/test';
import { updateFormattedCost ,format,dates,generateCost} from "./formatting.mjs";
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';


//Utility function to generate random text
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
   // creating active contract
   const { startDate, endDate } = dates();
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

    const data = {
      vendorName,
      Vendoremail,
      contractedCost,
      agreementOwner,
      offeringName,
      firstQuote
    };
    fs.writeFileSync('vendorData.json', JSON.stringify(data, null, 2));

    //Agreement details- Validations
   const owner=await page.locator('(//p[text()="Agreement Owner"]/ancestor::div[1]//p)[2]').textContent();
   const autoRenewal= await page.locator('(//p[text()="Auto Renewal"]/ancestor::div[1]//p)[2]').textContent();
   const startdate=await page.locator('(//p[text()="Start Date"]/ancestor::div[1]//p)[2]').textContent();
   const enddate= await page.locator('(//p[text()="End Date"]/ancestor::div[1]//p)[2]').textContent();
   const agreementTerm= await page.locator('(//p[text()="Agreement Term"]/ancestor::div[1]//p)[2]').textContent();
   const firstquote= await page.locator('(//p[text()="First Quote"]/ancestor::div[1]//p)[2]').textContent();
   const totalCost= await page.locator('(//p[text()="Total Cost & Currency"]/ancestor::div[1]//p)[2]').textContent();
   const totalSavings= await page.locator('(//p[text()="Total Savings"]/ancestor::div[1]//p)[2]').textContent();
   const paymentTerms= await page.locator('(//p[text()="Payment Terms"]/ancestor::div[1]//p)[2]').textContent();
   const billingFrequency= await page.locator('(//p[text()="Billing Frequency"]/ancestor::div[1]//p)[2]').textContent();

 
// formatting the data before checking it
const formattedDate_start = format(startDate);
const formatttedDate_end=format(endDate);

   //Agreement- details assertions
   expect(owner.trim()).toBe(data.agreementOwner);
   expect(autoRenewal.trim()).toBe("OFF");
   expect(startdate.trim()).toBe(formattedDate_start);
   expect(enddate.trim()).toBe(formatttedDate_end);
   expect(agreementTerm.trim()).toBe("Contract");
   expect(firstquote.trim()).toBe(`${updateFormattedCost(data.firstQuote)} USD`);
   expect(totalCost.trim()).toBe(`${updateFormattedCost(data.contractedCost)} USD`);
   expect(totalSavings.trim()).toBe(`${updateFormattedCost(data.firstQuote - data.contractedCost)} USD`);
});

// Function to update the Vendor Name column in a CSV file
const updateVendorNameInCSV = async (inputCsvPath, outputCsvPath, vendorName) => {
    const csvData = [];

    return new Promise((resolve, reject) => {
        //  Read the existing CSV file
        fs.createReadStream(inputCsvPath)
            .pipe(csv())
            .on('data', (row) => {
                //  Replace the Vendor Name column with the new vendorName
                if ('Vendor Name' in row) {
                    row['Vendor Name'] = vendorName; 
                } else {
                    reject(new Error("Vendor Name column not found in CSV file"));
                }
                csvData.push(row);
            })
            .on('end', () => {
                // Write the modified data to a new CSV file
                const csvWriter = createObjectCsvWriter({
                    path: outputCsvPath,
                    header: Object.keys(csvData[0]).map((key) => ({ id: key, title: key })),
                });

                csvWriter
                    .writeRecords(csvData)
                    .then(() => resolve())
                    .catch((err) => reject(err));
            })
            .on('error', (err) => reject(err));
    });
};

// Test case to open CSV, update Vendor Name, and upload it
test('Update Vendor Name in transactions CSV and upload', async () => {
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
    const data = JSON.parse(fs.readFileSync('vendorData.json', 'utf-8'));
    const inputCsvPath = path.resolve("C:\\Users\\hudaf\\Downloads\\Playwright\\transactionsAutomation.csv"); 
    const outputCsvPath = path.resolve('updated_transactions.csv'); 

    // Update the Vendor Name in the CSV file
    const vendorName = data.vendorName; 
    await updateVendorNameInCSV(inputCsvPath, outputCsvPath, vendorName);
    console.log('CSV updated successfully with new vendor name.');

    //Navigate to settings and upload the transaction csv
    await page.locator('//img[@src="/assets/gear-unfilled-DPrU36XC.svg"]').click();
    await page.locator('//span[text()="Integrations"]').click();
    await page.locator('//p[text()="Available"]').click();
    await page.locator('//h1[text()="Transaction CSV"]').hover();
    await page.locator('//p[text()="Upload"]').click();
    await page.locator('//p[text()="Continue"]').click();

    const filePath = "C:\\Users\\hudaf\\Downloads\\Playwright\\updated_transactions.csv"; 
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await page.getByText('Continue to Mapping').click();
  await page.locator('(//span[text()="Choose Format"])[1]').click();
  await page.locator('(//span[text()="mm/dd/yyyy"])[1]').click();
  await page.locator('(//span[text()="Choose Format"])[1]').click();
  await page.locator('(//span[text()="mm/dd/yyyy"])[2]').click();
  await page.locator('//span[text()="Choose Format"]').click();
  await page.locator('(//span[text()="mm/dd/yyyy"])[3]').click();
  await page.locator('//p[text()="Continue"]').click();
  await page.locator('//p[text()="Continue to Review"]').click();
  await page.waitForURL('https://app.spendflo.com/settings/transactions');
  await page.reload();
  await page.waitForTimeout(14000);
  const amount= await page.locator('//td[5]').textContent();
  // Read and update vendorData.json with the amount
  const jsonFilePath = path.resolve('vendorData.json');
  let existingData = {};

  if (fs.existsSync(jsonFilePath)) {
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    existingData = JSON.parse(fileContent);
    console.log("this got executed")
  }

  // Add the amount to the JSON object
  existingData.amount = amount;
  console.log(existingData.amount)
  // Write the updated JSON object back to the file
  fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2));
  
  

});
