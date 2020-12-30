import test from "ava";
import * as dayjs from "dayjs";
import { Schedule } from "../services/Spla2API";

import { isTargetRule } from "../Util";

test("isTargetRule returns true when current time is between start and end", (t) => {
  const s: Schedule = {
    start: "2020-12-29T17:00:00",
    end: "2020-12-29T19:00:00",
    rule: "ガチアサリ",
    maps: ["ホテルニューオートロ", "アジフライスタジアム"],
    maps_ex: [
      {
        image: "",
      },
      {
        image: "",
      },
    ],
  };
  const actual = isTargetRule(s, dayjs("2020-12-29T18:00:00"));
  t.true(actual);
});

test("isTargetRule returns false when current time is out of start and end", (t) => {
  const s: Schedule = {
    start: "2020-12-29T17:00:00",
    end: "2020-12-29T19:00:00",
    rule: "ガチアサリ",
    maps: ["ホテルニューオートロ", "アジフライスタジアム"],
    maps_ex: [
      {
        image: "",
      },
      {
        image: "",
      },
    ],
  };
  const actual = isTargetRule(s, dayjs("2020-12-29T23:00:00"));
  t.false(actual);
});
