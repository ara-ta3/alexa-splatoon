import test from "ava";
import { DateTime } from "../../utils/DateTime";
import { Period } from "../../utils/Period";
import { bankaraMatchText, shakeText } from "../Splatoon3";

test("Bankara Match Test", (t) => {
  const now = new DateTime("2021-09-29T16:30:00");
  const a = bankaraMatchText(
    now.next(),
    {
      challenge: {
        period: new Period("2021-09-29T17:00:00", "2021-09-29T19:00:00"),
        rule: "ガチアサリ",
        maps: [
          {
            name: "A",
            image: "",
          },
          { name: "B", image: "" },
        ],
      },
      open: {
        period: new Period("2021-09-29T17:00:00", "2021-09-29T19:00:00"),
        rule: "ガチエリア",
        maps: [
          { name: "C", image: "" },
          { name: "D", image: "" },
        ],
      },
    },
    now
  );
  t.is(
    a.speakText,
    "17時から19時までのチャレンジはガチアサリで、ステージはAとBだよ。オープンはガチエリアで、ステージはCとDだよ。"
  );
});

test("Shake", (t) => {
  const a = shakeText({
    period: new Period("2021-09-29T17:00:00", "2021-09-29T19:00:00"),
    stage: {
      name: "シャケト場",
      image: "",
    },
    weapons: ["？", "スプラシューター"],
  });
  t.is(
    a.speakText,
    "シャケは9月29日の17時から9月29日の19時までで、ステージはシャケト場で、武器は、はてな、スプラシューターだよ"
  );
});
