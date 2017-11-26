"use strict";

const FauxMo = require("./fixed_modules/fauxmojs");
const Domoticz = require("./modules/domoticz");

// default values which can be overridden by args
const config = {
    host: "localhost", // domoticz host
    port: 8080, // domoticz port
    devices: null,
    devicePort: 11856
}


// override default settings based on given agrs
let args = process.argv.slice(2);
for (let i = 0, arg; arg = args[i]; i++) {
    if (arg[0] == "-" && typeof config[arg.substr(1)] != "undefined") {
        config[arg.substr(1)] = args[++i];
    }
}


let domoticz = new Domoticz({ host: config.host, port: config.port });
domoticz.getDevices(devices => {
    if (devices) {

        let deviceIdxList = config.devices && config.devices.split(",");
        console.log(deviceIdxList);
        if (deviceIdxList && deviceIdxList.length) {
            let fauxmoDevices = devices.filter(d =>
                    deviceIdxList && deviceIdxList.length ? deviceIdxList.indexOf(d.idx) != -1 : true
                )
                .map(d => {
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
            }
        }
        else {
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
}