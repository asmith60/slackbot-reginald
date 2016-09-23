'use strict';

require('dotenv').config({
    silent: true
});

module.exports = {
    awsAccountId: process.env.AWS_ACCOUNT_ID,

    awsRegion: process.env.AWS_DEFAULT_REGION,

    botName: process.env.BOT_NAME || 'slackbot-reginald',

    devToken: process.env.DEV_TOKEN,

    channelHistoryEndpoint: process.env.CHANNEL_HISTORY_ENDPOINT || 'https://slack.com/api/channels.history',

    getArns: function(stage) {
      var arnString = "arn:aws:lambda:" + this.awsRegion + ":" + this.awsAccountId + ":" + "function:" + this.botName + "-" + stage + "-";
      return {
        participation: arnString + "participation",
        positivity: arnString + "positivity",
        conceited: arnString + "conceited"
      }
    }
};
