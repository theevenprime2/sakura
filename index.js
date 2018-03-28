'use strict';

require('dotenv').config();

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const slackEventsApi = require('@slack/events-api');
const { WebClient } = require('@slack/client');

const SlackClient = require('./slackClient');
const { registerEvents } = require('./slackEvents');
console.log(process.env.SLACK_VERIFICATION_TOKEN);
const slackEventsAdapter = slackEventsApi.createSlackEventAdapter('vNtGGM4nuwF36koKluSlM8Dt', { includeBody: true });
const slackWebClient = new WebClient('xoxp-327667997619-327667997651-337075952069-e627b7d02f60ff0d63b7b1176e1cb487');
const slackClient = new SlackClient(slackEventsAdapter, slackWebClient);

registerEvents(slackClient);

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use('/slack/events', slackClient.events.expressMiddleware());

http.createServer(app).listen(port, () => {
  console.log(`Server listening on port ${port}`);
});