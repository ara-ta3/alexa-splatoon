import { SkillBuilders } from "ask-sdk-core";
import * as moment from "moment";
import {
  JsonResponseBody,
  ShakeResponseBody,
  Spla2APIClientImpl,
} from "./services/Spla2API";
import { isTargetRule, next } from "./Util";
import { gachiAndLeagueText } from "./View";
import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { CustomSkill } from "ask-sdk-core/dist/skill/CustomSkill";

let cache: JsonResponseBody = null;
let shakeCache: ShakeResponseBody = null;
let skill: CustomSkill = null;

const StageIntentHandler: RequestHandler = {
  canHandle: async function ({ requestEnvelope }) {
    return (
      requestEnvelope.request.type === "IntentRequest" &&
      requestEnvelope.request.intent.name === "StageIntent"
    );
  },
  handle: async function ({ responseBuilder }) {
    const current = moment();
    const gachi = cache.result.gachi.find((s) => isTargetRule(s, current));
    const league = cache.result.league.find((s) => isTargetRule(s, current));
    if (gachi === undefined || league === undefined) {
      return responseBuilder
        .speak("あれれ、今のガチマかリグマがないよ")
        .getResponse();
    }
    const res = gachiAndLeagueText(current, gachi, league);
    return responseBuilder
      .speak(res.speakText)
      .withStandardCard(res.cardTitle, res.cardText, undefined, res.cardImage)
      .getResponse();
  },
};

const NextIntent: RequestHandler = {
  canHandle: async function ({ requestEnvelope }) {
    return (
      requestEnvelope.request.type === "IntentRequest" &&
      requestEnvelope.request.intent.name === "NextIntent"
    );
  },
  handle: async function ({ responseBuilder }) {
    const current = next(moment());
    const gachi = cache.result.gachi.find((s) => isTargetRule(s, current));
    const league = cache.result.league.find((s) => isTargetRule(s, current));
    if (gachi === undefined || league === undefined) {
      return responseBuilder
        .speak("あれれ、今のガチマかリグマがないよ")
        .getResponse();
    }
    const res = gachiAndLeagueText(current, gachi, league);
    return responseBuilder
      .speak(res.speakText)
      .withStandardCard(res.cardTitle, res.cardText, undefined, res.cardImage)
      .getResponse();
  },
};

const ShakeIntent: RequestHandler = {
  canHandle: async function ({ requestEnvelope }) {
    return (
      requestEnvelope.request.type === "IntentRequest" &&
      requestEnvelope.request.intent.name === "ShakeIntent"
    );
  },
  handle: async function ({ responseBuilder }) {
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
      heldText + `でステージは${shake.stage.name}だよ。武器は${weaponText}だよ`;
    return responseBuilder
      .speak(speakText)
      .withStandardCard(
        `${shake.stage.name} ${start.format("M/D H:00")} ~ ${end.format(
          "M/D H:00"
        )}`,
        shake.weapons.map((w) => `- ${w.name}`).join("\n"),
        undefined,
        shake.stage.image
      )
      .getResponse();
  },
};

const HelpIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput: HandlerInput) {
    const speechText =
      "ステージを聞きたい時は「今のステージを教えて」か「次のステージを教えて」と、シャケを聞きたいときは「シャケを教えて」と、終わりたい時は「おしまい」と言ってください。どうしますか？";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const handler = async (event: any, context: any, _: Function) => {
  const client = new Spla2APIClientImpl(process.env.USER_AGENT);

  if (cache === null) {
    cache = await client.getSchedule();
  }

  if (shakeCache === null) {
    shakeCache = await client.getShake();
  }
  if (skill === null) {
    skill = SkillBuilders.custom()
      .addRequestHandlers(
        StageIntentHandler,
        NextIntent,
        ShakeIntent,
        HelpIntentHandler
      )
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(JSON.stringify(response));
  return response;
};

export { handler };
