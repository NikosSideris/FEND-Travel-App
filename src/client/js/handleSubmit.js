async function handleSubmit(event) {
    event.preventDefault()

    //get user input
    let city=document.getElementById("city").nodeValue;
    let departure=document.getElementById("departure").nodeValue;
    let arrival=document.getElementById("arrival").nodeValue;
    let userData = {
        "city": city,
        "departure": departure,
        "arrival": arrival
    };

    if (isValidUserInput(userData)) {
        let coordinates=await getGeonames(city)
        .then(()=>{
            let weather= getWeatherbit(coordinates)
            .then(()=>{
                let image= getPixabay(city)
                .then(()=>{
                    updateUi(coordinates, weather, image)
                })
            })
        })
        .catch(()=>{
            //TODO 
        })
    }else{
        //TODO HANDLE WRONG INPUT

    }

}

function  updateUi(coordinates, weather, image) {
    //TODO
}

function isValidUserInput(data){
    //TODO
}

export { handleSubmit }