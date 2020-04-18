import * as Alexa from "alexa-sdk";
import * as request from "request";
import moment = require("moment");
import { JsonResponseBody, Spla2APIClientImpl } from "./src/services/Spla2API";
import { isTargetRule, next, stageRange } from "./src/Util";

let cache: JsonResponseBody = null;

const handler = async (event: any, context: any, _: Function) => {
  const client = new Spla2APIClientImpl(request, process.env.USER_AGENT);
  if (cache === null) {
    cache = await client.getSchedule();
  }
  const handlers = {
    LaunchRequest: function () {
      this.emit("AMAZON.HelpIntent");
    },
    StageIntent: function () {
      const current = moment();
      const gachi = cache.result.gachi.find((s) => isTargetRule(s, current));
      const league = cache.result.league.find((s) => isTargetRule(s, current));
      if (gachi === undefined || league === undefined) {
        this.emit(":tell", "あれれ、今のガチマかリグマがないよ");
      } else {
        const [begin, end] = stageRange(current);
        const gachiMap = gachi.maps.join("と");
        const leagueMap = league.maps.join("と");
        const text = `今のガチマは${gachi.rule}で、ステージは${gachiMap}だよ。リグマは${league.rule}で、ステージは${leagueMap}だよ。`;
        this.response.speak(text);
        this.response.cardRenderer(
          `${begin}時 ~ ${end}時のガチマとリグマ`,
          [
            `${gachi.rule}`,
            gachi.maps.map((x) => `- ${x}`).join("\n"),
            `${league.rule}`,
            league.maps.map((x) => `- ${x}`).join("\n"),
          ].join("\n")
        );
        this.emit(":responseReady");
      }
    },
    NextIntent: function () {
      const nextTime = next(moment());
      const gachi = cache.result.gachi.find((s) => isTargetRule(s, nextTime));
      const league = cache.result.league.find((s) => isTargetRule(s, nextTime));
      if (gachi === undefined || league === undefined) {
        this.emit(":tell", "あれれ、今のガチマかリグマがないよ");
      } else {
        const gachiMap = gachi.maps.join("と");
        const leagueMap = league.maps.join("と");
        const [begin, end] = stageRange(nextTime);
        const text = `次の${begin}時から${end}時までのガチマは${gachi.rule}で、ステージは${gachiMap}だよ。リグマは${league.rule}で、ステージは${leagueMap}だよ。`;
        this.response.speak(text);
        this.response.cardRenderer(
          `${begin}時 ~ ${end}時のガチマとリグマ`,
          [
            `${gachi.rule}`,
            gachi.maps.map((x) => `- ${x}`).join("\n"),
            `${league.rule}`,
            league.maps.map((x) => `- ${x}`).join("\n"),
          ].join("\n")
        );
        this.emit(":responseReady");
      }
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
