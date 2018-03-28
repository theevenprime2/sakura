'use strict';

require('dotenv').config();

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const slackEventsApi = require('@slack/events-api');
const { WebClient } = require('@slack/client');

const SlackClient = require('./slackClient');
const { registerEvents } = require('./slackEvents');

const slackEventsAdapter = slackEventsApi.createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN, { includeBody: true });
const slackWebClient = new WebClient(process.env.SLACK_TEAM_OAUTH_TOKEN);
const slackClient = new SlackClient(slackEventsAdapter, slackWebClient);

registerEvents(slackClient);

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use('/slack/events', slackClient.events.expressMiddleware());

http.createServer(app).listen(port, () => {
  console.log(`zzServer listening on port ${port}`);
});