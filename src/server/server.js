var path = require('path')
const express = require('express')

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

app.listen(8081, function () {
  console.log('Example app listening on port 8081!')
})

app.get('/', function (req, res) {
    res.status(200).sendFile('dist/index.html')
})

app.get('/all', function (req, res) {
    res.send(buffer)
})

//Geonames
app.post('/geo', (req, res) => {
    res.send("geo")
  });


module.exports = app;