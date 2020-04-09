async function getWeatherbit(coordinates) {



    return await getweather(city)
}

  async function getweather(coordinates) {
    // const url = geonamesUrl + geonamesQuery + location + '&username=' + geonamesKey + '&style=full'; 
    // try {
    //   const response = await fetch(url);
    //   if (response.ok) {
    //     const location = {};
    //     const jsonRes = await response.json();
        
    //     location.latitude = jsonRes.geonames[0].lat;
    //     location.longitude = jsonRes.geonames[0].lng;
    //     location.countryCode = jsonRes.geonames[0].countryCode;
  
    //     console.log(location);
    //     return location;
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
}

export { getWeatherbit }