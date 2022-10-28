import { RequestHandler } from "ask-sdk-core";
import { AlexaSplatoon3 } from "../services/AlexaSplatoon3";
import { shakeText } from "../templates/Splatoon3";

export function ShakeIntent(splatoon: AlexaSplatoon3): RequestHandler {
  return {
    canHandle: async function ({ requestEnvelope }) {
      return (
        requestEnvelope.request.type === "IntentRequest" &&
        requestEnvelope.request.intent.name === "ShakeIntent"
      );
    },
    handle: async function ({ responseBuilder }) {
      const shake = await splatoon.shake();
      if (shake === null) {
        return responseBuilder
          .speak("あれ、シャケのルールが取得できてないよ")
          .getResponse();
      }
      const { speakText, cardTitle, cardText, cardImage } = shakeText(shake);

      return responseBuilder
        .speak(speakText)
        .withStandardCard(cardTitle, cardText, undefined, cardImage)
        .getResponse();
    },
  };
}
