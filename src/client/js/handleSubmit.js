async function handleSubmit(event) {

    event.preventDefault()
    let coordinates;
    let userData = readInput();

    // userData.city = getCity();
    // userData.start = getTripStart();
    // userData.end = getTripEnd();
  
    const geoLocation = await getGeoLocation(userData.city);
  
    userData.latitude = geoLocation.latitude;
    userData.longitude = geoLocation.longitude;
    userData.countryCode = geoLocation.countryCode;
  
    userData.weatherForecast = await getWeatherForecast(geoLocation.latitude, geoLocation.longitude);
  console.log(userData.weatherForecast);
  

    const countryInfo = await getCountryInfo(userData.countryCode);
  
    userData.country = countryInfo.name;
    userData.countryFlag = countryInfo.flag;
  
    userData.image = await getImageURL(userData.city, userData.country);
  
    console.log(userData);
  
    // showModal(userData);
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
    const darkSkyURL = 'https://api.darksky.net/forecast/';
    const darkSkyKey = 'a44b6a01155bc9391c311378b6f5bcee';
    const endpoint = darkSkyURL + darkSkyKey + `/${latitude}, ${longitude}`;
    try {
      const response = await fetch('http://localhost:8080/forecast',
        {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: endpoint })
        });
      if (response.ok) {
        const jsonRes = await response.json();
        console.log(jsonRes);
        return jsonRes;
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

//*******************************************my */


    if (isValidUserInput(userData)) {
        console.log("fetching info...");
        postData('/geo',userData.city)
        .then(()=>{
            updateUI();
        })
        // coordinates=await Client.getGeonames(userData.city)
        // .then(()=>{
        //     let weather= getWeatherbit(coordinates)
        //     .then(()=>{
        //         let image= getPixabay(city)
                // .then((coordinates)=>{
                    // updateUi(coordinates, weather, image)
                //     console.log(coordinates);
                    
                //     updateUi(coordinates,0,0)
                // })
        //     })
        // })
        .catch((error)=>{
            //TODO 
            console.log(error);
            ;
            
        })
    }else{
        //TODO HANDLE WRONG INPUT

    }




const updateUI = async () => {
    // console.log("updateUI called");
    const request = await fetch('/all');
    try{
      let allData = await request.json();
        let coordinates=allData[0];
        document.getElementById("results").innerHTML=coordinates;
    }catch(error){
      console.log("error", error);
    }
  }

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
    let country = document.getElementById("country").value;
    let city = document.getElementById("city").value;
    let departure = document.getElementById("departure").value;
    let arrival = document.getElementById("arrival").value;

    let userInput={
        "country": country,
        "city": city,
        "departure": departure,
        "arrival": arrival
    };
    
    return userInput;
}

export { handleSubmit }