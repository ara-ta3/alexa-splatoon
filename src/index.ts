import * as Alexa from "alexa-sdk";
import * as request from "request";
import * as moment from "moment";
import {
  JsonResponseBody,
  ShakeResponseBody,
  Spla2APIClientImpl,
} from "./services/Spla2API";
import { isTargetRule, next } from "./Util";
import { AlexaResponse, gachiAndLeagueText } from "./View";

let cache: JsonResponseBody = null;
let shakeCache: ShakeResponseBody = null;

const handler = async (event: any, context: any, _: Function) => {
  const client = new Spla2APIClientImpl(request, process.env.USER_AGENT);

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
  if (cache === null) {
    cache = await client.getSchedule();
  }

  if (shakeCache === null) {
    shakeCache = await client.getShake();
  }
  const handlers = {
    LaunchRequest: async function () {
      this.emit("AMAZON.HelpIntent");
    },
    StageIntent: function () {
      ruleStageHandle(
        moment(),
        (text: AlexaResponse) => {
          this.response.speak(text.speakText);
          text.cardImage === undefined
            ? this.response.cardRenderer(text.cardTitle, text.cardText)
            : this.response.cardRenderer(text.cardTitle, text.cardText, {
                largeImageUrl: text.cardImage,
              });
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
          text.cardImage === undefined
            ? this.response.cardRenderer(text.cardTitle, text.cardText)
            : this.response.cardRenderer(text.cardTitle, text.cardText, {
                largeImageUrl: text.cardImage,
              });
          this.emit(":responseReady");
        },
        () => {
          this.emit(":tell", "あれれ、今のガチマかリグマがないよ");
        }
      );
    },
    ShakeIntent: function () {
      if (shakeCache === null || shakeCache.result.length === 0) {
        this.emit(":tell", "あれ、シャケのルールが取得できてないよ");
      }
      const shake = shakeCache.result.reduce((prev, current) => {
        const prevStart = moment(prev.start);
        const currentStart = moment(current.start);
        return prevStart.isBefore(currentStart) ? prev : current;
      });

      const start = moment(shake.start);
      const end = moment(shake.end);
      const heldNow = moment().isBetween(start, end);
      const heldText = heldNow
        ? `シャケは今開催中`
        : `シャケは${start.format("M月D日のH時から")}`;

      const weaponText = shake.weapons
        .map((w) => {
          return w.name === "？" ? "はてな" : w.name;
        })
        .join("、");
      const speakText =
        heldText +
        `でステージは${shake.stage.name}だよ。武器は${weaponText}だよ`;
      this.response.speak(speakText);
      this.response.cardRenderer(
        `${shake.stage.name} ${start.format("M/D H:00")} ~ ${end.format(
          "M/D H:00"
        )}`,
        shake.weapons.map((w) => `- ${w.name}`).join("\n"),
        {
          largeImageUrl: shake.stage.image,
        }
      );
      this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function () {
      this.emit(
        ":ask",
        "ステージを聞きたい時は「今のステージを教えて」か「次のステージを教えて」と、シャケを聞きたいときは「シャケを教えて」と、終わりたい時は「おしまい」と言ってください。どうしますか？"
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
