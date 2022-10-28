import test from "ava";
import * as dayjs from "dayjs";
import { DateTime } from "../../utils/DateTime";
import { AlexaSplatoon2 } from "../AlexaSplatoon";
import { MockSpla2APIClient } from "./MockSpla2APIClient";

const service = new AlexaSplatoon2(new MockSpla2APIClient());
test.before(async (t) => {
  await service.update();
});

test("stage() returns target rule", (t) => {
  const current = new DateTime("2020-12-31T08:00:00");
  const stage = service.stage(current, false);
  t.not(stage.gachi, undefined);
  t.not(stage.league, undefined);
  t.deepEqual(stage.gachi.period.start.raw, dayjs("2020-12-31T07:00:00"));
  t.deepEqual(stage.league.period.start.raw, dayjs("2020-12-31T07:00:00"));
});

test("stage() returns next target rule", (t) => {
  const current = new DateTime("2020-12-31T08:00:00");
  const stage = service.stage(current, true);
  t.not(stage.gachi, undefined);
  t.not(stage.league, undefined);
  t.deepEqual(stage.gachi.period.start.raw, dayjs("2020-12-31T09:00:00"));
  t.deepEqual(stage.league.period.start.raw, dayjs("2020-12-31T09:00:00"));
});

test("stage() returns undefined when target rule is empty", (t) => {
  const current = new DateTime("2020-12-31T00:00:00");
  const stage = service.stage(current, false);
  t.is(stage.gachi, undefined);
  t.is(stage.league, undefined);
});

test("shake() returns next rule", (t) => {
  const shake = service.shake();
  t.not(shake, null);
  t.deepEqual(shake.period.start.raw, dayjs("2020-12-30T21:00:00"));
});
