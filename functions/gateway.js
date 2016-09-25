'use strict';

var Slack = require('slack-node');
var Async = require('async');
var Config = require('../lib/config.js');
var Utils = require('../lib/utils.js');

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
                callback(true);
                return;
            }

            var payload = JSON.stringify({
                userId: event.body.user_id,
                messages: data[0]
            });

            var functions = Utils.getFunctions(event.stage, event.body.text, payload);

            if (!functions) {
              console.log("Error unknown arguments");
              callback(true);
              return;
            }

            Async.parallel(functions, function(error, results) {
                if (error) {
                    console.error("Error invoking child lambda function");
                    console.error(error);
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
