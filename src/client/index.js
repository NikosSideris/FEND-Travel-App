import { handleSubmit }   from './js/handleSubmit'
import { getWeatherbit }   from './js/weatherbit '
import { getGeonames }   from '../server/geonames'
import { getPixabay }   from './js/pixabay'
import { clearUi }   from './js/clearUi'
import { TimezZ } from "timezz";
// import { readInput }   from './js/readInput'

import './styles/resets.scss'
import './styles/base.scss'
import './styles/header.scss'
import './styles/main.scss'
import './styles/form.scss'
import './styles/footer.scss'
import './styles/weather.scss'
import './styles/pixabay.scss'

import placeholdericon  from './images/placeholdericon.png';

for (let i = 1; i < 16; i++) {
    document.getElementById("c"+i+"img").src=placeholdericon;
    // insertAdjacentHTML="&lt;img src=placeholdericon &gt;";
}

// var homeImg = document.getElementById('socrates');
    // const element = array[i];
// homeImg.src = socrates;


export {
    getGeonames,
    getPixabay,
    handleSubmit,
    getWeatherbit,
    clearUi,
    TimezZ
}