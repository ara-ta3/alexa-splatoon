import { SkillBuilders } from "ask-sdk-core";
import * as dayjs from 'dayjs'
import {
  JsonResponseBody,
  ShakeResponseBody,
  Spla2APIClientImpl,
} from "./services/Spla2API";
import { isTargetRule, next } from "./Util";
import { gachiAndLeagueText } from "./View";
import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { CustomSkill } from "ask-sdk-core/dist/skill/CustomSkill";
import { RequestEnvelope } from "ask-sdk-model";

import { AlexaSplatoon } from "./services/AlexaSplatoon";
import { Spla2APIClientImpl } from "./services/Spla2API";
import { handlers } from "./handlers";

let skill: CustomSkill = null;

const handler = async (event: RequestEnvelope, context: any, _: Function) => {
  const splatoon = new AlexaSplatoon(
    new Spla2APIClientImpl(process.env.USER_AGENT)
  );

  if (splatoon.empty()) {
    await splatoon.update();
  }

  if (skill === null) {
    skill = SkillBuilders.custom()
      .addRequestHandlers(...handlers(splatoon))
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(JSON.stringify(response));
  return response;
};

export { handler };
