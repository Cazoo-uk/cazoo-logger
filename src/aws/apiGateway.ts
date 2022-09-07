import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import {makeContext, LambdaContext} from './context';
import {LoggerOptions} from '../core';
import {AnyEvent} from './anyEvent';

function isApiGatewayEvent(event: AnyEvent): event is APIGatewayProxyEvent {
  return (
    'requestContext' in event &&
    'stageVariables' in event &&
    'httpMethod' in event
  );
}

export function forApiGateway(
  event: AnyEvent,
  context: Context,
  options: Partial<LoggerOptions>
): LambdaContext | undefined {
  if (!isApiGatewayEvent(event)) return;
  return makeContext(context, options, {
    http: {
      path: event.path,
      connectionId: event.requestContext.connectionId,
      method: event.httpMethod,
      stage: event.requestContext.stage,
      routeKey: event.requestContext.routeKey,
      query: event.multiValueQueryStringParameters,
    },
  });
}
