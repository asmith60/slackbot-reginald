'use strict';

module.exports.gateway = function(event, context, cb) {
  cb(null, { message: 'Gateway handler'}
};

module.exports.participation = function(event, context, cb) {
  cb(null, { message: 'Participation handler'}
};

module.exports.positivity = function(event, context, cb) {
  cb(null, { message: 'Positivity handler'}
};
