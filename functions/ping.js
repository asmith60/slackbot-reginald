'use strict';

var AWS = require('aws-sdk');
var Async = require('async');
var Config = require('../lib/config.js');
var Utils = require('../lib/utils.js');

module.exports.main = function(event, context, callback) {
    var payload = JSON.stringify({
        test: true
    });

    var functions = Utils.getFunctions(event.stage, null, payload);

    var lambda = new AWS.Lambda();
    functions.gateway = function(cb) {
        var params = {
            FunctionName: Config.getArnString(event.stage) + "gateway",
            Payload: payload,
        };
        console.log("Begin gateway function");
        //Call child function
        lambda.invoke(params, function(error, response) {
            if (error) {
                console.error("Error invoking gateway function");
                cb(error);
                return;
            }
            console.log("End gateway function");
            cb(null, response);
        });
    };

    Async.parallel(functions, function(err, data) {
        if (err) {
            console.error("Error pinging functions");
            return;
        }
        console.log(data);
        callback(null, data);
    });
};
