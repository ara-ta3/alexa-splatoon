import fetch, { Response } from "node-fetch";
import { Shake, Schedule as DomainSchedule } from "../Contract";
import { Period } from "../utils/Period";

const APIEndpoint = "https://spla2.yuu26.com";

export interface JsonResponseBody {
  result: {
    regular: Array<Schedule>;
    gachi: Array<Schedule>;
    league: Array<Schedule>;
  };
}

export interface Schedule {
  start: string;
  end: string;
  rule: string;
  maps: Array<string>;
  maps_ex: {
    image: string;
  }[];
}

export function toDomainSchedule(s: Schedule): DomainSchedule {
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

export interface ShakeResponseBody {
  result: ShakeSchedule[];
}

export interface ShakeSchedule {
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

export function toDomainShake(shake: ShakeSchedule): Shake {
  return {
    period: new Period(shake.start, shake.end),
    stage: {
      ...shake.stage,
    },
    weapons: shake.weapons.map((w) => w.name),
  };
}

export interface Spla2APIClient {
  getSchedule(): Promise<JsonResponseBody>;
  getShake(): Promise<ShakeResponseBody>;
}

export class Spla2APIClientImpl implements Spla2APIClient {
  private userAgent: string;
  constructor(userAgent: string) {
    this.userAgent = userAgent;
  }

  async getSchedule(): Promise<JsonResponseBody> {
    const response = await this.get(`${APIEndpoint}/schedule`);
    return response.json();
  }

  async getShake(): Promise<ShakeResponseBody> {
    const response = await this.get(`${APIEndpoint}/coop/schedule`);
    return response.json();
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
