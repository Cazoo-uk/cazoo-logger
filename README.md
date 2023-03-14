# Cazoo Logger

A structured logger for NodeJS based on [pino](https://github.com/pinojs/pino).

## Install

Using NPM:

```
$ npm install pino
```

Using YARN:

```
$ yarn add pino
```

## Usage

Example lambda event handler using logger:

```typescript
import * as Logger from "cazoo-logger";
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
