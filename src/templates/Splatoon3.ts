import * as mustache from "mustache";
import { Shake, BankaraMatch } from "../Contract";
import { DateTime, DateTimeNow } from "../utils/DateTime";

export interface AlexaResponse {
  speakText: string;
  cardTitle: string;
  cardText: string;
  cardImage?: string;
}

const shakeTextTemplate: string = `
シャケは{{startString}}から{{endString}}までで、
ステージは{{stageName}}で、
武器は、{{weapons}}だよ
`.replace(/(\r\n|\n|\r)/gm, "");

export function shakeText(shake: Shake): AlexaResponse {
  const speakText = mustache.render(shakeTextTemplate, {
    startString: shake.period.start.format("M月D日のH時"),
    endString: shake.period.end.format("M月D日のH時"),
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

const matchTemplate: string = `{{#alreadyStarted}}
{{end}}時まで
{{/alreadyStarted}}
{{^alreadyStarted}}
{{begin}}時から{{end}}時まで
{{/alreadyStarted}}
のチャレンジは{{challengeRule}}で、ステージは{{challengeMap1}}と{{challengeMap2}}だよ。
オープンは{{openRule}}で、ステージは{{openMap1}}と{{openMap2}}だよ。
`.replace(/(\r\n|\n|\r)/gm, "");

export function bankaraMatchText(
  targetTime: DateTime,
  m: BankaraMatch,
  now: DateTime = DateTimeNow()
): AlexaResponse {
  const [begin, end] = targetTime.stageRangeHour();
  return {
    speakText: mustache.render(matchTemplate, {
      alreadyStarted: now.raw >= targetTime.raw,
      begin: begin,
      end: end,
      challengeRule: m.challenge.rule,
      challengeMap1: m.challenge.maps[0].name,
      challengeMap2: m.challenge.maps[1].name,
      openRule: m.open.rule,
      openMap1: m.open.maps[0].name,
      openMap2: m.open.maps[1].name,
    }),
    cardTitle: `${begin}時 ~ ${end}時のバンカラマッチ`,
    cardText: [
      `${m.challenge.rule}`,
      m.challenge.maps.map((x) => `- ${x}`).join("\n"),
      `${m.open.rule}`,
      m.open.maps.map((x) => `- ${x}`).join("\n"),
    ].join("\n"),
    cardImage: randomImage(m),
  };
}

function randomImage(m: BankaraMatch): string {
  return random([
    m.challenge.maps[0].image,
    m.challenge.maps[1].image,
    m.open.maps[0].image,
    m.open.maps[1].image,
  ]);
}

function random<T>(as: Array<T>): T {
  return as[Math.floor(Math.random() * as.length)];
}
