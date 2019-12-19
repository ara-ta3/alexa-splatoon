import * as Alexa from "alexa-sdk";

const handler = (event: any, context: any, _) => {
  const handlers = {
    LaunchRequest: function() {
      this.emit("StageIntent");
    },
    StageIntent: function() {
      this.emit(":tell", "これはテストだよ");
    },
    "AMAZON.HelpIntent": function() {
      this.emit(
        ":ask",
        "ステージを聞きたい時は「ステージを教えて」と、終わりたい時は「おしまい」と言ってください。どうしますか？",
        "どうしますか？"
      );
    },
    "AMAZON.CancelIntent": function() {
      this.emit(":tell", "さようなら");
    },
    "AMAZON.StopIntent": function() {
      this.emit(":tell", "さようなら");
    }
  };

  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = process.env.ALEXA_APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

export { handler };
