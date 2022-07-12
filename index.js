const settings = require("./settings.json");
const gateway = require("./gateway.config.json");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
var http = require("http");

const app = express();

app.use(async (req, res, next) => {
  var endpoint = req.url;
  var method = req.method.toString().toLowerCase();
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  var subdomain = req.subdomains.join(".");
  var domain = req.get("host");
  var endpointInfo = gateway.domain[domain]?.endpoints[method][endpoint];

  if (!endpointInfo) {
    let errorResponse = {
      method: method,
      fullUrl: fullUrl,
      domain: domain,
      protocol: req.protocol,
      host: req.get("host"),
      subdomain: subdomain,
      endpoint: req.originalUrl,
      MSG: "404 not found",
      json: `gateway.domain[${domain}]?.endpoints[${method}][${endpoint}]`,
    };
    res.status(404).send(errorResponse);
    res.end();
    next();
    return;
  }

  //   let response = {
  //     method: req.method,
  //     fullUrl: fullUrl,
  //     endpointName: endpoint,
  //     endpointInfo: endpointInfo,
  //   };
  //ignore .type for now
  //next();
  //   return createProxyMiddleware({
  //     target: endpointInfo.to,
  //     pathRewrite: {
  //       [`^/${endpoint}`]: '',
  //     },
  //     followRedirects: false,
  //   })

  var options = {
    hostname: endpointInfo.to,
    method: method.toUpperCase()
  }

  http
    .request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      // Ending the response
      response.on("end", () => {
        res.write(data);
        res.end();
      });
    })
    .on("error", (err) => {
        res.write(err);
        res.end();
    })
    .end();
});

app.use((req, res, next) => {
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  console.log(`API GATEWAY >> NEW REQUEST >> ${fullUrl} ${req.method}`);
  next();
});

// Listening to the port
app.listen(settings.port, () => {
  console.log(`API Gateway listening on port ${settings.port}`);
});
