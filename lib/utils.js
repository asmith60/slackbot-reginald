'use strict';

var AWS = require('aws-sdk');
var Config = require('../lib/config.js');

module.exports = {
    buildFunctions: function(stage, payload) {
        var lambda = new AWS.Lambda();
        var arns = Config.getArns(stage);
        return {
            participation: function(cb) {
                var params = {
                    FunctionName: arns.participation,
                    Payload: payload,
                };
                console.log("Begin participation function");
                lambda.invoke(params, function(error, response) {
                    if (error) {
                        console.error("Error invoking participation function");
                        cb(error);
                        return;
                    }
                    console.log("End participation function");
                    cb(null, response);
                });
            },
            positivity: function(cb) {
                var params = {
                    FunctionName: arns.positivity,
                    Payload: payload,
                };
                console.log("Begin positivity function");
                lambda.invoke(params, function(error, response) {
                    if (error) {
                        console.error("Error invoking positivity function");
                        cb(error);
                        return;
                    }
                    console.log("End positivity function");
                    cb(null, response);
                });
            },
            conceited: function(cb) {
                var params = {
                    FunctionName: arns.conceited,
                    Payload: payload,
                };
                console.log("Begin conceited function");
                lambda.invoke(params, function(error, response) {
                    if (error) {
                        console.error("Error invoking conceited function");
                        cb(error);
                        return;
                    }
                    console.log("End conceited function");
                    cb(null, response);
                });
            }
        };
    },

    getFunctions: function(stage, text, payload) {
        var functions = this.buildFunctions(stage, payload);

        if (!text) {
          return functions;
        }

        var filteredFunctions = {};

        text = text.split(" ").map(function(word) {
            return word.toLowerCase();
        });

        Object.keys(functions).forEach(function(key) {
            key = key.toLowerCase();
            text.forEach(function(word) {
                if (word === key) {
                    filteredFunctions[key] = functions[key];
                }
            });
        });

        if (Object.keys(filteredFunctions).length === 0) {
            filteredFunctions = false;
        }

        return filteredFunctions;
    }
};
