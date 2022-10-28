import { RequestHandler } from "ask-sdk-core";
import { AlexaSplatoon } from "../services/AlexaSplatoon";
import { gachiAndLeagueText } from "../SpeakText";
import { DateTimeNow } from "../utils/DateTime";

export function StageIntentHandler(splatoon: AlexaSplatoon): RequestHandler {
  return {
    canHandle: async function ({ requestEnvelope }) {
      return (
        requestEnvelope.request.type === "IntentRequest" &&
        requestEnvelope.request.intent.name === "StageIntent"
      );
    },
    handle: async function ({ responseBuilder }) {
      const current = DateTimeNow();
      const { gachi, league } = splatoon.stage(current, false);
      if (gachi === undefined || league === undefined) {
        return responseBuilder
          .speak("あれれ、今のガチマかリグマがないよ")
          .getResponse();
      }
      const { speakText, cardText, cardTitle, cardImage } = gachiAndLeagueText(
        DateTimeNow(),
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
