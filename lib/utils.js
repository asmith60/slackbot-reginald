'use strict';

var AWS = require('aws-sdk');
var Slack = require('slack-node');
var Config = require('../lib/config.js');

module.exports = {
    //Return an object with all of the child functions
    buildFunctions: function(stage, payload) {
        var lambda = new AWS.Lambda();
        //Get ARNs from config
        var arns = Config.getArns(stage);
        return {
            participation: function(cb) {
                var params = {
                    FunctionName: arns.participation,
                    Payload: payload,
                };
                console.log("Begin participation function");
                //Call child function
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
                //Call child function
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
            negativity: function(cb) {
                var params = {
                    FunctionName: arns.negativity,
                    Payload: payload,
                };
                //Call child function
                console.log("Begin negativity function");
                lambda.invoke(params, function(error, response) {
                    if (error) {
                        console.error("Error invoking negativity function");
                        cb(error);
                        return;
                    }
                    console.log("End negativity function");
                    cb(null, response);
                });
            },
            conceit: function(cb) {
                var params = {
                    FunctionName: arns.conceit,
                    Payload: payload,
                };
                console.log("Begin conceit function");
                //Call child function
                lambda.invoke(params, function(error, response) {
                    if (error) {
                        console.error("Error invoking conceit function");
                        cb(error);
                        return;
                    }
                    console.log("End conceit function");
                    cb(null, response);
                });
            }
        };
    },

    //Determine which functions to call based on text from chat
    getFunctions: function(stage, text, payload) {
        //Get all child functions
        var functions = this.buildFunctions(stage, payload);

        //If there is no text, return all functions
        if (!text) {
            return functions;
        }

        var filteredFunctions = {};

        //Tokenize text
        text = text.split(" ").map(function(word) {
            return word.toLowerCase();
        });

        //If the text contains the function name, add function to list
        Object.keys(functions).forEach(function(key) {
            key = key.toLowerCase();
            text.forEach(function(word) {
                if (word === key) {
                    filteredFunctions[key] = functions[key];
                }
            });
        });

        //If no text matched, return false
        if (Object.keys(filteredFunctions).length === 0) {
            filteredFunctions = functions;
        }

        return filteredFunctions;
    },

    sendWebhook: function(url, message) {
        var slack = new Slack();
        slack.setWebhook(url);
        slack.webhook(message, function(err, response) {
            if(err) {
              console.error("Error invoking Slack API webhook");
              console.error(err);
              return;
            }

            console.log("Successfully replied to webhook");
            return;
        });
    }
};
