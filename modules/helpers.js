"use strict";

var request = require('request');

function getJsonData(url, callback) {
    request(url, function (error, response, body) {
        if (error) {
            throw "Failed to get response from: " + url + "\t" + error;
        }

        if (response.statusCode == 200) {
            if (callback && body) {
                let json = {};

                try {
                    json = JSON.parse(body);
                }
                catch (e) {
                    throw "Failed to parse response from: " + url + " \r\nError: " + e.message;
                }

                callback(json);
            }
        }
        else {
            console.log("[getJsonData] " + url);
            console.log("[getJsonData] Response: " + response.statusCode + " " + response.statusMessage);
        }
    });
}
module.exports = {
    getJsonData: getJsonData
}
