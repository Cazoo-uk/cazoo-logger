import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  CloudFrontEvent,
  CloudFrontRequest,
  CloudFrontRequestEvent,
  DynamoDBRecord,
  DynamoDBStreamEvent,
  EventBridgeEvent,
  S3Event,
  S3EventRecord,
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
  | APIGatewayProxyEventV2
  | CloudFrontRequestEvent
  | EventBridgeEvent<string, unknown>
  | DynamoDBStreamEvent
  | SQSEvent
  | SQSRecord
  | InvocationRecord<unknown>
  | S3Event
  | S3EventRecord;

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
