import * as dayjs from "dayjs";

export class DateTime {
  readonly raw: dayjs.Dayjs;

  constructor(raw?: string | dayjs.Dayjs) {
    this.raw = raw === undefined ? dayjs() : dayjs(raw);
  }

  public format(f: string): string {
    return this.raw.format(f);
  }

  public between(start: DateTime, end: DateTime): boolean {
    return this.raw.isAfter(start.raw) && this.raw.isBefore(end.raw);
  }

  // TODO not util?
  public stageRangeHour(): [number, number] {
    const h = this.raw.hour();
    return h % 2 === 0 ? [(24 + h - 1) % 24, h + 1] : [h, h + 2];
  }

  public next(): DateTime {
    const r = this.raw.clone().add(2, "h");
    return new DateTime(r);
  }
}

export function DateTimeNow(): DateTime {
  return new DateTime();
}
