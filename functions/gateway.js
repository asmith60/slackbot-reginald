'use strict';

//Import
var AWS = require('aws-sdk');
var Slack = require('slack-node');
var Async = require('async');
var Config = require('../lib/config.js');
var Utils = require('../lib/utils.js');

module.exports.main = function(event, context, callback) {
    //If request is a test, return success
    if (event.test) {
        callback(null, {
            test: "success"
        });
        return;
    }
    console.log("Begin gateway function");
    //Validate verifiction token
    if (!event.body.token || event.body.token !== Config.verifyToken) {
        console.error("Verification token mismatch! This request did not come from Slack");
        callback(null, Config.errorMessage);
        return;
    }

    //Validate that the request came from a public channel
    if (!event.body.channel_name || event.body.channel_name === 'directmessage') {
        console.error("Requests must come from a public channel");
        callback(null, {
            text: "I cannot analyze chat behavior in direct messages!"
        });
        return;
    }

    //Validate channel ID exists
    if (!event.body.channel_id) {
        console.error("Could not retrieve channel id from event");
        callback(null, Config.errorMessage);
        return;
    }

    //Validate user ID exists
    if (!event.body.user_id) {
        console.error("Could not retrieve user id from event");
        callback(null, Config.errorMessage);
        return;
    }

    //If first arguemnt is help, then respond with help message
    if (event.body.text.split(" ")[0] === "help") {
        console.log("Responding with \"help\" output");
        callback(null, Config.helpMessage);
        return;
    }

    //Get Oauth info, then invoke channel history
    Async.waterfall([
            function(cb) {
                var dynamodb = new AWS.DynamoDB();
                var params = {
                    TableName: Config.teamsTableName,
                    Key: {
                        teamId: {
                            S: event.body.team_id
                        }
                    }
                };
                //Call Slack API to get history
                dynamodb.getItem(params, function(err, data) {
                    if (err) {
                        console.error(err);
                        cb("Error retrieving Oauth info");
                        return;
                    }
                    cb(null, data.Item.accessToken.S);
                });
            },
            function(token, cb) {
                //Set token to development token if it exists
                if (Config.devToken) {
                    token = Config.devToken;
                }

                //Validate that there is a token
                if (!token) {
                    cb("Error token not found");
                    return;
                }

                //Get Slack channel history, then call child functions


                //Construct slack API object with Oauth token
                var slack = new Slack(token);

                //Build params
                var params = {
                    channel: event.body.channel_id,
                    count: 1000
                };

                //Call Slack API to get history
                slack.api(Config.channelHistoryEndpoint, params, function(err, response) {
                    if (err) {
                        console.error("Error calling Slack API for channel history");
                        cb(err);
                        return;
                    }
                    if (response.ok !== true) {
                        console.error("Error with Slack API channel history response");
                        cb(response);
                        return;
                    }
                    cb(null, response.messages);
                });
            }
        ],
        function(err, messages) {
            if (err) {
                console.error(err);
                callback(null, Config.errorMessage);
                return;
            }

            //Validate that there are messages
            if (!messages) {
                console.error("Error getting messages");
                callback(null, Config.errorMessage);
                return;
            }

            //Create payload for child functions
            var payload = JSON.stringify({
                userId: event.body.user_id,
                messages: messages
            });

            //Get function based on text argument
            var functions = Utils.getFunctions(event.stage, event.body.text, payload);

            //If no functions are returned, return an error
            if (!functions) {
                console.error("Error getting functions");
                callback(null, Config.errorMessage);
                return;
            }

            //Invoke all chid functions in parallel
            Async.parallel(functions, function(error, results) {
                if (error) {
                    console.error("Error invoking child lambda function");
                    console.error(error);
                    callback(null, Config.errorMessage);
                    return;
                }

                var attachments = [];

                //Loop through child function results and push to attachments array
                Object.keys(results).forEach(function(key) {
                    attachments.push(JSON.parse(results[key].Payload));
                });

                var message = {
                    attachments: attachments
                };

                if (event.body.text.split(" ").indexOf("public") > -1) {
                    message.response_type = "in_channel";
                }

                console.log(message);

                console.log("End gateway function");

                callback(null, message);
            });
        }
    );
};
