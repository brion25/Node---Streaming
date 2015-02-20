/**
 * Here Node will create 3 Servers, 2 of them will redirect you to one common server
 * @author JC Gomez
 * @requires module:http
 */

var http = require('http');

 /**
  * Create a new Server using Pipes. It will run on port 8080
  */
 http.createServer(function(request, response) {
   var options = {
       port : 9000,
       host : 'localhost',
       method : 'GET',
       path : '/'
   }
   var proxy = http.request(options);
   proxy.on('response', function (proxyResponse) {
     proxyResponse.pipe(response);
   });
   request.pipe(proxy);
 }).listen(8080,function(){
     console.log("Pipe Server successfully running on PORT 8080");
 });
 
 
 /**
  * Create a New Server using Event Emitter. It will run on port 9090
  */
 http.createServer(function(request, response) {
   var options = {
       port : 9000,
       host : 'localhost',
       method : 'GET',
       path : '/'
   }
   var proxy = http.request(options);
   proxy.on('response', function (proxyResponse) {
     proxyResponse.on('data',function(chunk){
         response.write(chunk,'binary');
     });
     proxyResponse.on('end',function(){
         response.end();
     });
     response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
   });
   request.on('data',function(chunk){
       proxy.write(chunk,'binary');
   });
    request.on('end',function(){
        proxy.end();
    });
}).listen(9090,function(){
     console.log("Event Server successfully running on PORT 9090");
 });


 /**
  * Server where each server previously created will point
  */
 http.createServer(function (req, res) {
   res.writeHead(200, { 'Content-Type': 'text/plain' });
   res.write('request successfully redirected to port 9000!' + '\n' + JSON.stringify(req.headers));
   res.end();
 }).listen(9000,function(){
     console.log("Server to redirect successfully running on PORT 9000");
 });