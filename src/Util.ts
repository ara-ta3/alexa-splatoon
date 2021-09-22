import { Schedule } from "./services/Spla2API";
import * as dayjs from "dayjs";

export function isTargetRule(
  schedule: Schedule,
  current: dayjs.Dayjs
): boolean {
  const start = dayjs(schedule.start);
  const end = dayjs(schedule.end);
  return current.isAfter(start) && current.isBefore(end);
}

export function next(current: dayjs.Dayjs): dayjs.Dayjs {
  return current.clone().add(2, "h");
}

export function stageRange(current: dayjs.Dayjs): [number, number] {
  const h = current.hour();
  return h % 2 === 0 ? [(24 + h - 1) % 24, h + 1] : [h, h + 2];
}
