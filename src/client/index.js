import { handleSubmit }   from './js/handleSubmit'
import { getWeatherbit }   from './js/weatherbit '
import { getGeonames }   from '../server/geonames'
import { getPixabay }   from './js/pixabay'
// import { readInput }   from './js/readInput'

import './styles/resets.scss'
import './styles/base.scss'
import './styles/header.scss'
import './styles/main.scss'
import './styles/form.scss'
import './styles/footer.scss'

// import { socrates } from './images/socrates.jpg';
import socrates  from './images/socrates.jpg';


var homeImg = document.getElementById('socrates');
homeImg.src = socrates;
var homeImg2 = document.getElementById('socrates2');
homeImg2.src = socrates;

export {
    getGeonames,
    getPixabay,
    handleSubmit,
    getWeatherbit,
}