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

export function formattedDate(){
      // Fetch the current date
      const currentDate = new Date();

      // Format the date as mm/dd/yyyy
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(currentDate.getDate()).padStart(2, '0');
      const year = currentDate.getFullYear();
  
      const formattedDate = `${month}/${day}/${year}`;
      return formattedDate;
}