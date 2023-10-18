import {Context, S3Event, S3EventRecord} from 'aws-lambda';
import {LambdaContext, makeContext} from './context';
import {LoggerOptions} from '../core';
import {AnyEvent, AnyRecord} from './anyEvent';

export function isS3Record(
  record: AnyRecord | AnyEvent
): record is S3EventRecord {
  return 's3' in record;
}

function isS3Event(event: AnyEvent): event is S3Event {
  if (!('Records' in event)) return false;
  if (!Array.isArray(event.Records)) return false;
  return event.Records.length > 0 && isS3Record(event.Records[0]);
}

function ctx(
  record: S3EventRecord,
  context: Context,
  options: Partial<LoggerOptions>
): LambdaContext | undefined {
  return makeContext(context, options, {
    s3: {
      bucketName: record.s3.bucket.name,
      key: record.s3.object.key,
    },
  });
}

export function forS3(
  event: AnyEvent,
  context: Context,
  options: Partial<LoggerOptions>
): LambdaContext | undefined {
  if (isS3Event(event)) return ctx(event.Records[0], context, options);
  if (isS3Record(event)) return ctx(event, context, options);
  return;
}
