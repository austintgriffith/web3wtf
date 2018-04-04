const express = require('express');
var proxy = require('express-http-proxy');
const https = require('https');
const path = require('path');
const helmet = require('helmet')
const fs = require('fs')
const app = express();
const port = 80;

var sslOptions = {
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem')
};

const SIMPLEHTML = false;

if(SIMPLEHTML){
  app.use(helmet())
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/build/simple.html'));
  });
  app.listen(80);
  console.log(`webserver listening on 80`);
  https.createServer(sslOptions, app).listen(443)
  console.log(`webserver listening on 443`);
}else{
  app.use(proxy('localhost:8000'));

  https.createServer(sslOptions, app).listen(443)
  console.log(`https webserver listening on 443`)
}
