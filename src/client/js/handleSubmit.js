async function handleSubmit(event) {
    event.preventDefault()

    //get user input
    let city=document.getElementById("city").nodeValue;
    let departure=document.getElementById("departure").nodeValue;
    let arrival=document.getElementById("arrival").nodeValue;
    let data = {
        "city": city,
        "departure": departure,
        "arrival": arrival
    };

    if (isValidUserInput(data)) {
        let coordinates=await getGeonames(city)
        .then(()=>{
            let weather=await getWeatherbit(coordinates)
            .then(()=>{
                let image=await getPixabay(city)
                .then(()=>{
                    updateUi(coordinates, weather, image)
                })
            })
        })
        .catch(()=>{
            //TODO 
        }
        )
    }else{
        //TODO HANDLE WRONG INPUT

    }

}


function isValidUserInput(data){

}

export { handleSubmit }