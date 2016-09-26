'use strict';

//Load .env file into environment
require('dotenv').config({
    silent: true
});

module.exports = {
    awsAccountId: process.env.AWS_ACCOUNT_ID,

    awsRegion: process.env.AWS_DEFAULT_REGION,

    botName: process.env.BOT_NAME || 'slackbot-reginald',

    clientId: process.env.CLIENT_ID,

    clientSecret: process.env.CLIENT_SECRET,

    devToken: process.env.DEV_TOKEN,

    channelHistoryEndpoint: process.env.CHANNEL_HISTORY_ENDPOINT || 'channels.history',

    oauthAccessEndpoint: process.env.OAUTH_ACCESS_ENDPOINT || 'oauth.access',

    teamsTableName: process.env.TEAMS_TABLE_NAME || 'Teams',

    //Build ARN strings for child functions
    getArns: function(stage) {
      var arnString = "arn:aws:lambda:" + this.awsRegion + ":" + this.awsAccountId + ":" + "function:" + this.botName + "-" + stage + "-";
      return {
        participation: arnString + "participation",
        positivity: arnString + "positivity",
        conceited: arnString + "conceited"
      }
    }
};
