import {
  APIGatewayProxyEvent,
  CloudFrontEvent,
  CloudFrontRequest,
  CloudFrontRequestEvent,
  DynamoDBRecord,
  DynamoDBStreamEvent,
  EventBridgeEvent,
  SNSEvent,
  SNSEventRecord,
  SQSEvent,
  SQSRecord,
} from 'aws-lambda';

interface InvocationRecordOnSuccess<Response, Request = unknown> {
  requestContext: {
    approximateInvokeCount: number;
    condition: string;
    functionArn: string;
    requestId: string;
  };
  requestPayload: Request;
  responseContext: {
    executedVersion: string;
    statusCode: number;
  };
  responsePayload: Response;
  timestamp: string;
  version: string;
}

interface InvocationRecordOnFailure<Request = unknown> {
  requestContext: {
    approximateInvokeCount: number;
    condition: string;
    functionArn: string;
    requestId: string;
  };
  requestPayload: Request;
  responseContext: {
    executedVersion: string;
    functionError: string;
    statusCode: number;
  };
  responsePayload: {
    errorMessage: string;
    errorType: string;
    stackTrace: string[];
  };
  timestamp: string;
  version: string;
}

export type InvocationRecord<Response, Request = unknown> =
  | InvocationRecordOnFailure<Request>
  | InvocationRecordOnSuccess<Response, Request>;

export type AnyEvent =
  | SNSEvent
  | APIGatewayProxyEvent
  | CloudFrontRequestEvent
  | EventBridgeEvent<string, unknown>
  | DynamoDBStreamEvent
  | SQSEvent
  | SQSRecord
  | InvocationRecord<unknown>;

type CloudfrontRecord = {
  cf: CloudFrontEvent & {
    request: CloudFrontRequest;
  };
};

export type AnyRecord =
  | SNSEventRecord
  | DynamoDBRecord
  | SQSRecord
  | CloudfrontRecord;
