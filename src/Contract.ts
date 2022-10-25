import * as dayjs from "dayjs";

export interface Shake {
  period: Period;
  stage: Stage;
  weapons: string[];
}

export interface Schedule {
  period: Period;
  rule: string;
  maps: [Stage, Stage];
}

export interface Stage {
  name: string;
  image: string;
}

export class Period {
  readonly start: DateTime;
  readonly end: DateTime;

  constructor(start: string, end: string) {
    this.start = new DateTime(start);
    this.end = new DateTime(end);
  }

  public in(now: DateTime): boolean {
    return now.raw.isAfter(this.start.raw) && now.raw.isBefore(this.end.raw);
  }
}

export class DateTime {
  readonly raw: dayjs.Dayjs;

  constructor(raw?: string) {
    this.raw = raw === undefined ? dayjs() : dayjs(raw);
  }

  public format(f: string): string {
    return this.raw.format(f);
  }

  public between(start: DateTime, end: DateTime): boolean {
    return this.raw.isAfter(start.raw) && this.raw.isBefore(end.raw);
  }
}

export function DateTimeNow(): DateTime {
  return new DateTime();
}
