export async function phaseCreation(page){
//Creating a Phase
await page.locator("//h1[text()='Completed']").hover();
await page.locator("(//div[@id='2']//button)[1]").click();
let phasenam = generateRandomText(5);
await page.locator("//input[@name='phaseName']").pressSequentially(phasenam);
await page.locator("//p[text()='Create Phase']/ancestor::button").click();
}

export function generateRandomText(length){
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }


  export function generateRandomNumber(till){
    return Math.floor(Math.random() * till) + 1;;
  }