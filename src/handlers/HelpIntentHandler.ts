import { HandlerInput, RequestHandler } from "ask-sdk-core";

export const HelpIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput: HandlerInput) {
    const speechText =
      "ステージを聞きたい時は「今のステージを教えて」か「次のステージを教えて」と、シャケを聞きたいときは「シャケを教えて」と、終わりたい時は「おしまい」と言ってください。どうしますか？";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};
