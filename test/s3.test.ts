import * as logger from '../src';
import {sink, once} from './helper';
import {record, context} from './data/s3';

it('When logging in an S3 event context', async () => {
  const stream = sink();

  const log = logger.fromContext(record, context, {stream});
  log.info('Hello world');

  const result = await once(stream);

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
      s3: {
        bucketName: record.s3.bucket.name,
        key: record.s3.object.key,
      },
    },
    msg: 'Hello world',
  });
});
