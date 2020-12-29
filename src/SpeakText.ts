import * as moment from "moment";
import { Schedule, ShakeSchedule } from "./services/Spla2API";
import { stageRange } from "./Util";

export interface AlexaResponse {
  speakText: string;
  cardTitle: string;
  cardText: string;
  cardImage?: string;
}

export function shakeText(shake: ShakeSchedule): AlexaResponse {
  const start = moment(shake.start);
  const end = moment(shake.end);
  const heldNow = moment().isBetween(start, end);
  const heldText = heldNow
    ? `シャケは今開催中`
    : `シャケは${start.format("M月D日のH時から")}`;

  const weaponText = shake.weapons
    .map((w) => {
      return w.name === "？" ? "はてな" : w.name;
    })
    .join("、");
  const speakText =
    heldText + `でステージは${shake.stage.name}だよ。武器は${weaponText}だよ`;

  return {
    speakText,
    cardTitle: `${shake.stage.name} ${start.format("M/D H:00")} ~ ${end.format(
      "M/D H:00"
    )}`,
    cardText: shake.weapons.map((w) => `- ${w.name}`).join("\n"),
    cardImage: shake.stage.image,
  };
}

export function gachiAndLeagueText(
  currentTime: moment.Moment,
  gachi: Schedule,
  league: Schedule
): AlexaResponse {
  const gachiMap = gachi.maps.join("と");
  const leagueMap = league.maps.join("と");
  const [begin, end] = stageRange(currentTime);
  const start =
    moment() < currentTime ? `${begin}時から${end}時まで` : `${end}時まで`;
  const text = `${start}のガチマは${gachi.rule}で、ステージは${gachiMap}だよ。リグマは${league.rule}で、ステージは${leagueMap}だよ。`;
  const images = gachi.maps_ex
    .map((m) => m.image)
    .concat(league.maps_ex.map((m) => m.image));
  const image = images[Math.floor(Math.random() * images.length)];
  return {
    speakText: text,
    cardTitle: `${begin}時 ~ ${end}時のガチマとリグマ`,
    cardText: [
      `${gachi.rule}`,
      gachi.maps.map((x) => `- ${x}`).join("\n"),
      `${league.rule}`,
      league.maps.map((x) => `- ${x}`).join("\n"),
    ].join("\n"),
    cardImage: image,
  };
}
