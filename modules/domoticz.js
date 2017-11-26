"use strict";

const getJsonData = require("./helpers").getJsonData;

class Domoticz {
    constructor(config) {
        this.config = {
            protocol: "http",
            host: "localhost",
            port: 8080
        }

        Object.keys(config).forEach(name => {
            if (this.config[name]) {
                this.config[name] = config[name];
            }
        });

        this.baseUrl = this.config.protocol + "://" + this.config.host + ":" + this.config.port;
    }

    getDevices(callback, filter = "all") {
        getJsonData(
            this.baseUrl + "/json.htm?type=devices&filter=" + filter + "&used=true&order=Name",
            response => {
                if (response && response.result) {
                    callback(response.result);
                }
            }
        );
    }

    switchOn(idx) {
        getJsonData(this.baseUrl + "/json.htm?type=command&param=switchlight&idx=" + idx + "&switchcmd=On");
    }

    switchOff(idx) {
        getJsonData(this.baseUrl + "/json.htm?type=command&param=switchlight&idx=" + idx + "&switchcmd=Off");
    }
}

module.exports = Domoticz;