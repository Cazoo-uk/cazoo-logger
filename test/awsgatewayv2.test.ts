import * as logger from '../src';
import {sink} from './helper';
import {event, context} from './data/awsgatewayv2';

it('When logging in an API Gateway V2 event context', () => {
  const stream = sink();

  const log = logger.fromContext(event, context, {stream});
  log.info('Hello world');

  const result = stream.read();

  expect(result).toStrictEqual({
    level: 'info',
    context: {
      request_id: context.awsRequestId,
      account_id: event.requestContext.accountId,
      function: {
        name: context.functionName,
        version: context.functionVersion,
        service: 'Unknown',
      },
      http: {
        path: event.requestContext.http.path,
        method: event.requestContext.http.method,
        stage: event.requestContext.stage,
        query: {
          parameter1: 'value1,value2',
          parameter2: 'value',
        },
        routeKey: event.routeKey,
      },
    },
    msg: 'Hello world',
  });
});
