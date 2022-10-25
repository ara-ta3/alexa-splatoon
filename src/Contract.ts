import * as dayjs from "dayjs";

export interface Shake {
  start: DateTime;
  end: DateTime;
  stageImage: string;
  stageName: string;
  weapons: string[];
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
