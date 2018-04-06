#!/usr/bin/env node
"use strict";

const fs = require("fs");
const FauxMo = require("./fixed_modules/fauxmojs");
const Domoticz = require("./modules/domoticz");
const debug = require('debug')('service');

const configFile = "config.json";

// default values which can be overridden by args
const config = {
    host: "localhost", // domoticz host
    port: 8080, // domoticz port
    devices: null,
    devicePort: 11856
}

if (fs.existsSync(configFile)) {
    try {
        var jsonContent = JSON.parse(fs.readFileSync(configFile));
        Object.keys(jsonContent).forEach(name => {
            if (typeof config[name] != "undefined") {
                config[name] = jsonContent[name];
            }
        });
    }
    catch(e) {
        console.error("Failed to parse config file: " + e.message);
        return;
    }
}
else {
    // override default settings based on given agrs
    let args = process.argv.slice(2);
    for (let i = 0, arg; arg = args[i]; i++) {
        if (arg[0] == "-" && typeof config[arg.substr(1)] != "undefined") {
            config[arg.substr(1)] = args[++i];
        }
    }
}

let domoticz = new Domoticz({ host: config.host, port: config.port });
domoticz.getDevices(devices => {
    if (devices) {
        let deviceIdxList = config.devices && config.devices.split(",");
        if (deviceIdxList && deviceIdxList.length) {
            console.log("Enabled devices:");
            let fauxmoDevices = devices.filter(d =>
                    deviceIdxList && deviceIdxList.length ? deviceIdxList.indexOf(d.idx) != -1 : true
                )
                .map(d => {
                    console.log("Id: " + d.idx + "\t  " + d.Name);
                    return {
                        name: d.Name,
                        port: config.devicePort++,
                        handler: (action) => {
                            action == "on" ? domoticz.switchOn(d.idx) : domoticz.switchOff(d.idx);
                        }
                    }
                });

            if (fauxmoDevices.length) {
                let fauxMo = new FauxMo(
                    {
                        ipAddress: config.host,
                        devices: fauxmoDevices
                    }
                );
                console.log("Listening...");
            }
        }
        else {
            console.log("Available devices:");
            printDevices(devices);
        }
    }
    else {
        console.log("Devices not found");
    }
}, "light");

function printDevices(devices) {
    devices.forEach(device => {
        console.log("Id: " + device.idx + "\t  " + device.Name);
    });
    console.log("Use -devices param to pass comma separated list of device ids");
}

