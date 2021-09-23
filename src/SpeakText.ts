import * as dayjs from "dayjs";
import * as mustache from "mustache";
import { Schedule, ShakeSchedule } from "./services/Spla2API";
import { stageRange } from "./Util";

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

const gachiAndLeagueTextTemplate: string = `{{#alreadyStarted}}
{{begin}}時から{{end}}時まで
{{/alreadyStarted}}
{{^alreadyStarted}}
{{end}}時まで
{{/alreadyStarted}}
のガチマは{{gachiRule}}で、ステージは{{gachiMap1}}と{{gachiMap2}}だよ。
リグマは{{leagueRule}}で、ステージは{{leagueMap1}}と{{leagueMap2}}だよ。
`.replace(/(\r\n|\n|\r)/gm, "");

export function gachiAndLeagueText(
  currentTime: dayjs.Dayjs,
  gachi: Schedule,
  league: Schedule,
  now: dayjs.Dayjs = dayjs()
): AlexaResponse {
  const [begin, end] = stageRange(currentTime);
  const images = gachi.maps_ex
    .map((m) => m.image)
    .concat(league.maps_ex.map((m) => m.image));
  const params = {
    alreadyStarted: now < currentTime,
    begin: begin,
    end: end,
    gachiRule: gachi.rule,
    gachiMap1: gachi.maps[0],
    gachiMap2: gachi.maps[1],
    leagueRule: league.rule,
    leagueMap1: league.maps[0],
    leagueMap2: league.maps[1],
  };
  return {
    speakText: mustache.render(gachiAndLeagueTextTemplate, params),
    cardTitle: `${begin}時 ~ ${end}時のガチマとリグマ`,
    cardText: [
      `${gachi.rule}`,
      gachi.maps.map((x) => `- ${x}`).join("\n"),
      `${league.rule}`,
      league.maps.map((x) => `- ${x}`).join("\n"),
    ].join("\n"),
    cardImage: images[Math.floor(Math.random() * images.length)],
  };
}
