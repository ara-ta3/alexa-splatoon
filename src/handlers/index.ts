import { RequestHandler } from "ask-sdk-core";
import { AlexaSplatoon3 } from "../services/AlexaSplatoon3";
import { HelpIntentHandler } from "./HelpIntentHandler";
import { LaunchHandler } from "./LaunchHandler";
import { NextIntent } from "./NextIntentHandler";
import { SessionEndHandler } from "./SessionEndHandler";
import { ShakeIntent } from "./ShakeHandler";

export const handlers: (splatoon3: AlexaSplatoon3) => RequestHandler[] = (
  splatoon3
) => [
  NextIntent(splatoon3),
  ShakeIntent(splatoon3),
  HelpIntentHandler,
  SessionEndHandler,
  LaunchHandler,
];
