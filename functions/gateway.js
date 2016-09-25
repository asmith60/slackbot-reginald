'use strict';

//Import
var Slack = require('slack-node');
var Async = require('async');
var Config = require('../lib/config.js');
var Utils = require('../lib/utils.js');

module.exports.main = function(event, context, callback) {
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

    //Get channel history, then invoke child functions
    Async.series([
            function(cb) {
                var slack = new Slack(Config.devToken);
                var params = {
                    channel: event.body.channel_id
                };
                //Call Slack API to get history
                slack.api(Config.channelHistoryEndpoint, params, function(err, data) {
                    if (err || data.ok !== true) {
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
                callback(true);
                return;
            }

            //Create payload for child functions
            var payload = JSON.stringify({
                userId: event.body.user_id,
                messages: data[0]
            });

            //Get function based on text argument
            var functions = Utils.getFunctions(event.stage, event.body.text, payload);

            //If no functions are returned, return an error
            if (!functions) {
                console.log("Error unknown arguments");
                callback(true);
                return;
            }

            Async.parallel(functions, function(error, results) {
                if (error) {
                    console.error("Error invoking child lambda function");
                    console.error(error);
                    callback(true);
                    return;
                }

                console.log(results);

                callback(null, {
                    response: results
                });
            });

        });
};
