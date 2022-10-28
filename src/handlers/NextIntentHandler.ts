import { RequestHandler } from "ask-sdk-core";
import { AlexaSplatoon2 } from "../services/AlexaSplatoon2";
import { gachiAndLeagueText } from "../SpeakText";
import { DateTimeNow } from "../utils/DateTime";

export function NextIntent(splatoon: AlexaSplatoon2): RequestHandler {
  return {
    canHandle: async function ({ requestEnvelope }) {
      return (
        requestEnvelope.request.type === "IntentRequest" &&
        requestEnvelope.request.intent.name === "NextIntent"
      );
    },
    handle: async function ({ responseBuilder }) {
      const current = DateTimeNow();
      const { gachi, league } = splatoon.stage(current, true);
      if (gachi === undefined || league === undefined) {
        return responseBuilder
          .speak("あれれ、今のガチマかリグマがないよ")
          .getResponse();
      }
      const { speakText, cardText, cardTitle, cardImage } = gachiAndLeagueText(
        DateTimeNow().next(),
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
