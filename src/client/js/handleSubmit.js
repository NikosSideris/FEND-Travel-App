import moment, { now } from "moment";
import { addD, compD, subD } from "./dateUtils";
async function handleSubmit(event) {

    event.preventDefault()
    let coordinates;
    let userData = readInput();

  if(!isValidUserInput){return;}

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
  }

  async function getGeoLocation(location) {
    const geonamesUrl = 'http://api.geonames.org/';
    const geonamesKey = 'stamay';
    const geonamesQuery = 'searchJSON?formatted=true&q=';
    const endpoint = geonamesUrl + geonamesQuery + location + '&username=' + geonamesKey + '&style=full'; 
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const location = {};
        const jsonRes = await response.json();
        
        location.latitude = jsonRes.geonames[0].lat;
        location.longitude = jsonRes.geonames[0].lng;
        location.countryCode = jsonRes.geonames[0].countryCode;
  
        console.log(location);
        return location;
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async function getWeatherForecast(latitude, longitude) {
    // const darkSkyURL = 'https://api.darksky.net/forecast/';
    // const darkSkyKey = 'a44b6a01155bc9391c311378b6f5bcee';
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
          const jsonRes = await response.json();
          const data=jsonRes.data;
          // console.log(data);
          
          // for (let i = 0; i < data.length; i++) {
          //   const element = data[i];
            
          // }

          return data;
        }
      } catch (error) {
        console.log(error);
      }
    }

  async function getImageURL(city, country) {
    const pixabayURL = 'https://pixabay.com/api/?key=';
    const pixabayKey = '13922659-0b80b0f115dd3a353e0647b73';
    const queryCity = `&q=${city}&image_type=photo&pretty=true&category=places`;
    const queryCountry = `&q=${country}&image_type=photo&pretty=true&category=places`
    
    const cityEndpoint = pixabayURL + pixabayKey + queryCity;
    const countryEndpoint = pixabayURL + pixabayKey + queryCountry;
    try {
      let response = await fetch(cityEndpoint);
      if (response.ok) {
        let jsonRes = await response.json();
        if (jsonRes.totalHits === 0) {
          // If not, display pictures for the country
          response = await fetch(countryEndpoint);
          if (response.ok) {
            jsonRes = await response.json();
            return jsonRes.hits[0].largeImageURL;
          }
        }
        // console.log(jsonRes);
        // console.log(jsonRes.hits[0].largeImageURL);
        return jsonRes.hits[0].largeImageURL;
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
        const jsonRes = await response.json();
        return {
                 name: jsonRes.name,
                 flag: jsonRes.flag
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
  title=element.temp+"<sup>o</sup>"+"C";
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
  partial="Forecast available fron only part of the trip (in red)"
} else {
  partial="";
}
output=durationStr+"\n\n"+outOfRange+"\n\n"+partial;
document.getElementById("results").innerHTML=output;

document.getElementById("results").style.color="#f00";

document.getElementById("results").style.borderWidth="1px";
document.getElementById("results").style.borderRadius="4px";
document.getElementById("results").style.borderStyle="Solid";

}
//*******************************************my */



function isValidUserInput(data){
    //TODO
    return (data.city!=null && data.departure!=null)
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

  function readInput(){
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

function importantDays0(departStr,returnStr){
  const dayms=1000 * 60 * 60 * 24;
  let idays={}
  let current= Date.now();
  let d=new Date(departStr);
  let depart=d.valueOf();
  let r=new Date(returnStr);
  let ret=r.valueOf();
  let limit=current+dayms*15;

  idays.lag=truncate((depart-current)/dayms);
  idays.quant=truncate((limit-depart)/dayms+1);
  if(ret<limit){
    idays.end=truncate((ret-current)/dayms);
  }else{
    idays.end=truncate((limit-current)/dayms);
  }
  idays.start=idays.lag;
  // idays.end=ret/dayms;

  console.log(idays);
  return idays;
}

function importantDays(departStr,returnStr){
  const dayms=1000 * 60 * 60 * 24;

  let idays={}
  let dep=new Date(departStr);
  dep=dep/dayms;
  let ret=new Date(returnStr);
  ret=ret/dayms;
  let current= new Date().getTime();
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