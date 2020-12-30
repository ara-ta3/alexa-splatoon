import { RequestHandler } from "ask-sdk-core";
import * as dayjs from "dayjs";
import { AlexaSplatoon } from "../services/AlexaSplatoon";
import { gachiAndLeagueText } from "../SpeakText";

export function StageIntentHandler(splatoon: AlexaSplatoon): RequestHandler {
  return {
    canHandle: async function ({ requestEnvelope }) {
      return (
        requestEnvelope.request.type === "IntentRequest" &&
        requestEnvelope.request.intent.name === "StageIntent"
      );
    },
    handle: async function ({ responseBuilder }) {
      const current = dayjs();
      const { gachi, league } = splatoon.stage(current, false);
      if (gachi === undefined || league === undefined) {
        return responseBuilder
          .speak("あれれ、今のガチマかリグマがないよ")
          .getResponse();
      }
      const { speakText, cardText, cardTitle, cardImage } = gachiAndLeagueText(
        current,
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
