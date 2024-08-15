import request from 'request'; 
var myurl = 'http://localhost:3000';

let data1 = {type : "Player" , username : "Jeff" , password : "Jesusrules"};
let data2 = {username : "Jeff" , stock : "AAPL" , amount : 2};

// request.post({
//     headers: {'content-type': 'application/json'},
//     url:     myurl+'/login',
//     body:    JSON.stringify(data1)        
// }, function(error, response, body){
//     console.log(body);
// });


// request.post({
//     headers: {'content-type': 'application/json'},
//     url:     myurl+'/buy',
//     body:    JSON.stringify(data2)        
// }, function(error, response, body){
//     console.log(body);
// });

// request.post({
//     headers: {'content-type': 'application/json'},
//     url:     myurl+'/sell',
//     body:    JSON.stringify(data2)        
// }, function(error, response, body){
//     console.log(body);
// });


// request.post({
//     headers: {'content-type': 'application/json'},
//     url:     myurl+'/game',
//     body:    JSON.stringify(data3)        
// }, function(error, response, body){
//     console.log(body);
// });


// request.get({
//     headers: {'content-type': 'application/json'},
//     url:     myurl+'/game',
//     body:    JSON.stringify(data3)        
// }, function(error, response, body){
//     console.log(body);
// });

// request.delete({
//     headers: {'content-type': 'application/json'},
//     url:     myurl+'/delete/Libna',
// }, function(error, response, body){
//     console.log(body);
// });
