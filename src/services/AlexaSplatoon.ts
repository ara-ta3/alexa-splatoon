import * as dayjs from "dayjs";
import { isTargetRule, next } from "../Util";
import {
  JsonResponseBody,
  Schedule,
  ShakeResponseBody,
  ShakeSchedule,
  Spla2APIClient,
} from "./Spla2API";

export class AlexaSplatoon {
  private cache: JsonResponseBody;
  private shakeCache: ShakeResponseBody;
  private client: Spla2APIClient;

  constructor(client: Spla2APIClient) {
    this.client = client;
    this.cache = null;
    this.shakeCache = null;
  }

  empty(): boolean {
    return this.cache === null || this.shakeCache === null;
  }

  async update(): Promise<void> {
    this.cache = await this.client.getSchedule();
    this.shakeCache = await this.client.getShake();
  }

  stage(
    current: dayjs.Dayjs,
    nextOrNot: boolean
  ): { gachi?: Schedule; league?: Schedule } {
    const fixedCurrent = nextOrNot ? next(current) : current;
    const gachi = this.cache.result.gachi.find((s) =>
      isTargetRule(s, fixedCurrent)
    );
    const league = this.cache.result.league.find((s) =>
      isTargetRule(s, fixedCurrent)
    );
    return {
      gachi: gachi,
      league: league,
    };
  }

  shake(): ShakeSchedule | null {
    if (this.shakeCache === null || this.shakeCache.result.length === 0) {
      return null;
    }
    return this.shakeCache.result.reduce((prev, current) => {
      const prevStart = dayjs(prev.start);
      const currentStart = dayjs(current.start);
      return prevStart.isBefore(currentStart) ? prev : current;
    });
  }

  gachi(targets: dayjs.Dayjs[]): Schedule[] {
    return targets
      .map((d) => this.cache.result.gachi.find((s) => isTargetRule(s, d)))
      .filter((x) => x !== undefined);
  }
}
