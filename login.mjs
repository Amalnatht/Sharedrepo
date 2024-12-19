

export async function login(page,expect,email,password) {
    // const browser = await chromium.launch({ headless: false });
    // const context = await browser.newContext({
    //     recordVideo: {
    //       dir: './videos', // Directory where the video will be saved
    //       size: { width: 1280, height: 720 }, // Optional: specify resolution
    //     },
    //   });
    // const page = await context.newPage();
    // Navigate to the login page
    await page.goto('https://app.spendflo.com');

    // Fill in email and password
    const emailInput = page.locator('//input[@name="email"]');
    await emailInput.click();
    await emailInput.type(email, { delay: 50 }); // Typing with a delay for realism
    await emailInput.press('Enter');

    const passwordInput = page.locator('//input[@name="password"]');
    await passwordInput.click();
    await passwordInput.type(password, { delay: 50 });
    await page.locator('button:has-text("Sign in")').click();

    // Handle "Skip for now" button
    await page.waitForTimeout(4000);
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

    await expect(page).toHaveURL("https://app.spendflo.com/");
    await page.waitForTimeout(5000);

    // Assert successful login
    await page.waitForURL("https://app.spendflo.com/", { timeout: 30000 });

    // Step 2: Handle Pendo popup
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(7000); // Wait for Pendo popup to load

    const pendoPopup = page.locator('//div[@id="pendo-base"]//button[@aria-label="Close"]');
    if (await pendoPopup.count() > 0 && await pendoPopup.isEnabled()) {
        console.log("The Pendo popup exists and is enabled and click action is done.");
        await pendoPopup.click();
    } else {
        console.log("The Pendo popup does not exist or is not enabled.");
    }
}
