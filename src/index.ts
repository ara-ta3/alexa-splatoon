import { SkillBuilders } from "ask-sdk-core";
import { Spla2APIClientImpl } from "./services/Spla2API";
import { CustomSkill } from "ask-sdk-core/dist/skill/CustomSkill";
import { RequestEnvelope } from "ask-sdk-model";

import { AlexaSplatoon2 } from "./services/AlexaSplatoon2";
import { AlexaSplatoon3 } from "./services/AlexaSplatoon3";
import { handlers } from "./handlers";
import { Splatoon3InkAPIClientImpl } from "./services/Splatoon3InkAPI";

let skill: CustomSkill = null;
let splatoon2: AlexaSplatoon2 | null = null;
let splatoon3: AlexaSplatoon3 | null = null;

const handler = async (event: RequestEnvelope, context: any, _: Function) => {
  if (splatoon2 === null) {
    splatoon2 = new AlexaSplatoon2(
      new Spla2APIClientImpl(process.env.USER_AGENT)
    );
  }
  if (splatoon3 === null) {
    splatoon3 = new AlexaSplatoon3(new Splatoon3InkAPIClientImpl());
  }

  if (splatoon2.empty()) {
    await splatoon2.update();
  }

  if (skill === null) {
    skill = SkillBuilders.custom()
      .addRequestHandlers(...handlers(splatoon2, splatoon3))
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(JSON.stringify(response));
  return response;
};

export { handler };
