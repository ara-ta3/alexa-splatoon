import { RequestHandler } from "ask-sdk-core";
import * as dayjs from "dayjs";
import { AlexaSplatoon } from "../services/AlexaSplatoon";
import { gachiAndLeagueText } from "../SpeakText";
import { DateTimeNow } from "../utils/DateTime";
import { toDomainSchedule } from "../services/Spla2API";

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
        DateTimeNow().next(),
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
