'use strict';

require('dotenv').config({silent: true});

module.exports = {
  devToken: process.env.DEV_TOKEN,

  channelHistoryEndpoint: process.env.CHANNEL_HISTORY_ENDPOINT || 'https://slack.com/api/channels.history'
};
