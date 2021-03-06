async function getGeonames(location) {
    
  const geonamesUrl = 'http://api.geonames.org/';
  const geonamesKey = process.env.GeonamesUserName;
  const geonamesQuery = 'searchJSON?formatted=true&q=';
  const url = geonamesUrl + geonamesQuery + location + '&username=' + geonamesKey + '&style=full';
  return await getGeoLocation(city)
}

  async function getGeoLocation(url) {
 
    try {
      const response = await fetch(url);
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

export { getGeonames }