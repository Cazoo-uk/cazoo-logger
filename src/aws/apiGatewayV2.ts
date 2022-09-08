import {
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyEventV2,
  Context,
} from 'aws-lambda';
import {makeContext, LambdaContext} from './context';
import {LoggerOptions} from '../core';
import {AnyEvent} from './anyEvent';

function isApiGatewayV2Event(event: AnyEvent): event is APIGatewayProxyEventV2 {
  return (
    'requestContext' in event && 'stageVariables' in event && 'version' in event
  );
}

function queryParamsStringsToArrays(
  queryParameters?: APIGatewayProxyEventQueryStringParameters
) {
  const transformedQueryParams: {
    [name: string]: string[] | undefined;
  } = {};
  if (!queryParameters) return transformedQueryParams;
  for (const parameterKey in queryParameters) {
    transformedQueryParams[parameterKey] =
      queryParameters[parameterKey]?.split(',');
  }
  return transformedQueryParams;
}

export function forApiGatewayV2(
  event: AnyEvent,
  context: Context,
  options: Partial<LoggerOptions>
): LambdaContext | undefined {
  if (!isApiGatewayV2Event(event)) return;
  return makeContext(context, options, {
    http: {
      method: event.requestContext.http.method,
      path: event.requestContext.http.path,
      query: queryParamsStringsToArrays(event.queryStringParameters),
      routeKey: event.requestContext.routeKey,
      stage: event.requestContext.stage,
    },
  });
}
