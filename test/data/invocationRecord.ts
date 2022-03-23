import {InvocationRecord} from '../../src/aws/anyEvent';
import {baseContext} from './baseContext';

export const context = {
  ...baseContext,
  invokedFunctionArn:
    'arn:aws:lambda:region:account-id:function:function-name:alias-name',
  functionName: 'my-function',
  functionVersion: 'v1.0.1',
  awsRequestId: 'request-id',
  logGroupName: 'log-group',
  logStreamName: 'log-stream',
};

export const onSuccess: InvocationRecord<{data: number}, {input: string}> = {
  requestContext: {
    approximateInvokeCount: 2,
    condition: 'condition',
    functionArn:
      'arn:aws:lambda:region:account-id:function:source-function-name:alias-name',
    requestId: 'source-request-id',
  },
  requestPayload: {input: 'some-data'},
  responseContext: {
    executedVersion: 'v1.1.0',
    statusCode: 200,
  },
  responsePayload: {data: 42},
  timestamp: '2022-01-01',
  version: 'v1.1.0',
};

export const onFailure: InvocationRecord<{data: number}, {input: string}> = {
  requestContext: {
    approximateInvokeCount: 3,
    condition: 'condition',
    functionArn:
      'arn:aws:lambda:region:account-id:function:source-function-name:alias-name',
    requestId: 'source-request-id',
  },
  requestPayload: {input: 'some-data'},
  responseContext: {
    executedVersion: 'v1.1.0',
    statusCode: 500,
    functionError: 'Error',
  },
  responsePayload: {
    errorMessage: 'Something went wrong',
    errorType: 'Error',
    stackTrace: ['On line 1', 'On line 34'],
  },
  timestamp: '2022-01-01',
  version: 'v1.1.0',
};
