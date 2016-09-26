'use strict';

var AWS = require('aws-sdk');
var Slack = require('slack-node');
var Async = require('async');
var Config = require('../lib/config.js');

module.exports.main = function(event, context, callback) {
    console.log("Begin oauth function");
    var slack = new Slack();

    var queryString = "?client_id=" + Config.clientId + "&client_secret=" + Config.clientSecret + "&code=" + event.query.code;

    Async.series([
            function(cb) {
                //Call Slack API for Oauth token
                slack.api(Config.oauthAccessEndpoint + queryString, function(err, data) {
                    if (err || data.ok !== true) {
                        console.error("Error calling Slack API for OAuth access");
                        cb(err);
                        return;
                    }

                    cb(null, data);
                });
            }
        ],
        function(err, data) {
            if (err) {
                console.error(err);
                callback("Error in Slack Oauth process");
                return;
            }

            var teamInfo = data[0];

            var params = {
                TableName: Config.teamsTableName,
                Item: {
                    teamId: {
                        S: teamInfo.team_id
                    },
                    teamName: {
                        S: teamInfo.team_name
                    },
                    scope: {
                        S: teamInfo.scope
                    },
                    accessToken: {
                        S: teamInfo.access_token
                    }
                }
            };

            var dynamodb = new AWS.DynamoDB();

            dynamodb.putItem(params, function(error, response) {
                if (error) {
                    console.error(error);
                    callback("Error storing Oauth info");
                    return;
                }

                console.log("End oauth function");
                callback(null, "Successfully added Slack app");
            });
        });
};
