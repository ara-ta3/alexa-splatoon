import { RequestHandler } from "ask-sdk-core";
import * as dayjs from "dayjs";
import { AlexaSplatoon } from "../services/AlexaSplatoon";
import { toDomainSchedule } from "../services/Spla2API";
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
      const current = dayjs();
      const { gachi, league } = splatoon.stage(current, false);
      if (gachi === undefined || league === undefined) {
        return responseBuilder
          .speak("あれれ、今のガチマかリグマがないよ")
          .getResponse();
      }
      const { speakText, cardText, cardTitle, cardImage } = gachiAndLeagueText(
        DateTimeNow(),
        toDomainSchedule(gachi),
        toDomainSchedule(league)
      );
      return responseBuilder
        .speak(speakText)
        .withStandardCard(cardTitle, cardText, undefined, cardImage)
        .getResponse();
    },
  };
}
