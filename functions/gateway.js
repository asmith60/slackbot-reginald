'use strict';

//Import
var AWS = require('aws-sdk');
var Slack = require('slack-node');
var Async = require('async');
var Config = require('../lib/config.js');
var Utils = require('../lib/utils.js');

module.exports.main = function(event, context, callback) {
    console.log("Begin gateway function");
    //Validate channel ID exists
    if (!event.body.channel_id) {
        console.error("Could not retrieve channel id from event");
        callback(true);
        return;
    }

    //Validate user ID exists
    if (!event.body.user_id) {
        console.error("Could not retrieve user id from event");
        callback(true);
        return;
    }

    if (event.body.text.split(" ")[0] === "help") {
        console.log("Responding with \"help\" output");
        callback(null, Config.helpMessage);
        return;
    }

    //Get Oauth info, then invoke channel history
    Async.series([
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
                    cb(null, data);
                });
            }
        ],
        function(err, data) {
            if (err) {
                console.error(err);
                callback(true);
                return;
            }

            var token = data[0].Item.accessToken.S;

            if (!token) {
                console.error("Error token not found");
                callback(true);
            }

            //Get Slack channel history, then call child functions
            Async.series([
                    function(cb) {
                        //Construct slack API object with Oauth token
                        var slack = new Slack(token);
                        //Build params
                        var params = {
                            channel: event.body.channel_id
                        };
                        //Call Slack API to get history
                        slack.api(Config.channelHistoryEndpoint, params, function(error, response) {
                            if (error) {
                                console.error("Error calling Slack API for channel history");
                                cb(error);
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
                function(error, response) {
                    if (error) {
                        console.error(error);
                        callback(true);
                        return;
                    }

                    var messages = response[0];

                    //Create payload for child functions
                    var payload = JSON.stringify({
                        userId: event.body.user_id,
                        messages: messages
                    });

                    //Get function based on text argument
                    var functions = Utils.getFunctions(event.stage, event.body.text, payload);

                    //If no functions are returned, return an error
                    if (!functions) {
                        console.log("Error getting functions");
                        callback(true);
                        return;
                    }

                    Async.parallel(functions, function(functionError, results) {
                        if (functionError) {
                            console.error("Error invoking child lambda function");
                            console.error(functionError);
                            callback(true);
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
        }
    );
};
