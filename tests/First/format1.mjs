let num = 123456
let str = num.toString()
let count = 1
let newstr="";
for(let i =str.length-1;i>=0;i-- ){
    newstr+=str[i];
        if(count%3==0 && i!=0){
            newstr+=","
        }

    count +=1
}
let final = newstr.split('').reverse().join('') ;
console.log(final);