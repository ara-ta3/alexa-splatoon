import { RequestHandler } from "ask-sdk-core";
import { AlexaSplatoon } from "../services/AlexaSplatoon";
import { HelpIntentHandler } from "./HelpIntentHandler";
import { LaunchHandler } from "./LaunchHandler";
import { NextIntent } from "./NextIntentHandler";
import { SessionEndHandler } from "./SessionEndHandler";
import { ShakeIntent } from "./ShakeHandler";
import { StageIntentHandler } from "./StageIntentHandler";

export const handlers: (splatoon: AlexaSplatoon) => RequestHandler[] = (
  splatoon
) => [
  StageIntentHandler(splatoon),
  NextIntent(splatoon),
  ShakeIntent(splatoon),
  HelpIntentHandler,
  SessionEndHandler,
  LaunchHandler,
];
