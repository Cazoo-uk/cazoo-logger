# Cazoo Logger

A structured logger for NodeJS based on [pino](https://github.com/pinojs/pino).

## Install

Using NPM:

```
$ npm install @cazoo/logger
```

Using YARN:

```
$ yarn add @cazoo/logger
```

## Usage

Example lambda event handler using logger:

```typescript
import * as Logger from "@cazoo/logger";
import { Context, Handler, ScheduledEvent } from "aws-lambda";

export const onEvent: Handler<ScheduledEvent, void> = async (event, context) => {
  const logger = Logger.fromContext(event, context);
  logger.info({ msg: "Lambda invoked", type: "invoked", data: event });

  try {
    // TODO...
  } catch (error) {
    logger.recordError(error, "Lambda errored");
    throw error;
  }
};
```

For logging an error with level `warn`:

```typescript
try {
  // TODO...
} catch (error) {
  logger.recordErrorAsWarning(error, "Lambda errored, but it's OK");
}
```

### Setting the log level

The available log levels are:
- debug
- info
- warn
- error

As a constructor argument:

```typescript
const loggerOptions = { level: 'info' }
const logger = Logger.fromContext(event, context, loggerOptions);
```

As an environment variable with Terraform:

```hcl
resource "aws_lambda_function" "example_lambda" {
  filename      = "lambda_function_payload.zip"
  function_name = "lambda_function_name"
  role          = aws_iam_role.for_lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs16.x"

  environment {
    variables = {
      CAZOO_LOGGER_LEVEL = "info"
    }
  }
}
```

As an environment variable with Serverless:

```yaml	
service: example
provider: aws
 
functions:
  hello:
    handler: index.handler
    environment:
      CAZOO_LOGGER_LEVEL: "info"
```
