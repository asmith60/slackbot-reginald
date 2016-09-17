'use strict';

var Functions = require('require-directory')(module, './func');

module.exports.gateway = function(event, context, cb) {
    Functions.gateway.main(null, null, function(err, data) {
        cb(null, data);
    });
};

module.exports.participation = function(event, context, cb) {
    Functions.participation.main(null, null, function(err, data) {
        cb(null, data);
    });
};

module.exports.positivity = function(event, context, cb) {
    Functions.positivity.main(null, null, function(err, data) {
        cb(null, data);
    });
};
