
  const dayms=1000 * 60 * 60 * 24;

function d2m(date){
    let d=new Date(date);
    return d.valueof();
}

function m2d(milis){
    return new Date(milis);
}

function addD(date,number){
    let r=date+number*dayms;
console.log(date,number,r);

    return r ;
}

function subD(thisD,fromD){
    let n1=d2m(thisD);
    let n2=d2m(fromD);
    return (n2-n1)/dayms;
}

function compD(date1, date2) {
    let d1=d2m(date1);
    let d2=d2m(date2);
    if (d1>d2) {
        return 1
    }else if(d1==d2){
        return 0
    }else{
        return -1
    }
        
    }
    


export { d2m,
         m2d,
         addD,
         subD,
         compD
}