'use strict';

var Functions = require('require-directory')(module, './functions');

module.exports.gateway = function(event, context, callback) {
    Functions.gateway.main(event, context, function(err, data) {
        if (err) {
            callback(null, {
                text: "Oops, something went wrong"
            });
            return;
        }
        callback(null, data);
    });
};

module.exports.participation = function(event, context, callback) {
    Functions.participation.main(event, context, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
};

module.exports.positivity = function(event, context, callback) {
    Functions.positivity.main(event, context, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
};

module.exports.conceited = function(event, context, callback) {
    Functions.conceited.main(event, context, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
};
