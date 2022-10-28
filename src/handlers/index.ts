import { RequestHandler } from "ask-sdk-core";
import { AlexaSplatoon2 } from "../services/AlexaSplatoon2";
import { AlexaSplatoon3 } from "../services/AlexaSplatoon3";
import { GachiIntent } from "./GachiIntentHandler";
import { HelpIntentHandler } from "./HelpIntentHandler";
import { LaunchHandler } from "./LaunchHandler";
import { NextIntent } from "./NextIntentHandler";
import { SessionEndHandler } from "./SessionEndHandler";
import { ShakeIntent } from "./ShakeHandler";
import { StageIntentHandler } from "./StageIntentHandler";

export const handlers: (
  splatoon2: AlexaSplatoon2,
  splatoon3: AlexaSplatoon3
) => RequestHandler[] = (splatoon2, splatoon3) => [
  StageIntentHandler(splatoon2),
  NextIntent(splatoon3),
  ShakeIntent(splatoon3),
  GachiIntent(splatoon2),
  HelpIntentHandler,
  SessionEndHandler,
  LaunchHandler,
];
