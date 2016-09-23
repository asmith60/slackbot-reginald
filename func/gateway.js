'use strict';

var Slack = require('slack-node');
var Config = require('../lib/config.js');

module.exports.main = function(event, context, callback) {
    var slack = new Slack(Config.devToken);

    slack.api(Config.channelHistoryEndpoint, {channel: event.body.channel_id}, function(err, data) {
        if (err) {
          console.error(err);
          callback(err);
        }
        callback(null, data);
    });
};
