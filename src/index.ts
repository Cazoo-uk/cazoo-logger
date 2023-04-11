import {Context} from 'aws-lambda';
import {PinoLogger, Logger, LoggerOptions} from './core';
import {addFluentContext, FluentContext} from './fluentContext';
import {useEventRecorder, EventRecorder} from './eventRecorder';
import {addTimeout, TimeoutLogger} from './timeout';
import {useErrorRecorder, ErrorRecorder} from './errorRecorder';
import {useHttpRecorder, HttpRecorder} from './httpRequest';

import {AnyEvent, contextFactory, LambdaContext} from './aws';

export type CazooLogger = Logger & FluentContext & ErrorRecorder;

export type CazooEventLogger = CazooLogger &
  TimeoutLogger &
  EventRecorder &
  HttpRecorder;

function logger(base: Logger<LambdaContext>): CazooEventLogger {
  return useHttpRecorder(
    useErrorRecorder(useEventRecorder(addTimeout(addFluentContext(base))))
  );
}

export function empty(options = {}): CazooLogger {
  return useErrorRecorder(addFluentContext(PinoLogger(options, {})));
}

export const fromContext = (
  e: AnyEvent,
  c: Context,
  o: Partial<LoggerOptions> = {}
) => {
  const log = contextFactory(logger)(e, c, o);
  log.setTimeout(c);
  return log;
};

export {Level, LoggerOptions} from './core';
export {AnyEvent} from './aws';
