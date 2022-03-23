import * as logger from '../src';
import {once, sink} from './helper';
import * as sns from './data/sns';

describe('When setting context', () => {
  it('Should include context in output', async () => {
    const stream = sink();

    const log = logger
      .fromContext(sns.event, sns.context, {stream})
      .withContext({foo: {bar: 1}});

    log.info('some information');
    const request = await once(stream);

    expect(request).toMatchObject({
      context: {
        account_id: 'account-id',
        event: {
          id: '916959af-5266-559e-befa-0c1576863e9a',
          source:
            'arn:aws:sns:eu-west-1:account-id:verified-features-s3-bucket-topic',
        },
        foo: {bar: 1},
        function: {name: 'my-function', version: 'v1.0.1', service: 'Unknown'},
        request_id: 'request-id',
      },
      msg: 'some information',
    });
  });
});

describe('When setting context twice', () => {
  it('Should extend existing context', async () => {
    const stream = sink();

    const log = logger
      .fromContext(sns.event, sns.context, {stream})
      .withContext({foo: {bar: 1}})
      .withContext({foo: {baz: 2}});

    log.info('some information');
    const request = await once(stream);

    expect(request).toMatchObject({
      context: {
        account_id: 'account-id',
        event: {
          id: '916959af-5266-559e-befa-0c1576863e9a',
          source:
            'arn:aws:sns:eu-west-1:account-id:verified-features-s3-bucket-topic',
        },
        foo: {bar: 1, baz: 2},
        function: {name: 'my-function', version: 'v1.0.1', service: 'Unknown'},
        request_id: 'request-id',
      },
      msg: 'some information',
    });
  });
});
