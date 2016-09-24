'use strict';

var Slack = require('slack-node');
var AWS = require('aws-sdk');
var Async = require('async');
var Config = require('../lib/config.js');

module.exports.main = function(event, context, callback) {
    if (!event.body.channel_id) {
        console.error("Could not retrieve channel id from event");
        callback(true);
        return;
    }

    if (!event.body.user_id) {
        console.error("Could not retrieve user id from event");
        callback(true);
        return;
    }

    var userId = event.body.user_id;

    Async.series([
            function(cb) {
                var slack = new Slack(Config.devToken);
                var params = {
                    channel: event.body.channel_id
                };
                slack.api(Config.channelHistoryEndpoint, params, function(err, data) {
                    if (err || data.ok === 'true') {
                        console.error("Error calling Slack API for channel history");
                        cb(err);
                        return;
                    }
                    cb(null, data.messages);
                });
            }
        ],
        function(err, data) {
            if (err) {
                console.error(err);
                callback(err);
                return;
            }

            var arns = Config.getArns(event.stage);
            var lambda = new AWS.Lambda();
            var payload = JSON.stringify({
                userId: event.body.user_id,
                messages: data[0]
            });

            Async.parallel({
                    participation: function(cb) {
                        var params = {
                            FunctionName: arns.participation,
                            Payload: payload,
                        };
                        lambda.invoke(params, function(error, response) {
                            if (error) {
                                console.error("Error invoking participation function");
                                cb(error);
                                return;
                            }

                            callback(null, response);
                        });
                    },
                    positivity: function(cb) {
                        var params = {
                            FunctionName: arns.positivity,
                            Payload: payload,
                        };
                        lambda.invoke(params, function(error, response) {
                            if (error) {
                                console.error("Error invoking positivity function");
                                cb(error);
                                return;
                            }

                            callback(null, response);
                        });
                    },
                    conceited: function(cb) {
                        var params = {
                            FunctionName: arns.conceited,
                            Payload: payload,
                        };
                        lambda.invoke(params, function(error, response) {
                            if (error) {
                                console.error("Error invoking participation function");
                                cb(error);
                                return;
                            }

                            callback(null, response);
                        });
                    }
                },
                function(error, results) {
                    if (error) {
                        console.error("Error invoking child lambda function - " + error)
                        callback(error);
                        return;
                    }

                    console.log(results);

                    callback(null, {
                        response: results
                    });
                });

        });
};
