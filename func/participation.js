'use strict';

module.exports.main = function(user, messages, callback) {
    var response = {
        message: 'Participation handler function'
    }
    callback(null, response);
};
