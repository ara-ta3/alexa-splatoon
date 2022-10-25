import test from "ava";
import { gachiAndLeagueText, shakeText } from "../SpeakText";
import { DateTime } from "../utils/DateTime";
import { Period } from "../utils/Period";

test("shake text", (t) => {
  const a = shakeText(
    {
      period: new Period("2021-09-29T17:00:00", "2021-09-29T19:00:00"),
      stage: {
        name: "シャケト場",
        image: "",
      },
      weapons: ["？", "スプラシューター"],
    },
    new DateTime("2021-09-20T17:00:00")
  );
  t.is(
    a.speakText,
    "シャケは9月29日の17時からでステージはシャケト場だよ。武器は、はてな、スプラシューターだよ"
  );
});

test("gachi and league text", (t) => {
  const now = new DateTime("2021-09-29T16:30:00");
  const a = gachiAndLeagueText(
    now.next(),
    {
      period: new Period("2021-09-29T17:00:00", "2021-09-29T19:00:00"),
      rule: "ガチアサリ",
      maps: [
        {
          name: "ホッケふ頭",
          image: "",
        },
        { name: "モンガラキャンプ場", image: "" },
      ],
    },
    {
      period: new Period("2021-09-29T17:00:00", "2021-09-29T19:00:00"),
      rule: "ガチエリア",
      maps: [
        { name: "バッテラストリート", image: "" },
        { name: "ホテルニューオートロ", image: "" },
      ],
    },
    now
  );
  t.is(
    a.speakText,
    "17時から19時までのガチマはガチアサリで、ステージはホッケふ頭とモンガラキャンプ場だよ。リグマはガチエリアで、ステージはバッテラストリートとホテルニューオートロだよ。"
  );
});
