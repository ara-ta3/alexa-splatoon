import { RequestHandler } from "ask-sdk-core";
import { AlexaSplatoon2 } from "../services/AlexaSplatoon2";
import { targetScheduleDates } from "../Util";
import { gachiText } from "../SpeakText";
import { DateTime } from "../utils/DateTime";

export function GachiIntent(splatoon: AlexaSplatoon2): RequestHandler {
  return {
    canHandle: async function ({ requestEnvelope }) {
      return (
        requestEnvelope.request.type === "IntentRequest" &&
        requestEnvelope.request.intent.name === "GachiIntent"
      );
    },
    handle: async function ({ responseBuilder }) {
      const targets = targetScheduleDates(new DateTime(), 4);
      const schedules = splatoon.gachi(targets);
      if (schedules.length === 0) {
        return responseBuilder.speak("あれれ、ガチマがないよ").getResponse();
      }
      const { speakText, cardText, cardTitle, cardImage } =
        gachiText(schedules);
      return responseBuilder
        .speak(speakText)
        .withStandardCard(cardTitle, cardText, undefined, cardImage)
        .getResponse();
    },
  };
}
