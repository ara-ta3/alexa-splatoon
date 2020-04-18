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
    LaunchRequest: function() {
      this.emit("AMAZON.HelpIntent");
    },
    StageIntent: function() {
      const currentGachi = cache.result.gachi.find(s =>
        isCurrentRule(s, moment())
      );
      const currentLeague = cache.result.league.find(s =>
        isCurrentRule(s, moment())
      );
      if (currentGachi === undefined || currentLeague === undefined) {
        this.emit(":tell", "あれれ、今のガチマかリグマがないよ");
      } else {
        const gachi = `今のガチマは${
          currentGachi.rule
        }で、ステージは${currentGachi.maps.join("と")}だよ。`;
        const league = `そして、リグマは${
          currentLeague.rule
        }で、ステージは${currentLeague.maps.join("と")}だよ。`;
        this.emit(":tell", gachi + league);
      }
    },
    NextIntent: function() {
      const currentGachi = cache.result.gachi.find(s =>
          isNextRule(s, moment())
      );
      const currentLeague = cache.result.league.find(s =>
          isNextRule(s, moment())
      );
      if (currentGachi === undefined || currentLeague === undefined) {
        this.emit(":tell", "あれれ、今のガチマかリグマがないよ");
      } else {
        const text = `今のガチマは${
            currentGachi.rule
        }で、ステージは${currentGachi.maps.join("と")}だよ。そして、リグマは${
            currentLeague.rule
        }で、ステージは${currentLeague.maps.join("と")}だよ。`;
        this.emit(":tell", text);
      }
    },
    "AMAZON.HelpIntent": function() {
      this.emit(
        ":ask",
        "ステージを聞きたい時は「今のステージを教えて」か「次のステージを教えて」と、終わりたい時は「おしまい」と言ってください。どうしますか？",
      );
    },
    "AMAZON.CancelIntent": function() {
      this.emit(":tell", "さようなら");
    },
    "AMAZON.StopIntent": function() {
      this.emit(":tell", "さようなら");
    }
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
            "User-Agent": this.userAgent
          }
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
function isCurrentRule(schedule: Schedule, current: moment.Moment): boolean {
  const start = moment(schedule.start);
  const end = moment(schedule.end);
  return current.isBetween(start, end);
}

function isNextRule(schedule: Schedule, current: moment.Moment): boolean {
  const start = moment(schedule.start);
  const end = moment(schedule.end);
  const next = current.add(2, 'h')
  return next.isBetween(start, end);
}
