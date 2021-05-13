import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { helpHandler } from "./HelpIntentHandler";

export const LaunchHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput: HandlerInput) {
    return helpHandler(handlerInput);
  },
};
