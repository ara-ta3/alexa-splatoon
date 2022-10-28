import { RequestHandler } from "ask-sdk-core";
import { AlexaSplatoon3 } from "../services/AlexaSplatoon3";
import { bankaraMatchText } from "../templates/Splatoon3";
import { DateTimeNow } from "../utils/DateTime";

export function StageIntentHandler(splatoon: AlexaSplatoon3): RequestHandler {
  return {
    canHandle: async function ({ requestEnvelope }) {
      return (
        requestEnvelope.request.type === "IntentRequest" &&
        requestEnvelope.request.intent.name === "StageIntent"
      );
    },
    handle: async function ({ responseBuilder }) {
      const current = DateTimeNow();
      const m = await splatoon.stage(current, false);
      if (m === null) {
        return responseBuilder
          .speak("あれれ、今のバンカラマッチがないよ")
          .getResponse();
      }
      const { speakText, cardText, cardTitle, cardImage } = bankaraMatchText(
        current,
        m
      );
      return responseBuilder
        .speak(speakText)
        .withStandardCard(cardTitle, cardText, undefined, cardImage)
        .getResponse();
    },
  };
}
