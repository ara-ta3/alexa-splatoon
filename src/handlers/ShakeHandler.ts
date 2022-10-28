import { RequestHandler } from "ask-sdk-core";
import { AlexaSplatoon2 } from "../services/AlexaSplatoon";
import { shakeText } from "../SpeakText";

export function ShakeIntent(splatoon: AlexaSplatoon2): RequestHandler {
  return {
    canHandle: async function ({ requestEnvelope }) {
      return (
        requestEnvelope.request.type === "IntentRequest" &&
        requestEnvelope.request.intent.name === "ShakeIntent"
      );
    },
    handle: async function ({ responseBuilder }) {
      const shake = splatoon.shake();
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
