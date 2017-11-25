"use strict";

const http = require("http");
const fauxMo = require("fauxmojs");

const domoticz_ip = "192.168.2.103";
const domoticz_port = 8080;

function getJsonData(url, onSuccess) {
  var options = {
    hostname: domoticz_ip,
    port: domoticz_port,
    path: url,
    method: "GET",
    headers: { "Content-Type": "application/json" }
  };

  var req = http.request(options, function(res) {
    res.setEncoding("utf8");

    var data = "";
    res.on("data", function (chunk) {
      data += chunk;
    });

    res.on("end", function () {
      try {
        if (data) {
          var json = JSON.parse(data);
          onSuccess(json);
        }
      }
      catch (e) {
        console.log("Failed to parse response from: " + url + " \r\nError: " + e.message);
      }
    });
  });
  req.on("error", function(e) {
    console.log("Failed to send request: " + e.message);
  });
  req.end();
}


getJsonData("/json.htm?type=devices&filter=light&used=true&order=Name", response => {
  if (response) {
    response.result.forEach(d => {
      console.log(d.Name);
    });
  }
});



/*
let fauxMo = new fauxMo(
  {
    ipAddress: "192.168.2.103",
    devices: [
      {
        name: "office light",
        port: 11856,
        handler: (action) => {
          console.log("office light action:", action);
        }
      },
      {
        name: "office fan",
        port: 11857,
        handler: (action) => {
          console.log("office fan action:", action);
        }
      }
    ]
  }
);

console.log("started..");

/** */