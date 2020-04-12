import TimezZ from "timezz";

async function handleSubmit(event) {

    event.preventDefault()
    let coordinates;
    const userData = await readInput();

    // let check=isValidUserInput(userData);
  if(!isValidUserInput(userData)){
    // console.log(check);
    
    return;
  }

    let impDays = importantDays(userData.departure, userData.arrival);
    // userData.city = getCity();
    // userData.start = getTripStart();
    // userData.end = getTripEnd();
  
    const geoLocation = await getGeoLocation(userData.city);
  
    userData.latitude = geoLocation.latitude;
    userData.longitude = geoLocation.longitude;
    userData.countryCode = geoLocation.countryCode;
    outputCoordinates(userData);

    userData.weatherForecast = await getWeatherForecast(geoLocation.latitude, geoLocation.longitude);
  console.log(userData.weatherForecast);
  

    const countryInfo = await getCountryInfo(userData.countryCode);
  
    userData.country = countryInfo.name;
    userData.countryFlag = countryInfo.flag;
  
    userData.image = await getImageURL(userData.city, userData.country);
    outputPixabay(userData);
    console.log(userData);
    outputWeather(userData.weatherForecast,impDays);
    outputResults(userData,impDays);

    let display = document.querySelector('#countDown');
    document.querySelector('#countDown').style.color='#f00';

    let interval;
 
    // startTimer(impDays.start, display,interval);

    console.log(impDays);
    
    const timer = new TimezZ(".j-first-timer", {
      date: impDays.timer, //"Dec 02, 2023 00:00:00",
      text: {
        days: " days",
        hours: " hours",
        minutes: " minutes",
        seconds: " seconds"
      },
      isStopped: false,
      canContinue: true,
      template: "<span>NUMBER</span><i>LETTER</i> ",
      beforeCreate() {console.log("timer starting");
      },
    });

    setTimeout(() => {
      timer.destroy();
    }, 100000);
  }



  async function getGeoLocation(location) {
    const url = 'http://api.geonames.org/';
    const key ='kugar';
    const query = 'searchJSON?formatted=true&q=';
    const endpoint = url + query + location + '&username=' + key + '&style=full'; 
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = {};
        const jResponse = await response.json();
        
        data.latitude = jResponse.geonames[0].lat;
        data.longitude = jResponse.geonames[0].lng;
        data.countryCode = jResponse.geonames[0].countryCode;
  
        console.log(data);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async function getWeatherForecast(latitude, longitude) {
    const url = 'http://api.weatherbit.io/v2.0/forecast/daily ';
    const key = '1f6bca0399b141d4bab99bb6a511d04e';
    const query="?lat="+`${latitude}`+"&lon="+ `${longitude}`+"&key=";
    //&lat=38.123&lon=-78.543
    //&key=API_KEY
    // ie https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY
    const endpoint = url + query + key;
    try {
      const response = await fetch(endpoint);
        if (response.ok) {
          const weather = [];
          const jResponse = await response.json();
          const data=jResponse.data;
          return data;
        }
      } catch (error) {
        console.log(error);
      }
    }

  async function getImageURL(city, country) {
    const pixabayURL = 'https://pixabay.com/api/?key=';
    const pixabayKey ='16011201-a637befdddb2d0b23b6155047';
    const queryCity = `&q=${city}&image_type=photo&pretty=true&category=places`;
    const queryCountry = `&q=${country}&image_type=photo&pretty=true&category=places`
    
    const qCity = pixabayURL + pixabayKey + queryCity;
    const qCountry = pixabayURL + pixabayKey + queryCountry;
    try {
      let response = await fetch(qCity);
      if (response.ok) {
        let jRes = await response.json();
        if (jRes.totalHits === 0) {
          // if no city imgs, then ask country imgs
          response = await fetch(qCountry);
          if (response.ok) {
            jRes = await response.json();
            return jRes.hits[0].largeImageURL;
          }
        }
        return jRes.hits[0].largeImageURL;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getCountryInfo(countryCode) {
    const endpoint = `https://restcountries.eu/rest/v2/alpha/${countryCode}`
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const res = await response.json();
        return {
                 name: res.name,
                 flag: res.flag
              }
      }
    } catch (error) {
      console.log(error);
    }
  }

function outputWeather(weatherData,impDays) {
  let d=new Date();
  let mon=d.getMonth();
  let da=d.getDate();
  const dayms=1000 * 60 * 60 * 24;
  let element;
  let col;
  let title;
  var style = getComputedStyle(document.body);
  var colore=style.getPropertyValue('--main-color');
  var bgcolore=style.getPropertyValue('--main-bg-color');
// console.log(style.getPropertyValue('--color-font-general'));
for (let i = 1; i < 16; i++) {
  element = weatherData[i];
  // date titles
  col="a"+i;
  d=d.valueOf()+dayms;
  let dd=new Date(d);
  mon=dd.getMonth()+1;
  da=dd.getDate();
  title=da+"-"+mon;
  document.getElementById(col).innerHTML=title;
  if ((i>=impDays.start && i<=impDays.end)||(i>=impDays.start && impDays.duration<0)) {
    document.getElementById(col).style.color=colore;
    document.getElementById(col).style.backgroundColor=bgcolore;
  }else{
    document.getElementById(col).style.color="#000";
    document.getElementById(col).style.backgroundColor="#fff";
  }
  // console.log(col, title);
  // temp
  title=element.temp+" C";
  col="b"+i;
  document.getElementById(col).innerHTML=title;
  if ((i>=impDays.start && i<=impDays.end)||(i>=impDays.start && impDays.duration<0)) {
    document.getElementById(col).style.color=colore;
    document.getElementById(col).style.backgroundColor=bgcolore;
  }else{
    document.getElementById(col).style.color="#000";
    document.getElementById(col).style.backgroundColor="#fff";
  }
  //icons
  let sr="/src/client/images/"+element.weather.icon+".png";
  document.getElementById("c"+i+"img").src=sr;
  if ((i>=impDays.start && i<=impDays.end)||(i>=impDays.start && impDays.duration<0)) {
    document.getElementById("c"+i).style.color=colore;
    document.getElementById("c"+i).style.backgroundColor=bgcolore;
  }else{
    document.getElementById("c"+i).style.color="#000";
    document.getElementById("c"+i).style.backgroundColor="#fff";
  }
  //description
  document.getElementById("d"+i).innerHTML=element.weather.description;
  if ((i>=impDays.start && i<=impDays.end)||(i>=impDays.start && impDays.duration<0)) {
    document.getElementById("d"+i).style.color=colore;
    document.getElementById("d"+i).style.backgroundColor=bgcolore;
  }else{
    document.getElementById("d"+i).style.color="#000";
    document.getElementById("d"+i).style.backgroundColor="#fff";
  }

}

  document.getElementById("gridContainer").style.borderWidth="1px";
  document.getElementById("gridContainer").style.borderRadius="4px";
  document.getElementById("gridContainer").style.borderStyle="Solid";
  // document.getElementById("gridContainer").classList.add("active");
}

function outputPixabay(userData) {
  document.getElementById("pixabayImg").src=userData.image;
  document.getElementById("pixabayImg2").src=userData.countryFlag;
}
function outputCoordinates(userData) {
  document.getElementById("lon").innerHTML="Longitude: "+userData.longitude;
  document.getElementById("lat").innerHTML="Latitude: "+userData.latitude;
  document.getElementById("cit").innerHTML="City: "+userData.city;
  document.getElementById("cou").innerHTML="Country: "+userData.countryCode;

  // document.getElementById("geonames").style.borderWidth="1px";
  // document.getElementById("geonames").style.borderRadius="4px";
  // document.getElementById("geonames").style.borderStyle="Solid";
  
}
function outputResults(userData,impDays) {
  let output, durationStr, outOfRange, partial;
  if (!impDays.isRetInvalid) {
    // let duration=impDays.end-impDays.start;
    durationStr="Trip duration: "+impDays.duration+" day(s)";
  }else{
    durationStr="Return date earlier than Departure date. Taking into account only the Departure date...";
  }

if (impDays.isOutOfRange) {
   outOfRange="No Weather forecast available for the given days. Displaying forecast for the next 15 days";
}else{
  outOfRange="";
}
if (impDays.isPartial) {
  partial="Forecast available for only part of the trip (in red)"
} else {
  partial="";
}

output=durationStr+"\n\n"+outOfRange+"\n\n"+partial;
if (impDays.start<0){
  output="Departure date cannot be earlier than current date. Just diplaying the next 15 days forecast..."
}
document.getElementById("results").innerHTML=output;

document.getElementById("results").style.color="#f00";

// document.getElementById("results").style.borderWidth="1px";
// document.getElementById("results").style.borderRadius="4px";
// document.getElementById("results").style.borderStyle="Solid";

}
//*******************************************my */



function isValidUserInput(data){
    const res=(data.city!=null && data.city!="" && data.departure!=null && data.departure!="" );
    return res;
}

/* Function to POST data */
const postData = async ( url , data)=>{
    console.log("postData data: ",data);
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include', //same-origin
      headers: {
        'Content-Type': 'application/json',
    },
      // body: JSON.stringify(data),
      body: {"city": data},
    });

      try {
        console.log("rrresponse: ",response);
        const newData = await response.json();
        console.log("postData return: ");
        console.log(newData);
        appData=newData;
        return newData;
      }catch(error) {
        console.log("postData error", error);
      }
  }

  async function readInput(){
    // let country = document.getElementById("country").value;
    let city = document.getElementById("city").value;
    let departure = document.getElementById("departure").value;
    let arrival = document.getElementById("arrival").value;

    let userInput={
        // "country": country,
        "city": city,
        "departure": departure,
        "arrival": arrival
    };
    
    return userInput;
}

