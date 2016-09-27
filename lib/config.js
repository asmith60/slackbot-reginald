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

    errorMessage: {
      text: "Oops, something went wrong!"
    },

    channelHistoryEndpoint: process.env.CHANNEL_HISTORY_ENDPOINT || 'channels.history',

    helpMessage: {
        attachments: [{
            pretext: "Reginald gives you information about your in-chat behavior. He analyzes 4 metrics: participation, positivity, negativity, and conceit. He can return a report with any combination of these metrics. Reports are private by default, but can be made public by adding \"public\" to the command",
            fields: [{
                title: "Get full report",
                value: "/reginald"
            }, {
                title: "Get only participation",
                value: "/reginald participation"
            }, {
                title: "Get participation and positivity",
                value: "/reginald participation positivity"
            }, {
                title: "Make a report public",
                value: "/reginald public participation"
            }]
        }]
    },

    oauthAccessEndpoint: process.env.OAUTH_ACCESS_ENDPOINT || 'oauth.access',

    teamsTableName: process.env.TEAMS_TABLE_NAME || 'Teams',

    //Build ARN strings for child functions
    getArns: function(stage) {
        var arnString = "arn:aws:lambda:" + this.awsRegion + ":" + this.awsAccountId + ":" + "function:" + this.botName + "-" + stage + "-";
        return {
            participation: arnString + "participation",
            positivity: arnString + "positivity",
            conceit: arnString + "conceit",
            negativity: arnString + "negativity"
        }
    }
};
