import {Context} from 'aws-lambda';
import {Logger, LoggerOptions, PinoLogger, LogExtension} from '../core';
import {forSns} from './sns';
import {forSqs} from './sqs';
import {forApiGateway} from './apiGateway';
import {forCloudFront} from './cloudfront';
import {forDynamo} from './dynamodb';
import {LambdaContext} from './context';
import {forEventBridge, EventBridgeContext} from './eventbridge';
import {AnyEvent} from './anyEvent';
import {forInvocationRecord} from './invocationRecord';

const UNKNOWN = 'unknown';

const empty = () => ({
  context: {
    function: {
      name: UNKNOWN,
      service: UNKNOWN,
      version: UNKNOWN,
    },
    request_id: UNKNOWN,
    account_id: UNKNOWN,
  },
});

function fromContext(event: AnyEvent, ctx: Context, options = {}) {
  const context =
    forApiGateway(event, ctx, options) ||
    forEventBridge(event, ctx, options) ||
    forSns(event, ctx, options) ||
    forCloudFront(event, ctx, options) ||
    forDynamo(event, ctx, options) ||
    forSqs(event, ctx, options) ||
    forInvocationRecord(event, ctx, options) ||
    empty();
  return PinoLogger(options, context);
}

export function contextFactory<
  S extends Logger<SContext>,
  SContext extends Record<string, unknown>
>(
  transform: LogExtension<Logger<LambdaContext>, S, LambdaContext, SContext>
): (event: AnyEvent, ctx: Context, options: Partial<LoggerOptions>) => S {
  return (event: AnyEvent, ctx: Context, options = {}) => {
    return transform(fromContext(event, ctx, options));
  };
}

export {EventBridgeContext, LambdaContext, AnyEvent};
