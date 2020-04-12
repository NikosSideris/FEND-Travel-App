var path = require('path')
const express = require('express')
// const mockAPIResponse = require('./mockAPI.js')
const app = express()
app.use(express.static('dist'))

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
  })
  );
app.use(bodyParser.json())


const buffer=[];

console.log(__dirname)

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
  console.log('Example app listening on port 8081!')
})

app.get('/', function (req, res) {
    res.status(200).sendFile('dist/index.html')
    //     res.sendFile(path.resolve('src/client/views/index.html'))
})

app.get('/all', function (req, res) {
    res.send(buffer)
})

//Geonames
app.post('/geo', (req, res) => {
    res.send("geo")
    // if (req.body !== " ") {
    //   const trip = req.body.trip;
    //   buffer.push(trip);
    //   res.status(201).send(trip);
    // } else {
    //   res.status(400).json('Bad Request');
    // }
  });


//Weather


//Pixabay


// Post Route
app.post("/article", (req, res) => {
  
  textapi.sentiment({
    url: req.body.text, 
    mode: 'document'
  }, 
  function(error, response) {
    res.send(response)
    if (error === null) {
      console.log("server response: ",response);
    }
  });
})