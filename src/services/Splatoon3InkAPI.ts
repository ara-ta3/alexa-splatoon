import fetch from "node-fetch";
import { Shake, Splatoon3Matchies } from "../Contract";
import { Period } from "../utils/Period";

export interface Splatoon3InkAPIClient {
  getMatchies(): Promise<Splatoon3Matchies>;
  getShake(): Promise<Shake[]>;
}

export class Splatoon3InkAPIClientImpl implements Splatoon3InkAPIClient {
  private scheduleCache: ScheduleData | null;
  private translationCache: JPJA | null;
  constructor() {
    this.scheduleCache = null;
    this.translationCache = null;
  }
  async getMatchies(): Promise<Splatoon3Matchies> {
    const ss = await this.getSchedule();
    const t = await this.getTranslation();
    return {
      bankara: ss.bankaraSchedules.nodes.map((n) => {
        const p = new Period(n.startTime, n.endTime);
        const chllenge = n.bankaraMatchSettings.find(
          (x) => x.mode === "CHALLENGE"
        );
        const open = n.bankaraMatchSettings.find((x) => x.mode === "OPEN");
        return {
          challenge: {
            period: p,
            rule: t.rules[chllenge.vsRule.id].name,
            maps: [
              {
                name: t.stages[chllenge.vsStage[0].id].name,
                image: chllenge.vsStage[0].image.url,
              },
              {
                name: t.stages[chllenge.vsStage[1].id].name,
                image: chllenge.vsStage[1].image.url,
              },
            ],
          },
          open: {
            period: p,
            rule: t.rules[open.vsRule.id].name,
            maps: [
              {
                name: t.stages[open.vsStage[0].id].name,
                image: open.vsStage[0].image.url,
              },
              {
                name: t.stages[open.vsStage[1].id].name,
                image: open.vsStage[1].image.url,
              },
            ],
          },
        };
      }),
    };
  }
  async getShake(): Promise<Shake[]> {
    const ss = await this.getSchedule();
    const t = await this.getTranslation();
    return ss.coopGroupingSchedule.regularSchedules.nodes.map((n) => {
      return {
        period: new Period(n.startTime, n.endTime),
        stage: {
          name: t.stages[n.setting.coopStage.id].name,
          image: n.setting.coopStage.image.url,
        },
        weapons: n.setting.weapons.map((w) => {
          return w.name === "Random"
            ? "？"
            : t.weapons[w.__splatoon3ink_id].name;
        }),
      };
    });
  }

  private async getTranslation(): Promise<JPJA> {
    const response = await fetch(
      "https://splatoon3.ink/data/locale/ja-JP.json",
      Object.assign({
        method: "GET",
      })
    );
    this.translationCache = await response.json();
    return this.translationCache;
  }

  private async getSchedule(): Promise<ScheduleData> {
    const response = await fetch(
      "https://splatoon3.ink/data/schedules.json",
      Object.assign({
        method: "GET",
      })
    );
    const json: {
      data: ScheduleData;
    } = await response.json();
    this.scheduleCache = json.data;
    return this.scheduleCache;
  }
}

interface JPJA {
  rules: TranslatedValue;
  stages: TranslatedValue;
  weapons: TranslatedValue;
}

interface TranslatedValue {
  [id: string]: {
    name: string;
  };
}

interface ScheduleData {
  bankaraSchedules: {
    nodes: {
      bankaraMatchSettings: {
        mode: string;
        vsRule: {
          name: string;
          rule: string;
          id: string;
        };
        vsStage: {
          id: string;
          image: {
            url: string;
          };
          name: string;
          vsStageId: number;
        }[];
      }[];
      startTime: string;
      endTime: string;
    }[];
  };
  coopGroupingSchedule: {
    regularSchedules: {
      nodes: {
        startTime: string;
        endTime: string;
        setting: {
          coopStage: {
            name: string;
            id: string;
            coopStageId: number;
            image: {
              url: string;
            };
            thumbnailImage: {
              url: string;
            };
          };
          weapons: {
            image: {
              url: string;
            };
            name: string;
            __splatoon3ink_id: string;
          }[];
        };
      }[];
    };
  };
}
