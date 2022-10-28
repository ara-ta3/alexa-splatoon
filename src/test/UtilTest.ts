import test from "ava";

import { targetScheduleDates } from "../Util";
import { DateTime } from "../utils/DateTime";

test("target shcedule dates return 5 dates", (t) => {
  const d = new DateTime("2021-09-22T01:30:00");
  const a = targetScheduleDates(d, 5);
  t.deepEqual(a, [
    new DateTime("2021-09-22T01:30:00"),
    new DateTime("2021-09-22T03:30:00"),
    new DateTime("2021-09-22T05:30:00"),
    new DateTime("2021-09-22T07:30:00"),
    new DateTime("2021-09-22T09:30:00"),
  ]);
});
