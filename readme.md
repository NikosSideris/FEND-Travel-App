## Introduction

This project requires building a travel app that, at a minimum, obtains a desired trip location & date from the user, and displays weather and an image of the location using information obtained from external APIs.
The project is the Capstone of the FEND nanodegree of Udacity

## Instructions

1. Download or clone the project:
   git clone https://github.com/saltamay/travel-app.git [folder_name]

2. Install dependencies:  npm install

3. Start the server: npm start

4. Setup the environment development: npm run build-dev
   or production: npm run build-prod

5. You can perform some tests: npm run test

## APIs used

1. Geonames API (http://www.geonames.org/export/web-services.html) 
2. Weatherbit API (https://www.weatherbit.io/)
3. Pixabay API (https://pixabay.com/api/docs/)
4. Restcountries API (https://restcountries.eu/) 

## Additional features implemented from the list of options

1. Add end date and display length of trip. 
2. Pull in an image for the country from Pixabay API when the entered location brings up no results (good for obscure localities).
3. Integrate the REST Countries API to pull in data for the country being visited.(getting the counry flag).
4. Instead of just pulling a single day forecast, pull the forecast for multiple days. (forecast for 15 days)
5. Incorporate icons into forecast.

## Notes on UI

Displaying concurrently 15-day forecasts is not that easy, taking into account the different browsers, devices, screens, etc. The solution of horizontal scrolling was selected as a quick and dirty approach to save time. Of course, many other approaches could be selected.

