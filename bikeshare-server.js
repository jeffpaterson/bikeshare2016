//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=8081; 

//We need a function which handles requests and send response
function handleRequest(request, response){
  console.log("handleRequest begin");
  var req = http.request({
    host: 'www.bayareabikeshare.com',
    //host: 'http://localhost:8081',
    path: '/stations/json' // full URL as path
  }, function (res) {
    console.log("response is back");
      res.on('data', function (data) {
        console.log("data is here");
        response.setHeader('Content-Type', 'application/json');
        response.end(data.toString());
      });
  });    
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});