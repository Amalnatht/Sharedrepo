let num = 99999123253486
let str = num.toString()
let count = 1
let newstr="";
for(let i =str.length-1;i>=0;i-- ){
    newstr+=str[i];

    if(count<=3 &&count%3==0 && i!=0){
        newstr+=","
    }
    elif(count%2==0 && i!=0){
        newstr+=","
    }
    count +=1
}
let final = newstr.split('').reverse().join('') ;
console.log(final);