import * as Alexa from "alexa-sdk";
import * as request from "request";
import moment = require("moment");
import { JsonResponseBody, Spla2APIClientImpl } from "./src/services/Spla2API";
import { isTargetRule, next, stageRange } from "./src/Util";
import { AlexaResponse, gachiAndLeagueText } from "./src/View";

let cache: JsonResponseBody = null;

const handler = async (event: any, context: any, _: Function) => {
  const client = new Spla2APIClientImpl(request, process.env.USER_AGENT);
  if (cache === null) {
    cache = await client.getSchedule();
  }
  const ruleStageHandle = (
    current: moment.Moment,
    onSuccess: (text: AlexaResponse) => void,
    onNotFound: () => void
  ): void => {
    const gachi = cache.result.gachi.find((s) => isTargetRule(s, current));
    const league = cache.result.league.find((s) => isTargetRule(s, current));
    if (gachi === undefined || league === undefined) {
      onNotFound();
    } else {
      const text = gachiAndLeagueText(current, gachi, league);
      onSuccess(text);
    }
  };
  const handlers = {
    LaunchRequest: function () {
      this.emit("AMAZON.HelpIntent");
    },
    StageIntent: function () {
      ruleStageHandle(
        moment(),
        (text: AlexaResponse) => {
          this.response.speak(text.speakText);
          this.response.cardRenderer(text.cardTitle, text.cardText);
          this.emit(":responseReady");
        },
        () => {
          this.emit(":tell", "あれれ、今のガチマかリグマがないよ");
        }
      );
    },
    NextIntent: function () {
      ruleStageHandle(
        next(moment()),
        (text: AlexaResponse) => {
          this.response.speak(text.speakText);
          this.response.cardRenderer(text.cardTitle, text.cardText);
          this.emit(":responseReady");
        },
        () => {
          this.emit(":tell", "あれれ、今のガチマかリグマがないよ");
        }
      );
    },
    "AMAZON.HelpIntent": function () {
      this.emit(
        ":ask",
        "ステージを聞きたい時は「今のステージを教えて」か「次のステージを教えて」と、終わりたい時は「おしまい」と言ってください。どうしますか？"
      );
    },
    "AMAZON.CancelIntent": function () {
      this.emit(":tell", "さようなら");
    },
    "AMAZON.StopIntent": function () {
      this.emit(":tell", "さようなら");
    },
  };

  const alexa = Alexa.handler(event, context);
  alexa.appId = process.env.ALEXA_APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

export { handler };
