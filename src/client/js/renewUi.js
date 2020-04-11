function renewUi(data) {
    //geo coordinates
    document.getElementById("lon").innerHTML="Latitude: ", data.latitude;
    document.getElementById("lon").innerHTML="Longitude: ",data.longitude;

    //pixabay
    let pixabayImg=document.getElementById("pixabayImg");
    pixabayImg.src = data.countryFlag;


}