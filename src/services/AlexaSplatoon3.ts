import { BankaraMatch, Match, Shake, Splatoon3Matchies } from "../Contract";
import { DateTime } from "../utils/DateTime";
import { Splatoon3InkAPIClient } from "./Splatoon3InkAPI";

export class AlexaSplatoon3 {
  private client: Splatoon3InkAPIClient;

  constructor(client: Splatoon3InkAPIClient) {
    this.client = client;
  }

  async stage(
    current: DateTime,
    nextOrNot: boolean
  ): Promise<BankaraMatch | null> {
    const fixedCurrent = nextOrNot ? current.next() : current;
    const m = await this.client.getMatchies();
    return m.bankara.find((s) => s.challenge.period.in(fixedCurrent)) ?? null;
  }

  async shake(): Promise<Shake> {
    const ss = await this.client.getShake();
    return ss.reduce((prev, current) => {
      const prevStart = prev.period.start.raw;
      const currentStart = current.period.start.raw;
      return prevStart.isBefore(currentStart) ? prev : current;
    });
  }

  async match(targets: DateTime[]): Promise<BankaraMatch[]> {
    const m = await this.client.getMatchies();
    return targets
      .map((d) => m.bankara.find((s) => s.challenge.period.in(d)))
      .filter((x) => x !== undefined);
  }
}
