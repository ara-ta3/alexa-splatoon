import test from "ava";
import dayjs = require("dayjs");
import { shakeText } from "../SpeakText";

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
    "シャケは9月29日の17時からでステージはシャケト場だよ。武器ははてな、スプラシューターだよ"
  );
});
