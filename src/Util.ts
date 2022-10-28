import { DateTime } from "./utils/DateTime";

export function targetScheduleDates(current: DateTime, n: number): DateTime[] {
  return [...Array(n - 1)].reduce(
    (prev, _, i) => prev.concat(prev[i].next()),
    [current]
  );
}
