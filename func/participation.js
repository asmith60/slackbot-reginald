'use strict';

module.exports.main = function(user, history, callback) {
    var response = 0,
        count = 0,
        total = 0;
    while (history) {
        if (history.get('userId') == userId) {
            count++;
        }
        total++;
    }
    response = ((count / total) * 100).toPercent();
    callback(null, response);
};
