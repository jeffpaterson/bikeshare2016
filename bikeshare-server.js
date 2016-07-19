
const http = require('http')  
const express = require('express') 
const request = require('request-promise') 
const port = 8081

const requestHandler = (request, response) => {  
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

var options = {
    uri: 'http://www.bayareabikeshare.com/stations/json',
  
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response 
};

console.log(options);

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

// reference -- https://gist.github.com/diorahman/1520485