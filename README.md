# Reginald the Slackbot

Reginald analyzes Slack chat history to provide users with an overview of how their in-chat behavior is perceived by other users. Metrics returned include participation, positivity, negativity, and conceit. The metrics are calculated using only the last 1000 posts in the current channel. This means a user's scores will be different in each channel and will change over time.

## Installation

Click the below link to install the app

[Add to Slack](https://slack.com/oauth/authorize?scope=commands,channels:history&client_id=45828019714.84064139872)

## Usage

Reginald gives you information about your in-chat behavior. He analyzes 4 metrics: participation, positivity, negativity, and conceit. He can return a report with any combination of these metrics. Reports are private by default, but can be made public by adding "public" to the command

* Get full report
  * ```/reginald```
* Get only participation
  * ```/reginald participation```
* Get participation and positivity
  * ```/reginald participation positivity```
* Make a report public
  * ```/reginald public participation```

## Deployment and Testing

To install the app to a Slack channel use the [Installation](https://github.com/asmith60/slackbot-reginald#installation) instructions provided above. To deploy your own version of the app in AWS follow the below instructions.

### Prerequisites

* [Node.js/npm](https://nodejs.org/en/)
* git

### Instructions

* Install [Serverless](https://serverless.com/) globally
```bash
npm install -g serverless
```
* Clone the repository then change directories to the project root
```bash
git clone https://github.com/asmith60/slackbot-reginald.git
cd slackbot-reginald
```
* Create and populate a .env file at the root of the project - *See below section on [Environment Variables](https://github.com/asmith60/slackbot-reginald#environment-variables)*
```bash
touch .env
```
* Set AWS credentials - *The user must have rights to create the necessary resources*
```bash
export AWS_ACCESS_KEY_ID=[Key goes here]
export AWS_SECRET_ACCESS_KEY=[Secret key goes here]
```
* Deploy AWS resources using Serverless - *By default resources will be created in the us-west-2 region. This can be overridden on the command line with the "-r" flag. See [Serverless CLI Reference](https://serverless.com/framework/docs/cli-reference/deploy/)*
```bash
sls deploy
```
* The above command will output the public endpoints used by the app to accept requests. From here you can hook the app up to a custom integration in Slack, or test the app by itself by sending JSON requests to the endpoints.

## Environment Variables

To set environment variables that can be referenced in the Lambda functions, you must create and populate a file called .env in the root of the project. The current list of environment variables is:

* AWS_ACCOUNT_ID: ID of the AWS account that resources are deploying to
* BOT_NAME: Name of the Slackbot - *Default is "slackbot-reginald"*
* CLIENT_ID: ID issued by Slack to the integration
* CLIENT_SECRET: Secret issued by Slack to the integration
* CHANNEL_HISTORY_ENDPOINT: URI that can be called to get Slack channel history - *Default is "channels.history"*
* OAUTH_ACCESS_ENDPOINT: URI that can be called to get a Slack OAuth token - *Default is "oauth.access"*
* TEAMS_TABLE_NAME: Name of the DynamoDB table used to store team OAuth info - *Default is "Teams"*
* VERIFY_TOKEN: Verification token issued by Slack to the integration

EXAMPLE:
```
CHANNEL_HISTORY_ENDPOINT=channels.history
OAUTH_ACCESS_ENDPOINT=oauth.access
AWS_ACCOUNT_ID=123456
CLIENT_ID=123456
CLIENT_SECRET=123456
VERIFY_TOKEN=123456
```

## Bugs and Features

If you find a bug in the project or a mistake in the documentation, you can help us by submitting an issue to the [slackbot-reginald repository](https://github.com/asmith60/slackbot-reginald/issues) . Even better you can submit a pull request with a fix :) !

You can request a new feature by submitting an issue to the [slackbot-reginald repository](https://github.com/asmith60/slackbot-reginald/issues) .
