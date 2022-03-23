import * as logger from '../src';
import {sink} from './helper';
import {onSuccess, context, onFailure} from './data/invocationRecord';

describe('When logging in an invocation record context', () => {
  const now = Date.now();
  const dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => now);

  afterAll(() => {
    dateSpy.mockRestore();
  });

  describe('When from successful invocation', () => {
    beforeEach(async () => {});

    it('should log the hello world message', async () => {
      const stream = sink(true);

      const p = new Promise<string>(resolve => {
        stream.on('data', resolve);
      });

      const log = logger.fromContext(onSuccess, context, {stream});
      log.info('Hello world');
      const result = JSON.parse(await p);

      expect(result).toStrictEqual({
        level: 'info',
        context: {
          request_id: context.awsRequestId,
          account_id: 'account-id',
          function: {
            name: context.functionName,
            version: context.functionVersion,
            service: 'Unknown',
          },
          source: {
            function_arn:
              'arn:aws:lambda:region:account-id:function:source-function-name:alias-name',
            kind: 'OnSuccess',
            request_id: 'source-request-id',
            timestamp: '2022-01-01',
            version: 'v1.1.0',
          },
          trigger: 'LambdaDestination',
        },
        msg: 'Hello world',
      });
    });
  });

  describe('When from failed invocation', () => {
    it('should log the hello world message', async () => {
      const stream = sink(true);

      const p = new Promise<string>(resolve => {
        stream.on('data', resolve);
      });

      const log = logger.fromContext(onFailure, context, {stream});
      log.info('Hello world');
      const result = JSON.parse(await p);

      expect(result).toStrictEqual({
        level: 'info',
        context: {
          request_id: context.awsRequestId,
          account_id: 'account-id',
          function: {
            name: context.functionName,
            version: context.functionVersion,
            service: 'Unknown',
          },
          source: {
            function_arn:
              'arn:aws:lambda:region:account-id:function:source-function-name:alias-name',
            kind: 'OnFailure',
            request_id: 'source-request-id',
            timestamp: '2022-01-01',
            version: 'v1.1.0',
          },
          trigger: 'LambdaDestination',
        },
        msg: 'Hello world',
      });
    });
  });
});
