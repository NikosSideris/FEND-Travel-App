import {importantDays,truncate } from "./helpers";
import TimezZ from "timezz";

async function handleSubmit(event) {

	event.preventDefault()
	let coordinates;
	const userData = await readInput();

	// let check=isValidUserInput(userData);
	if (!isValidUserInput(userData)) {
		alert("City, Departure date, Return date are required fields. Either a field is missing or is wrong! ");
		return;
	}

                                
	let impDays = importantDays(userData.departure, userData.arrival);

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
	outputWeather(userData.weatherForecast, impDays);
	outputResults(userData, impDays);

	let display = document.querySelector('#countDown');
	document.querySelector('#countDown').style.color = '#f00';

	let interval;

	// startTimer(impDays.start, display,interval);

	console.log(impDays);

	if (typeof window.timer !== 'undefined') {
		// window.timer.isStopped=true;
		// window.timer=null;
		window.timer.destroy();
		display.innerHTML = "";
	};

	window.timer = new TimezZ(".j-first-timer", {
		date: impDays.timer, //"Dec 02, 2023 00:00:00",
		text: {
			days: "d ",
			hours: "h ",
			minutes: "m"
			// seconds: ":"
		},
		isStopped: false,
		canContinue: false,
		template: "<span>NUMBER</span><b>LETTER</b> ",
		beforeCreate() {
			console.log("timer starting");
		},
	});

	setTimeout(() => {
		// timer.destroy();
	}, 1000);
}


async function getGeoLocation(location) {
	const url = 'http://api.geonames.org/';
	const key = 'kugar';
	const query = 'searchJSON?formatted=true&q=';
	const endpoint = url + query + location + '&username=' + key + '&style=full';
	try {
		const response = await fetch(endpoint);
		if (response.ok) {
			const data = {};
			const jResponse = await response.json();

			data.latitude = jResponse.geonames[0].lat;
			data.longitude = jResponse.geonames[0].lng;
			data.countryCode = jResponse.geonames[0].countryCode;

			console.log(data);
			return data;
		}
	} catch (error) {
		console.log(error);
	}
}

async function getWeatherForecast(latitude, longitude) {
	const url = 'http://api.weatherbit.io/v2.0/forecast/daily ';
	const key = '1f6bca0399b141d4bab99bb6a511d04e';
	const query = "?lat=" + `${latitude}` + "&lon=" + `${longitude}` + "&key=";
	//&lat=38.123&lon=-78.543
	//&key=API_KEY
	// ie https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY
	const endpoint = url + query + key;
	try {
		const response = await fetch(endpoint);
		if (response.ok) {
			const weather = [];
			const jResponse = await response.json();
			const data = jResponse.data;
			return data;
		}
	} catch (error) {
		console.log(error);
	}
}

async function getImageURL(city, country) {
	const pixabayURL = 'https://pixabay.com/api/?key=';
	const pixabayKey = '16011201-a637befdddb2d0b23b6155047';
	const queryCity = `&q=${city}&image_type=photo&pretty=true&category=places`;
	const queryCountry = `&q=${country}&image_type=photo&pretty=true&category=places`

	const qCity = pixabayURL + pixabayKey + queryCity;
	const qCountry = pixabayURL + pixabayKey + queryCountry;
	try {
		let response = await fetch(qCity);
		if (response.ok) {
			let jRes = await response.json();
			if (jRes.totalHits === 0) {
				// if no city imgs, then ask country imgs
				response = await fetch(qCountry);
				if (response.ok) {
					jRes = await response.json();
					return jRes.hits[0].largeImageURL;
				}
			}
			return jRes.hits[0].largeImageURL;
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
			const res = await response.json();
			return {
				name: res.name,
				flag: res.flag
			}
		}
	} catch (error) {
		console.log(error);
	}
}

function outputWeather(weatherData, impDays) {
	let d = new Date();
	let mon = d.getMonth();
	let da = d.getDate();
	const dayms = 1000 * 60 * 60 * 24;
	let element;
	let col;
	let title;
	for (let i = 1; i < 16; i++) {
		element = weatherData[i];
		// date titles
		col = "a" + i;
		d = d.valueOf() + dayms;
		let dd = new Date(d);
		mon = dd.getMonth() + 1;
		da = dd.getDate();
		title = da + "-" + mon;
		document.getElementById(col).innerHTML = title;
		paintWeather(impDays, col, i);

		// temperature
		title = element.temp + " C";
		col = "b" + i;
		document.getElementById(col).innerHTML = title;

		paintWeather(impDays, col, i);

		//icons
		let sr = "/src/client/images/" + element.weather.icon + ".png";
		// let sr = "Client." + element.weather.icon + ".png";
		document.getElementById("c" + i + "img").src = sr;
		paintWeather(impDays, "c" + i, i);

		//description
		document.getElementById("d" + i).innerHTML = element.weather.description;
		paintWeather(impDays, "d" + i, i);
	}

	document.getElementById("gridContainer").style.borderWidth = "1px";
	document.getElementById("gridContainer").style.borderRadius = "4px";
	document.getElementById("gridContainer").style.borderStyle = "Solid";
	// document.getElementById("gridContainer").classList.add("active");
}

