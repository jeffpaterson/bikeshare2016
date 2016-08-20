var http = require("http");
var express = require('express');
var app = express();
app.set('view engine', 'jade');
app.use(express.static('public'));

// const requestHandler = (request, response) => {  
//   console.log(request.url);
//   var sendJSON = (json) => {
//     response.setHeader('Content-Type', 'application/json');
//     response.end(json);
//   }
//   getBikeShareInfo(sendJSON);
// }

app.get('/', function(req, res) {
    res.sendFile('index.html')
});


app.get('/json', function(request, response) {
  console.log(request.url);
  var sendJSON = (json) => {
    response.setHeader('Content-Type', 'application/json');
    response.end(json);
  }
  getBikeShareInfo(sendJSON);
});

// const server = http.createServer(requestHandler);

function getBikeShareInfo(callback) {

    return http.get({
        host: 'www.bayareabikeshare.com',
        path: '/stations/json',
        headers: {
        'Content-Type': 'application/json'
        }
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            callback(body);
        });
    });
  }

var server = app.listen(8081);