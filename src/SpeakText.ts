import * as mustache from "mustache";
import { Shake, Match as DomainSchedule } from "./Contract";
import { DateTime, DateTimeNow } from "./utils/DateTime";

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
武器は、{{weapons}}だよ
`.replace(/(\r\n|\n|\r)/gm, "");

export function shakeText(
  shake: Shake,
  current: DateTime = DateTimeNow()
): AlexaResponse {
  const speakText = mustache.render(shakeTextTemplate, {
    heldNow: shake.period.in(current),
    startDay: shake.period.start.format("M月D日"),
    startHour: shake.period.start.format("H"),
    stageName: shake.stage.name,
    weapons: shake.weapons.map((w) => (w === "？" ? "はてな" : w)).join("、"),
  });

  return {
    speakText,
    cardTitle: `${shake.stage.name} ${shake.period.start.format(
      "M/D H:00"
    )} ~ ${shake.period.end.format("M/D H:00")}`,
    cardText: shake.weapons.map((w) => `- ${w}`).join("\n"),
    cardImage: shake.stage.image,
  };
}

const gachiAndLeagueTextTemplate: string = `{{#alreadyStarted}}
{{end}}時まで
{{/alreadyStarted}}
{{^alreadyStarted}}
{{begin}}時から{{end}}時まで
{{/alreadyStarted}}
のガチマは{{gachiRule}}で、ステージは{{gachiMap1}}と{{gachiMap2}}だよ。
リグマは{{leagueRule}}で、ステージは{{leagueMap1}}と{{leagueMap2}}だよ。
`.replace(/(\r\n|\n|\r)/gm, "");

export function gachiAndLeagueText(
  targetTime: DateTime,
  gachi: DomainSchedule,
  league: DomainSchedule,
  now: DateTime = DateTimeNow()
): AlexaResponse {
  const [begin, end] = targetTime.stageRangeHour();
  const images = gachi.maps
    .map((m) => m.image)
    .concat(league.maps.map((m) => m.image));
  return {
    speakText: mustache.render(gachiAndLeagueTextTemplate, {
      alreadyStarted: now.raw >= targetTime.raw,
      begin: begin,
      end: end,
      gachiRule: gachi.rule,
      gachiMap1: gachi.maps[0].name,
      gachiMap2: gachi.maps[1].name,
      leagueRule: league.rule,
      leagueMap1: league.maps[0].name,
      leagueMap2: league.maps[1].name,
    }),
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

const schedulesTemplate: string = `{{#schedules}}
{{begin}}時~{{end}}時 {{rule}}
  {{map1}} {{map2}}
{{/schedules}}`;

const schedulesSpeakTemplate: string = `
直近の{{category}}は
{{#schedules}}
{{begin}}時から{{end}}時までが{{map1}}と{{map2}}の{{rule}}、
{{/schedules}}
だよ。
`.replace(/(\r\n|\n|\r)/gm, "");

export function gachiText(schedules: DomainSchedule[]): AlexaResponse {
  const scheduleParams = schedules.map((s) => {
    return {
      rule: s.rule,
      begin: s.period.start.format("H"),
      end: s.period.end.format("H"),
      map1: s.maps[0].name,
      map2: s.maps[1].name,
    };
  });
  return {
    speakText: mustache.render(schedulesSpeakTemplate, {
      category: "ガチマ",
      schedules: scheduleParams,
    }),
    cardTitle: `直近のガチマ`,
    cardText: mustache.render(schedulesTemplate, {
      schedules: scheduleParams,
    }),
  };
}
