import { SkillBuilders } from "ask-sdk-core";
import { Spla2APIClientImpl } from "./services/Spla2API";
import { CustomSkill } from "ask-sdk-core/dist/skill/CustomSkill";
import { RequestEnvelope } from "ask-sdk-model";

import { AlexaSplatoon2 } from "./services/AlexaSplatoon2";
import { AlexaSplatoon3 } from "./services/AlexaSplatoon3";
import { handlers } from "./handlers";
import { Splatoon3InkAPIClientImpl } from "./services/Splatoon3InkAPI";

let skill: CustomSkill = null;
let splatoon3: AlexaSplatoon3 | null = null;

const handler = async (event: RequestEnvelope, context: any, _: Function) => {
  if (splatoon3 === null) {
    splatoon3 = new AlexaSplatoon3(new Splatoon3InkAPIClientImpl());
  }

  if (skill === null) {
    skill = SkillBuilders.custom()
      .addRequestHandlers(...handlers(splatoon3))
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(JSON.stringify(response));
  return response;
};

export { handler };
