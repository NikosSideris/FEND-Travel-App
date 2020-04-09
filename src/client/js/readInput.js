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