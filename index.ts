import * as Alexa from "alexa-sdk";
import * as request from "request";
import moment = require("moment");

let cache: JsonResponseBody = null;

const handler = async (event: any, context: any, _: Function) => {
  const client = new Spla2APIClientImpl(request, process.env.USER_AGENT);
  if (cache === null) {
    cache = await client.getSchedule();
  }
  const handlers = {
    LaunchRequest: function () {
      this.emit("AMAZON.HelpIntent");
    },
    StageIntent: function () {
      const gachi = cache.result.gachi.find((s) => isTargetRule(s, moment()));
      const league = cache.result.league.find((s) => isTargetRule(s, moment()));
      if (gachi === undefined || league === undefined) {
        this.emit(":tell", "あれれ、今のガチマかリグマがないよ");
      } else {
        const gachiMap = gachi.maps.join("と");
        const leagueMap = league.maps.join("と");
        const text = `今のガチマは${gachi.rule}で、ステージは${gachiMap}だよ。リグマは${league.rule}で、ステージは${leagueMap}だよ。`;
        this.response.speak(text);
        this.response.cardRenderer(
          "今のガチマとリグマ",
          [
            `${gachi.rule}`,
            gachi.maps.map((x) => `- ${x}`).join("\n"),
            `${league.rule}`,
            league.maps.map((x) => `- ${x}`).join("\n"),
          ].join("\n")
        );
        this.emit(":responseReady");
      }
    },
    NextIntent: function () {
      const nextTime = next(moment());
      const gachi = cache.result.gachi.find((s) => isTargetRule(s, nextTime));
      const league = cache.result.league.find((s) => isTargetRule(s, nextTime));
      if (gachi === undefined || league === undefined) {
        this.emit(":tell", "あれれ、今のガチマかリグマがないよ");
      } else {
        const gachiMap = gachi.maps.join("と");
        const leagueMap = league.maps.join("と");
        const [begin, end] = stageRange(nextTime);
        const text = `次の${begin}時から${end}時までのガチマは${gachi.rule}で、ステージは${gachiMap}だよ。リグマは${league.rule}で、ステージは${leagueMap}だよ。`;
        this.response.speak(text);
        this.response.cardRenderer(
          "次のガチマとリグマ",
          [
            `${gachi.rule}`,
            gachi.maps.map((x) => `- ${x}`).join("\n"),
            `${league.rule}`,
            league.maps.map((x) => `- ${x}`).join("\n"),
          ].join("\n")
        );
        this.emit(":responseReady");
      }
    },
    "AMAZON.HelpIntent": function () {
      this.emit(
        ":ask",
        "ステージを聞きたい時は「今のステージを教えて」か「次のステージを教えて」と、終わりたい時は「おしまい」と言ってください。どうしますか？"
      );
    },
    "AMAZON.CancelIntent": function () {
      this.emit(":tell", "さようなら");
    },
    "AMAZON.StopIntent": function () {
      this.emit(":tell", "さようなら");
    },
  };

  const alexa = Alexa.handler(event, context);
  alexa.appId = process.env.ALEXA_APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

export { handler };

type RequestAPI = request.RequestAPI<
  request.Request,
  request.CoreOptions,
  request.RequiredUriUrl
>;

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
}

export interface Spla2APIClient {
  getSchedule(): Promise<JsonResponseBody>;
}

export class Spla2APIClientImpl implements Spla2APIClient {
  private request: RequestAPI;
  private userAgent: string;
  constructor(request: RequestAPI, userAgent: string) {
    this.request = request;
    this.userAgent = userAgent;
  }

  async getSchedule(): Promise<JsonResponseBody> {
    const body = await this.get(`${APIEndpoint}/schedule`);
    return JSON.parse(body);
  }

  private get(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.request(
        {
          url: url,
          method: "GET",
          headers: {
            "User-Agent": this.userAgent,
          },
        },
        (error, response, body) => {
          if (!error && response.statusCode === 200) {
            resolve(body);
          } else {
            reject(response);
          }
        }
      );
    });
  }
}
function isTargetRule(schedule: Schedule, current: moment.Moment): boolean {
  const start = moment(schedule.start);
  const end = moment(schedule.end);
  return current.isBetween(start, end);
}

function next(current: moment.Moment): moment.Moment {
  return current.clone().add(2, "h");
}

function stageRange(current: moment.Moment): [number, number] {
  const h = current.hour();
  return h % 2 === 0 ? [h - 1, h + 1] : [h, h + 2];
}
