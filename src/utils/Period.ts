import { DateTime } from "./DateTime";

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
