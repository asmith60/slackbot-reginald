# Reginald the Slackbot

This app analyzes channel message history to provide users with an overview of how their in-chat behavior is perceived by other users. Metrics returned include participation, positivity, negativity, and conceit.

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

## Bugs and Features

If you find a bug in the project or a mistake in the documentation, you can help us by submitting an issue to the [slackbot-reginald repository](https://github.com/asmith60/slackbot-reginald/issues) . Even better you can submit a pull request with a fix :) !

You can request a new feature by submitting an issue to the [slackbot-reginald repository](https://github.com/asmith60/slackbot-reginald/issues) .
