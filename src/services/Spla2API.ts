import fetch, { Response } from "node-fetch";
import { Shake, Match as DomainSchedule, Splatoon2Matchies } from "../Contract";
import { Period } from "../utils/Period";

const APIEndpoint = "https://spla2.yuu26.com";

interface JsonResponseBody {
  result: {
    regular: Array<Schedule>;
    gachi: Array<Schedule>;
    league: Array<Schedule>;
  };
}

interface Schedule {
  start: string;
  end: string;
  rule: string;
  maps: Array<string>;
  maps_ex: {
    image: string;
  }[];
}

function toDomainSchedule(s: Schedule): DomainSchedule {
  return {
    period: new Period(s.start, s.end),
    rule: s.rule,
    maps: [
      {
        name: s.maps[0],
        image: s.maps_ex[0].image,
      },
      {
        name: s.maps[1],
        image: s.maps_ex[1].image,
      },
    ],
  };
}

interface ShakeResponseBody {
  result: ShakeSchedule[];
}

interface ShakeSchedule {
  start: string;
  end: string;
  stage: {
    image: string;
    name: string;
  };
  weapons: {
    name: string;
  }[];
}

function toDomainShake(shake: ShakeSchedule): Shake {
  return {
    period: new Period(shake.start, shake.end),
    stage: {
      ...shake.stage,
    },
    weapons: shake.weapons.map((w) => w.name),
  };
}

export interface Spla2APIClient {
  getSchedule(): Promise<Splatoon2Matchies>;
  getShake(): Promise<Shake[]>;
}

export class Spla2APIClientImpl implements Spla2APIClient {
  private userAgent: string;
  constructor(userAgent: string) {
    this.userAgent = userAgent;
  }

  async getSchedule(): Promise<Splatoon2Matchies> {
    const response = await this.get(`${APIEndpoint}/schedule`);
    const json: JsonResponseBody = await response.json();
    return {
      regular: json.result.regular.map(toDomainSchedule),
      gachi: json.result.gachi.map(toDomainSchedule),
      league: json.result.league.map(toDomainSchedule),
    };
  }

  async getShake(): Promise<Shake[]> {
    const response = await this.get(`${APIEndpoint}/coop/schedule`);
    const json: ShakeResponseBody = await response.json();
    return json.result.map((x) => toDomainShake(x));
  }

  private async get(url: string): Promise<Response> {
    const response = await fetch(
      url,
      Object.assign({
        method: "GET",
        headers: {
          "User-Agent": this.userAgent,
        },
      })
    );
    return response;
  }
}
