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
    });
}
module.exports = {
    getJsonData: getJsonData
}