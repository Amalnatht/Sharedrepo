
// Function to update and format the contracted cost with commas
export function updateFormattedCost(data) {
    let num = data;
    let str = num.toString();
    let count = 1;
    let newstr = "";
    for (let i = str.length - 1; i >= 0; i--) {
        newstr += str[i];
        if (count % 3 === 0 && i !== 0) {
            newstr += ",";
        }
        count += 1;
    }
    let formattedCost = newstr.split('').reverse().join('');
    return formattedCost;
}
//formatting date 
  export function format(inputDate) {
    const [day, month, year] = inputDate.split('/').map(Number);
  
    // Create a new Date object
    const date = new Date(year, month - 1, day); // Month is zero-based in JavaScript
  
    // Format the date to 'Dec 11, 2024' format
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  
    return formatter.format(date);
  }
  
//function to generate start and end date
 export function dates() {
   const currentDate = new Date();
   const sixMonthsFromNow = new Date();
   sixMonthsFromNow.setMonth(currentDate.getMonth() + 6);
 
   // Helper function to format a date as "DD/MM/YYYY"
   const formatDate = (date) => {
     const day = String(date.getDate()).padStart(2, '0');
     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
     const year = date.getFullYear();
     return `${day}/${month}/${year}`;
   };
 
   const startDate = formatDate(currentDate);
   const endDate = formatDate(sixMonthsFromNow);
 
   return { startDate, endDate };
 }

 //function to generate cost and FQ
 export function generateCost(minCost, maxCost) {
    // Generate a random contracted cost between minCost and maxCost
    const contractedCost = Math.floor(Math.random() * (maxCost - minCost) + minCost);
  
    // Generate a random firstQuote greater than contractedCost
    const firstQuote = Math.floor(Math.random() * (maxCost - contractedCost) + contractedCost + 1);
  
    return { contractedCost, firstQuote };
  }
