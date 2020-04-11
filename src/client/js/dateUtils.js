//npm install moment --save

import moment, { now } from "moment";

function importantDays(departStr){
    idays={}
    d=new Date(departStr);
    idays.lag=d-moment.calendar;
    idays.limit=moment().add(15, 'days').calendar(); 
    idays.quant=idays.limit-d;
    console.log(idays);
    
    return idays;
}

// function mydates() {
//     const dayms=1000 * 60 * 60 * 24;
// }
// const date1 = new Date('7/13/2010');
// const date2 = new Date('12/15/2010');
// const diffTime = Math.abs(date2 - date1);
// const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
// console.log(diffDays);