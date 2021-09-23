import test from "ava";
import dayjs = require("dayjs");
import { gachiAndLeagueText, shakeText } from "../SpeakText";

test("shake text", (t) => {
  const a = shakeText(
    {
      start: "2021-09-29T17:00:00",
      end: "2021-09-29T19:00:00",
      stage: {
        image: "",
        name: "シャケト場",
      },
      weapons: [
        {
          name: "？",
        },
        {
          name: "スプラシューター",
        },
      ],
    },
    dayjs("2021-09-20T17:00:00")
  );
  t.is(
    a.speakText,
    "シャケは9月29日の17時からでステージはシャケト場だよ。武器は、はてな、スプラシューターだよ"
  );
});

test("gachi and league text", (t) => {
  const a = gachiAndLeagueText(
    dayjs("2021-09-29T17:30:00"),
    {
      start: "2021-09-29T17:00:00",
      end: "2021-09-29T19:00:00",
      rule: "ガチアサリ",
      maps: ["ホッケふ頭", "モンガラキャンプ場"],
      maps_ex: [],
    },
    {
      start: "2021-09-29T17:00:00",
      end: "2021-09-29T19:00:00",
      rule: "ガチエリア",
      maps: ["バッテラストリート", "ホテルニューオートロ"],
      maps_ex: [],
    },
    dayjs("2021-09-29T16:30:00")
  );
  t.is(
    a.speakText,
    "17時から19時までのガチマはガチアサリで、ステージはホッケふ頭とモンガラキャンプ場だよ。リグマはガチエリアで、ステージはバッテラストリートとホテルニューオートロだよ。"
  );
});