function paintWeather(impDays, col, i) {
	// const cond1=(i>=impDays.start && i<=impDays.end);
	// const cond2=(i>=impDays.start && impDays.duration<0 && impDays.start>=1);
	// const cond3=(i==impDays.start && impDays.isRetInvalid);
	const cond1 = (i >= impDays.start && i <= impDays.end);
	const cond2 = (i == impDays.start && impDays.end < impDays.start);
	// const cond2=(i>=impDays.start && impDays.duration<0 && impDays.start>=1);
	// const cond3=(i==impDays.start && impDays.isRetInvalid);
	if (cond1 || cond2) {
		const style = getComputedStyle(document.body);
		const colore = style.getPropertyValue('--main-color');
		const bgcolore = style.getPropertyValue('--main-bg-color');
		document.getElementById(col).style.color = colore;
		document.getElementById(col).style.backgroundColor = bgcolore;
		if (col.search("d") >= 0) {
			document.getElementById(col).style.minHeight = "14px";
		}
	} else {
		document.getElementById(col).style.color = "#000";
		document.getElementById(col).style.backgroundColor = "#fff";
	}
}

function outputPixabay(userData) {
	document.getElementById("pixabayImg").src = userData.image;
	document.getElementById("pixabayImg2").src = userData.countryFlag;
}

function outputCoordinates(userData) {
	document.getElementById("lon").innerHTML = "Longitude: " + userData.longitude;
	document.getElementById("lat").innerHTML = "Latitude: " + userData.latitude;
	document.getElementById("cit").innerHTML = "City: " + userData.city;
	document.getElementById("cou").innerHTML = "Country: " + userData.countryCode;

	// document.getElementById("geonames").style.borderWidth="1px";
	// document.getElementById("geonames").style.borderRadius="4px";
	// document.getElementById("geonames").style.borderStyle="Solid";

}

function outputResults(userData, impDays) {
	let output, durationStr, outOfRange, partial;
	if (!impDays.isRetInvalid) {
		// let duration=impDays.end-impDays.start;
		durationStr = "Trip duration: " + impDays.duration + " day(s)";
	} else {
		durationStr = "Return date earlier than Departure date. Taking into account only the Departure date...";
	}

	if (impDays.isOutOfRange) {
		outOfRange = "No Weather forecast available for the given days. Displaying forecast for the next 15 days";
	} else {
		outOfRange = "";
	}
	if (impDays.isPartial) {
		partial = "Forecast available for only part of the trip (in red)"
	} else {
		partial = "";
	}

	output = durationStr + "\n\n" + outOfRange + "\n\n" + partial;
	if (impDays.start <= 0) {
		output = "Departure date cannot be earlier than tomorrow. Just diplaying the next 15 days forecast..."
	}
	document.getElementById("results").innerHTML = output;

	document.getElementById("results").style.color = "#f00";

	// document.getElementById("results").style.borderWidth="1px";
	// document.getElementById("results").style.borderRadius="4px";
	// document.getElementById("results").style.borderStyle="Solid";

}
//*******************************************my */


function isValidUserInput(data) {
	const res = (data.city != null && data.city != "" && data.departure != null && data.departure != "" && data.arrival != null && data.arrival != "");
	return res;
}

/* Function to POST data */
const postData = async(url, data) => {
	console.log("postData data: ", data);
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'include', //same-origin
		headers: {
			'Content-Type': 'application/json',
		},
		// body: JSON.stringify(data),
		body: {
			"city": data
		},
	});

	try {
		console.log("rrresponse: ", response);
		const newData = await response.json();
		console.log("postData return: ");
		console.log(newData);
		appData = newData;
		return newData;
	} catch (error) {
		console.log("postData error", error);
	}
}

async function readInput() {
	// let country = document.getElementById("country").value;
	let city = document.getElementById("city").value;
	let departure = document.getElementById("departure").value;
	let arrival = document.getElementById("arrival").value;

	let userInput = {
		// "country": country,
		"city": city,
		"departure": departure,
		"arrival": arrival
	};

	return userInput;
}


function importantDays0(departStr, returnStr) {
	const dayms = 1000 * 60 * 60 * 24;

	let idays = {}
	var d = new Date(departStr);
	var y = d.getFullYear();
	var m = d.getMonth() + 1;
	var a = d.getDate();
	let dep = new Date(y + "-" + m + "-" + a);
	dep.setHours(0);
	dep.setMinutes(0);
	dep.setSeconds(0);
	idays.timer = dep;
	dep = dep / dayms;
	let ret = new Date(returnStr);
	ret = ret / dayms;
	d = new Date();
	y = d.getFullYear();
	m = d.getMonth() + 1;
	a = d.getDate();
	let current = new Date(y + "-" + m + "-" + a); //.getTime();
	current = truncate(current / dayms);
	let limit = current + 15;
	idays.limit = limit;
	idays.duration = Math.ceil(ret - dep);
	idays.start = Math.ceil(dep - current);
	idays.end = Math.ceil(ret - current);
	idays.isOutOfRange = (limit < dep) || (idays.start < 1);
	idays.isRetInvalid = ret < dep;
	idays.isPartial = ret > limit && dep <= limit;

	console.log(idays);

	return idays;
}




function repaint(userData) {
	document.getElementById("city").innerHTML = getCookie("city");
	document.getElementById("departure").innerHTML = getCookie("departure");
	document.getElementById("arrival").innerHTML = getCookie("arrival");
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}


function deleteCookie(name) {
	setCookie(name, '', -1);
}

function checkCookie(name) {
	var cookieVale = getCookie(name);
	if (cookieVale != "") {
		return true;
	} else {
		return false;
	}
}

export {
	handleSubmit
}

