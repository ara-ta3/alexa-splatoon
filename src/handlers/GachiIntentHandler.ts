import * as dayjs from "dayjs";
import { RequestHandler } from "ask-sdk-core";
import { AlexaSplatoon } from "../services/AlexaSplatoon";
import { targetScheduleDates } from "../Util";
import { gachiText } from "../SpeakText";
import { toDomainSchedule } from "../services/Spla2API";

export function GachiIntent(splatoon: AlexaSplatoon): RequestHandler {
  return {
    canHandle: async function ({ requestEnvelope }) {
      return (
        requestEnvelope.request.type === "IntentRequest" &&
        requestEnvelope.request.intent.name === "GachiIntent"
      );
    },
    handle: async function ({ responseBuilder }) {
      const targets = targetScheduleDates(dayjs(), 4);
      const schedules = splatoon.gachi(targets);
      if (schedules.length === 0) {
        return responseBuilder.speak("あれれ、ガチマがないよ").getResponse();
      }
      const { speakText, cardText, cardTitle, cardImage } = gachiText(
        schedules.map((x) => toDomainSchedule(x))
      );
      return responseBuilder
        .speak(speakText)
        .withStandardCard(cardTitle, cardText, undefined, cardImage)
        .getResponse();
    },
  };
}
