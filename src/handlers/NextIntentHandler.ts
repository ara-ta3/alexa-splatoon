import { RequestHandler } from "ask-sdk-core";
import * as dayjs from "dayjs";
import { AlexaSplatoon } from "../services/AlexaSplatoon";
import { next } from "../Util";
import { gachiAndLeagueText } from "../SpeakText";

export function NextIntent(splatoon: AlexaSplatoon): RequestHandler {
  return {
    canHandle: async function ({ requestEnvelope }) {
      return (
        requestEnvelope.request.type === "IntentRequest" &&
        requestEnvelope.request.intent.name === "NextIntent"
      );
    },
    handle: async function ({ responseBuilder }) {
      const current = dayjs();
      const { gachi, league } = splatoon.stage(current, true);
      if (gachi === undefined || league === undefined) {
        return responseBuilder
          .speak("あれれ、今のガチマかリグマがないよ")
          .getResponse();
      }
      const { speakText, cardText, cardTitle, cardImage } = gachiAndLeagueText(
        next(current),
        gachi,
        league
      );
      return responseBuilder
        .speak(speakText)
        .withStandardCard(cardTitle, cardText, undefined, cardImage)
        .getResponse();
    },
  };
}
