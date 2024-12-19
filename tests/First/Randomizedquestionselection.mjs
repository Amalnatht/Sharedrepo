import { draganddrop } from "./Draganddrop.mjs";

export async function randomizedQuestionSelection(page){
    //generates a random number between 1 and 10 for the ten question types we can select for workflows
    let randomNumber = Math.floor(Math.random() * 10) + 1;

    let source,target,questionpassed;
    if(randomNumber==1){
        source = await page.locator('//p[text()="Short Text"]/ancestor::div[1]');
        await source.scrollIntoViewIfNeeded();
        target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
        await draganddrop(source,target,page);
        questionpassed="Short text question";
        await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
        await page.locator("//label[@for='Description']/following-sibling::textarea").pressSequentially("Description");
        await page.locator("//label[@for='Response required']//following-sibling::div//button").click();
        await page.locator('(//p[text()="Save"])[2]').click();
        await page.waitForTimeout(3000);
        await page.locator('//p[text()="Save & Continue"]').click();
    }
    if(randomNumber==2){
        source = await page.locator('//p[text()="Long Text"]/ancestor::div[1]');
        await source.scrollIntoViewIfNeeded();
        target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
        await draganddrop(source,target,page);
        questionpassed="Long text question";
        await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
        await page.locator("//label[@for='Description']/following-sibling::textarea").pressSequentially("Description");
        await page.locator("//label[@for='Response required']//following-sibling::div//button").click();
        await page.locator('(//p[text()="Save"])[2]').click();
        await page.waitForTimeout(3000);
        await page.locator('//p[text()="Save & Continue"]').click();
    }
    if(randomNumber==3){
        source = await page.locator('//p[text()="Dropdown"]/ancestor::div[1]');
        await source.scrollIntoViewIfNeeded();
        target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
        await draganddrop(source,target,page);
        questionpassed="Dropdown question";
        await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
        await page.locator("//p[text()='+ Add Option']/ancestor::button").click();
        await page.locator("//label[@for='Add Options']/ancestor::div[1]//input[@step='1']").fill("A");
        await page.keyboard.press('Enter');
        await page.locator("//p[text()='+ Add Option']/ancestor::button").click();
        await page.locator("//label[@for='Add Options']/ancestor::div[1]//input[@step='1']").fill("B");
        await page.keyboard.press('Enter');        
        await page.locator('(//p[text()="Save"])[2]').click();
        await page.waitForTimeout(3000);
        await page.locator('//p[text()="Save & Continue"]').click();

    }
    if(randomNumber==4){
        source = await page.locator('//p[text()="Single Choice"]/ancestor::div[1]');
        await source.scrollIntoViewIfNeeded();
        target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
        await draganddrop(source,target,page);
        questionpassed="Single choice question";
        await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
        await page.locator("//p[text()='+ Add Option']/ancestor::button").click();
        await page.locator("//label[@for='Add Options']/ancestor::div[1]//input[@step='1']").fill("A");
        await page.keyboard.press('Enter');
        await page.locator("//p[text()='+ Add Option']/ancestor::button").click();
        await page.locator("//label[@for='Add Options']/ancestor::div[1]//input[@step='1']").fill("B");
        await page.keyboard.press('Enter');
        await page.locator('(//p[text()="Save"])[2]').click();
        await page.waitForTimeout(3000);
        await page.locator('//p[text()="Save & Continue"]').click();
    }
    if(randomNumber==5){
        source = await page.locator('//p[text()="Multiple Choice"]/ancestor::div[1]');
        await source.scrollIntoViewIfNeeded();
        target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
        await draganddrop(source,target,page);
        questionpassed="Mulitple choice question";
        await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
        await page.locator("//p[text()='+ Add Option']/ancestor::button").click();
        await page.locator("//label[@for='Add Options']/ancestor::div[1]//input[@step='1']").fill("A");
        await page.keyboard.press('Enter');
        await page.locator("//p[text()='+ Add Option']/ancestor::button").click();
        await page.locator("//label[@for='Add Options']/ancestor::div[1]//input[@step='1']").fill("B");
        await page.keyboard.press('Enter');
        await page.locator('(//p[text()="Save"])[2]').click();
        await page.waitForTimeout(3000);
        await page.locator('//p[text()="Save & Continue"]').click();
    }
    if(randomNumber==6){
        source = await page.locator('//p[text()="Number"]/ancestor::div[1]');
        await source.scrollIntoViewIfNeeded();
        target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
        await draganddrop(source,target,page);
        questionpassed="Number question";
        await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
        await page.locator('(//p[text()="Save"])[2]').click();
        await page.waitForTimeout(3000);
        await page.locator('//p[text()="Save & Continue"]').click();
    }
    if(randomNumber==7){
        source = await page.locator('//p[text()="Date"]/ancestor::div[1]');
        await source.scrollIntoViewIfNeeded();
        target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
        await draganddrop(source,target,page);
        questionpassed="Date question";
        await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
        await page.locator('(//p[text()="Save"])[2]').click();
        await page.waitForTimeout(3000);
        await page.locator('//p[text()="Save & Continue"]').click();
    }
    if(randomNumber==8){
        source = await page.locator('//p[text()="Attachment"]/ancestor::div[1]');
        await source.scrollIntoViewIfNeeded();
        target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
        await draganddrop(source,target,page);
        questionpassed="Attachement question";
        await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
        await page.locator("//label[@for='Select the type of attachment']/following-sibling::div//button").click();
        await page.locator("//div[@role='option'][1]").click();
        await page.locator('(//p[text()="Save"])[2]').click();
        await page.waitForTimeout(3000);
        await page.locator('//p[text()="Save & Continue"]').click();

    }
    if(randomNumber==9){
        source = await page.locator('//p[text()="Currency"]/ancestor::div[1]');
        await source.scrollIntoViewIfNeeded();
        target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
        await draganddrop(source,target,page);
        questionpassed="Currency question";
        await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
        await page.locator('(//p[text()="Save"])[2]').click();
        await page.waitForTimeout(3000);
        await page.locator('//p[text()="Save & Continue"]').click();
    }
    if(randomNumber==10){
        source = await page.locator('//p[text()="User Select"]/ancestor::div[1]');
        await source.scrollIntoViewIfNeeded();
        target = await page.locator('//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div');
        await draganddrop(source,target,page);
        questionpassed="Userselect question";
        await page.locator('//input[@name="title"]').pressSequentially(questionpassed);
        await page.locator("//label[text()='Users with role: Admin']").click();
        await page.locator("//label[@for='Response required']//following-sibling::div//button").click();
        await page.locator('(//p[text()="Save"])[2]').click();
        await page.waitForTimeout(3000);
        await page.locator('//p[text()="Save & Continue"]').click();
    }
    return questionpassed;

}

export async function checklist(page){
    await page.getByText('Add Checklist Item').click();
    await page.keyboard.insertText('checklist1');
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);
    await page.locator('//p[text()="Save & Continue"]').click();
    await page.waitForTimeout(5000);
    await page.locator('//p[text()="Save & Continue"]').click();
}

