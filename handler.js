'use strict';

var Functions = require('require-directory')(module, './func');

module.exports.gateway = function(event, context, cb) {
    Functions.gateway.main(event, context, function(err, data) {
        cb(null, "true");
    });
};

module.exports.participation = function(event, context, cb) {
    Functions.participation.main(event, context, function(err, data) {
        cb(null, data);
    });
};

module.exports.positivity = function(event, context, cb) {
    Functions.positivity.main(event, context, function(err, data) {
        cb(null, data);
    });
};
