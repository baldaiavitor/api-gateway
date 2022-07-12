const settings = require("./settings.json");
const gateway = require("./gateway.config.json");
const express = require("express");
const app = express();

app.use("/:endpoint", (req, res) => {
  var endpoint = req.params.endpoint;
  var method = req.method.toString().toLowerCase();
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  var subdomain = req.subdomains.join(".");
  var domain = req.get('host');
  var endpointInfo = gateway.domain[domain]?.endpoints[method][endpoint];

  if (!endpointInfo) {
    let errorResponse = {
        method:method,
        fullUrl:fullUrl,
        domain:domain,
        protocol:req.protocol,
        host:req.get("host"),
        subdomain:subdomain,
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
