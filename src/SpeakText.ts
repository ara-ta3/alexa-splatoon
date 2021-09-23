import * as dayjs from "dayjs";
import { Schedule, ShakeSchedule } from "./services/Spla2API";
import { stageRange } from "./Util";
import * as mustache from "mustache";

export interface AlexaResponse {
  speakText: string;
  cardTitle: string;
  cardText: string;
  cardImage?: string;
}

const shakeTextTemplate: string = `{{#heldNow}}
シャケは今開催中で
{{/heldNow}}
{{^heldNow}}
シャケは{{startDay}}の{{startHour}}時からで
{{/heldNow}}
ステージは{{stageName}}だよ。
武器は{{#weapons}}、{{name}}{{/weapons}}だよ
`.replace(/(\r\n|\n|\r)/gm, "");

export function shakeText(
  shake: ShakeSchedule,
  current: dayjs.Dayjs = dayjs()
): AlexaResponse {
  const start = dayjs(shake.start);
  const end = dayjs(shake.end);
  const speakParams = {
    heldNow: current.isAfter(start) && current.isBefore(end),
    startDay: start.format("M月D日"),
    startHour: start.format("H"),
    stageName: shake.stage.name,
    weapons: shake.weapons.map((w) => {
      return {
        name: w.name === "？" ? "はてな" : w.name,
      };
    }),
  };

  const speakText = mustache.render(shakeTextTemplate, speakParams);

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
  currentTime: dayjs.Dayjs,
  gachi: Schedule,
  league: Schedule
): AlexaResponse {
  const gachiMap = gachi.maps.join("と");
  const leagueMap = league.maps.join("と");
  const [begin, end] = stageRange(currentTime);
  const start =
    dayjs() < currentTime ? `${begin}時から${end}時まで` : `${end}時まで`;
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
