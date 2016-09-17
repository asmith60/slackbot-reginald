'use strict';

module.exports.main = function(user, messages, callback) {
    var response = {
        message: 'Gateway handler function'
    }
    callback(null, response);
};
