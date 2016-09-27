'use strict';

module.exports.gateway = function(event, context, callback) {
    var Utils = require('./lib/utils.js');
    var message = { text: "*Chat Behavior Report*"};
    if (event.body.text.split(" ").indexOf("public") > -1) {
        message.response_type = "in_channel";
    } else {
        message.response_type = "ephemeral";
    }
    Utils.sendWebhook(event.body.response_url, message);
    message.text = "*End Report";
    callback(null, message);
    var Gateway = require("./functions/gateway.js");
    Gateway.main(event, context);
};

module.exports.participation = function(event, context, callback) {
    var Participation = require("./functions/participation.js");
    Participation.main(event, context, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
};

module.exports.positivity = function(event, context, callback) {
    var Positivity = require("./functions/positivity.js");
    Positivity.main(event, context, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
};

module.exports.negativity = function(event, context, callback) {
    var Negativity = require("./functions/negativity.js");
    Negativity.main(event, context, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
};

module.exports.conceit = function(event, context, callback) {
    var Conceit = require("./functions/conceit.js");
    Conceit.main(event, context, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
};

module.exports.oauth = function(event, context, callback) {
    var Oauth = require("./functions/oauth.js");
    Oauth.main(event, context, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
};