function startTimer0(duration, display,interval) {
  duration=duration*60*60*24;
  /* From https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer*/
  var timer = duration, days, hours, minutes, seconds;
  setInterval(function () {
      let d=timer/86400; let dt=truncate(d);
      let h=(d-dt)*24; let ht=truncate(h);
      let m=(h-ht)*60; let mt=truncate(m);
      days=parseInt(dt, 10);
      hours =parseInt(ht, 10);
      minutes = parseInt(mt, 10);
      seconds = parseInt(timer % 60, 10);

      days = days < 10 ? "0" + days : days;
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = days + ":" + hours + ":" + minutes + ":" + seconds;

      if (--timer < 0) {
          timer = duration;
      }
  }, 1000);
}

function startTimer(duration, display,interval) {
  duration=duration*60*60*24;
  /* From https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer*/

  let timer = duration, days;
  clearInterval(interval)
  interval=setInterval(function () {
      // let d=timer/86400; let dt=truncate(d);
      // let h=(d-dt)*24; let ht=truncate(h);
      // let m=(h-ht)*60; let mt=truncate(m);
      days=parseInt(truncate(timer/86400+1), 10);
      // hours =parseInt(ht, 10);
      // minutes = parseInt(mt, 10);
      // seconds = parseInt(timer % 60, 10);

      days = days < 10 ? "0" + days : days;
      // hours = hours < 10 ? "0" + hours : hours;
      // minutes = minutes < 10 ? "0" + minutes : minutes;
      // seconds = seconds < 10 ? "0" + seconds : seconds;

      if(days>0){
      display.textContent = "Departure in "+days + " days";
      }else{
        display.textContent = "";
      }

      if (--timer < 0) {
          timer = duration;
      }
  }, 1000);
  return timer;
}
// window.onload = function () {
//   var fiveMinutes = 60 * 5,
//       display = document.querySelector('#countDown');
//   startTimer(fiveMinutes, display);
// };

function importantDays(departStr,returnStr){
  const dayms=1000 * 60 * 60 * 24;

  let idays={}
  var d = new Date(departStr);
  var y=d.getFullYear();
  var m=d.getMonth()+1;
  var a=d.getDate();
  let dep=new Date(y+"-"+m+"-"+a);
  dep.setHours(0);
  dep.setMinutes(0);
  dep.setSeconds(0);
  idays.timer=dep;
  dep=dep/dayms;
  let ret=new Date(returnStr);
  ret=ret/dayms;
   d = new Date();
   y=d.getFullYear();
   m=d.getMonth()+1;
   a=d.getDate();
  let current= new Date(y+"-"+m+"-"+a); //.getTime();
  current=truncate(current/dayms);
  let limit=current+15;
  idays.limit=limit;
  idays.duration=ret-dep;
  idays.start=dep-current;
  idays.end=ret-current;
  idays.isOutOfRange=limit<dep;
  idays.isRetInvalid=ret<dep;
  idays.isPartial=ret>limit && dep<=limit;

  console.log(idays);
  
  return idays;
}

function truncate(value)
{
    if (value < 0) {
        return Math.ceil(value);
    }

    return Math.floor(value);
}
export { handleSubmit }