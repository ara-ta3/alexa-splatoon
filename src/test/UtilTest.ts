import test from "ava";
import * as dayjs from "dayjs";
import { Schedule } from "../services/Spla2API";

import { isTargetRule, stageRange, targetScheduleDates } from "../Util";

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

test("stageRange returns 23 hour on 0 o'clock", (t) => {
  const d = dayjs("2021-09-22T00:00:00");
  const [start, end] = stageRange(d);
  t.is(start, 23);
  t.is(end, 1);
});

test("stageRange returns 3 hour on 4 o'clock", (t) => {
  const d = dayjs("2021-09-22T04:00:00");
  const [start, end] = stageRange(d);
  t.is(start, 3);
  t.is(end, 5);
});

test("stageRange returns 3 hour on 3 o'clock", (t) => {
  const d = dayjs("2021-09-22T03:00:00");
  const [start, end] = stageRange(d);
  t.is(start, 3);
  t.is(end, 5);
});

test("target shcedule dates return 5 dates", (t) => {
  const d = dayjs("2021-09-22T01:30:00");
  const a = targetScheduleDates(d, 5);
  t.deepEqual(a, [
    dayjs("2021-09-22T01:30:00"),
    dayjs("2021-09-22T03:30:00"),
    dayjs("2021-09-22T05:30:00"),
    dayjs("2021-09-22T07:30:00"),
    dayjs("2021-09-22T09:30:00"),
  ]);
});
