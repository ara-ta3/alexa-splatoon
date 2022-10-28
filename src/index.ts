import { SkillBuilders } from "ask-sdk-core";
import { Spla2APIClientImpl } from "./services/Spla2API";
import { CustomSkill } from "ask-sdk-core/dist/skill/CustomSkill";
import { RequestEnvelope } from "ask-sdk-model";

import { AlexaSplatoon2 } from "./services/AlexaSplatoon";
import { handlers } from "./handlers";

let skill: CustomSkill = null;
let splatoon: AlexaSplatoon2 | null = null;

const handler = async (event: RequestEnvelope, context: any, _: Function) => {
  if (splatoon === null) {
    splatoon = new AlexaSplatoon2(
      new Spla2APIClientImpl(process.env.USER_AGENT)
    );
  }

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
