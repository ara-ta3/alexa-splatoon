import { Match, Shake, Splatoon2Matchies } from "../Contract";
import { DateTime } from "../utils/DateTime";
import { Spla2APIClient } from "./Spla2API";

export class AlexaSplatoon {
  private splatoon2Cache: Splatoon2Matchies;
  private shakeCache: Shake[];
  private client: Spla2APIClient;

  constructor(client: Spla2APIClient) {
    this.client = client;
    this.splatoon2Cache = null;
    this.shakeCache = null;
  }

  empty(): boolean {
    return this.splatoon2Cache === null || this.shakeCache === null;
  }

  async update(): Promise<void> {
    this.splatoon2Cache = await this.client.getSchedule();
    this.shakeCache = await this.client.getShake();
  }

  stage(
    current: DateTime,
    nextOrNot: boolean
  ): { gachi?: Match; league?: Match } {
    const fixedCurrent = nextOrNot ? current.next() : current;
    const gachi = this.splatoon2Cache.gachi.find((s) =>
      s.period.in(fixedCurrent)
    );
    const league = this.splatoon2Cache.league.find((s) =>
      s.period.in(fixedCurrent)
    );
    return {
      gachi: gachi,
      league: league,
    };
  }

  shake(): Shake | null {
    if (this.shakeCache === null || this.shakeCache.length === 0) {
      return null;
    }
    return this.shakeCache.reduce((prev, current) => {
      const prevStart = prev.period.start.raw;
      const currentStart = current.period.start.raw;
      return prevStart.isBefore(currentStart) ? prev : current;
    });
  }

  gachi(targets: DateTime[]): Match[] {
    return targets
      .map((d) => this.splatoon2Cache.gachi.find((s) => s.period.in(d)))
      .filter((x) => x !== undefined);
  }
}
