import * as moment from "moment";
import { Schedule } from "./services/Spla2API";
import { stageRange } from "./Util";

export interface AlexaResponse {
  speakText: string;
  cardTitle: string;
  cardText: string;
}

export function gachiAndLeagueText(
  currentTime: moment.Moment,
  gachi: Schedule,
  league: Schedule
): AlexaResponse {
  const gachiMap = gachi.maps.join("と");
  const leagueMap = league.maps.join("と");
  const [begin, end] = stageRange(currentTime);
  const text = `${begin}時から${end}時までのガチマは${gachi.rule}で、ステージは${gachiMap}だよ。リグマは${league.rule}で、ステージは${leagueMap}だよ。`;
  return {
    speakText: text,
    cardTitle: `${begin}時 ~ ${end}時のガチマとリグマ`,
    cardText: [
      `${gachi.rule}`,
      gachi.maps.map((x) => `- ${x}`).join("\n"),
      `${league.rule}`,
      league.maps.map((x) => `- ${x}`).join("\n"),
    ].join("\n"),
  };
}
