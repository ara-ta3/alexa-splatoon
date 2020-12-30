import test from "ava";
import * as dayjs from "dayjs";
import { AlexaSplatoon } from "../AlexaSplatoon";
import { MockSpla2APIClient } from "./MockSpla2APIClient";

const service = new AlexaSplatoon(new MockSpla2APIClient());
test.before(async (t) => {
  await service.update();
});

test("stage() returns target rule", (t) => {
  const current = dayjs("2020-12-31T08:00:00");
  const stage = service.stage(current, false);
  t.not(stage.gachi, undefined);
  t.not(stage.league, undefined);
  t.is(stage.gachi.start, "2020-12-31T07:00:00");
  t.is(stage.league.start, "2020-12-31T07:00:00");
});

test("stage() returns next target rule", (t) => {
  const current = dayjs("2020-12-31T08:00:00");
  const stage = service.stage(current, true);
  t.not(stage.gachi, undefined);
  t.not(stage.league, undefined);
  t.is(stage.gachi.start, "2020-12-31T09:00:00");
  t.is(stage.league.start, "2020-12-31T09:00:00");
});

test("stage() returns undefined when target rule is empty", (t) => {
  const current = dayjs("2020-12-31T00:00:00");
  const stage = service.stage(current, false);
  t.is(stage.gachi, undefined);
  t.is(stage.league, undefined);
});

test("shake() returns next rule", (t) => {
  const shake = service.shake();
  t.not(shake, null);
  t.is(shake.start, "2020-12-30T21:00:00");
});
