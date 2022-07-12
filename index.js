const settings = require('./settings.json');
const gateway = require('./gateway.config.json');
const express = require('express');
const app = express();

// route
app.get('/:endpoint', (req,res)=>{
  // Sending This is the home page! in the page
  var endpoint = req.params.endpoint;
  if(!gateway.endpoints[endpoint]){
    res.status(404).send(`/${endpoint} 404`);
    res.end();
    return;
  }

  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let response = {
    fullUrl:fullUrl,
    endpointName:endpoint,
    gatewayConfig:gateway.endpoints[endpoint]
  }
  res.send(response);
  res.end();
});

// Listening to the port
app.listen(settings.port)