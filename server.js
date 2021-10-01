/*
 *
 * Title: raw-node-project
 * Description: A RESTFul API to monitor up or down time of user define links.
 * Author: Sahidul Arif
 * Date: 6/09/21
 *
 */

// Dependencies
const http = require("http");
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// app object - module scaffolding
const app = {};

// Testing file system(CREATE)
  // data.create('test', 'newFile', { name: 'Bangladesh', language: 'Bangla' }, (err)=>{
  //   console.log(err);
  // })

// Testing file system(READ)
  // data.read('test', 'newFile', (err, data)=>{
  //   console.log(err, data);
  // });

// Testing file system(UPDATE)
  // data.update('test', 'newFile', { name: 'Afganistan', language: 'Urdu' }, (err, data) => {
  //   console.log(err);
  // });

// Testing file system(Delete)
  // data.delete('test', 'newFile', (err) => {
  //   console.log(err);
  // });

// configure
app.config = {
  port: 9000,
};

// create server & start the server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`Listening to port ${environment.port}`);
  });
};
app.handleReqRes = handleReqRes;

app.createServer();


