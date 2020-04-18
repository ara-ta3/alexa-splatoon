import { Schedule } from "./services/Spla2API";
import * as moment from "moment";

export function isTargetRule(
  schedule: Schedule,
  current: moment.Moment
): boolean {
  const start = moment(schedule.start);
  const end = moment(schedule.end);
  return current.isBetween(start, end);
}

export function next(current: moment.Moment): moment.Moment {
  return current.clone().add(2, "h");
}

export function stageRange(current: moment.Moment): [number, number] {
  const h = current.hour();
  return h % 2 === 0 ? [h - 1, h + 1] : [h, h + 2];
}
