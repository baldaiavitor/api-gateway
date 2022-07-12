const settings = require("./settings.json");
const gateway = require("./gateway.config.json");
const express = require("express");
const app = express();

app.use("/:endpoint", (req, res) => {
  var endpoint = req.params.endpoint;
  var method = req.method.toString().toLowerCase();
  var endpointInfo = gateway.endpoints[method][endpoint];
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  if (!endpointInfo) {
    let errorResponse = {
        protocol:req.protocol,
        host:req.get("host"),
        subdomains:req.subdomains,
        endpoint:req.originalUrl,
        MSG:"404 not found"
    }
    res.status(404).send(errorResponse);
    res.end();
    return;
  }

  let response = {
    method: req.method,
    fullUrl: fullUrl,
    endpointName: endpoint,
    endpointInfo: endpointInfo,
  };
  res.send(response);
  res.end();
});

app.use((req, res, next) => {
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  console.log(`API GATEWAY >> NEW REQUEST >> ${fullUrl} ${req.method}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to DJIN Api gateway");
  res.end();
});

// Listening to the port
app.listen(settings.port, () => {
  console.log(`API Gateway listening on port ${settings.port}`);
});
