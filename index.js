'use strict';
var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var handlers = {
        'LaunchRequest': function () {
            this.emit('StageIntent');
        },
        'StageIntent': function () {
            this.emit(':tell', 'これはテストだよ')
        },
        'AMAZON.HelpIntent': function () {
            this.emit(':ask', "ステージを聞きたい時は「ステージを教えて」と、終わりたい時は「おしまい」と言ってください。どうしますか？", "どうしますか？");
        },
        'AMAZON.CancelIntent': function () {
            this.emit(':tell', "さようなら");
        },
        'AMAZON.StopIntent': function () {
            this.emit(':tell', "さようなら");
        }
    };
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = process.env.ALEXA_APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};



