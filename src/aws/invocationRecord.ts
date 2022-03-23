import {AnyEvent, InvocationRecord} from './anyEvent';
import {ContextInfo, LambdaContext, makeContext} from './context';
import {Context} from 'aws-lambda';
import {LoggerOptions} from '../core';

export function isInvocationRecord(
  event: AnyEvent
): event is InvocationRecord<unknown> {
  return 'responseContext' in event;
}

interface InvocationRecordContext extends Record<string, unknown> {
  trigger: 'LambdaDestination';
  source: {
    function_arn: string;
    kind: 'OnSuccess' | 'OnFailure';
    request_id: string;
    timestamp: string;
    version: string;
  };
}

function getIsOnSuccess({responseContext}: InvocationRecord<unknown>): boolean {
  return !('functionError' in responseContext);
}

export function forInvocationRecord(
  event: AnyEvent,
  context: Context,
  options: Partial<LoggerOptions>
): LambdaContext | undefined {
  if (!isInvocationRecord(event)) return;

  return makeContext<ContextInfo, InvocationRecordContext>(context, options, {
    trigger: 'LambdaDestination',
    source: {
      function_arn: event.requestContext.functionArn,
      kind: getIsOnSuccess(event) ? 'OnSuccess' : 'OnFailure',
      request_id: event.requestContext.requestId,
      timestamp: event.timestamp,
      version: event.version,
    },
  });
}
