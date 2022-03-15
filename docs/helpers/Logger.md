[../Docs](../../README.md)

# Logger

Declare and use a Logger Helper initialized from winston package

## Usage

```typescript
import { Logger } from '@bkouhen/utils';

const config: LoggerConfigOptions = {
  logLevel: 'debug',
};

const logger = new Logger().initLogger({ ...config });
logger.debug('Hello World');
```

## Logging Levels

Levels are based upon npm logging levels extracted from winston (prioritized from 0 to 6)

```typescript
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};
```

## Logger Config Options

```typescript
interface LoggerConfigOptions {
  logLevel: string;
  errorStack?: boolean;
  debugMode?: boolean;
  debugFormatting?: {
    colors?: boolean;
    pretty?: boolean;
    splat?: boolean;
    json?: boolean;
  };
  defaultMeta?: LoggerDefaultMeta;
  consoleTransport?: {
    enable: boolean;
  };
  fileTransport?: {
    enable: boolean;
    filePath: string;
  };
}
```

## Debug

You can activate the debugMode option in order format the log as a string with additional formatting parameters

```typescript
const logger = new Logger().initLogger({
  logLevel: 'debug',
  debugMode: true,
  errorStack: true,
  debugFormatting: {
    colors: true, // Allows to colorize the output in the console
    pretty: true, // Allows to pretty print the output if json mode is enabled
    json: true, // Allows to print the output as a json object
    splat: true, // Allows to activate string interpolation in the output
  },
});
```

## Default Metadata

The defaultMeta object available in the options can contain whatever property you want. It will be available in Normal Mode as a property of the json object.

```typescript
const logger = new Logger().initLogger({
  logLevel: 'info',
  debugMode: false,
  errorStack: false,
  defaultMeta: {
    prop1: 'val1',
    prop2: 'val2',
  },
});
logger.info('Testing default metadata');
// Output => {"level": "info", "message": "Testing default metadata", "prop1": "val1", "prop2": "val2"}
```

## String Interpolation (SPLAT)

String interpolation is used only in Debug Mode and should be used only if json mode is enabled

It allows to do the following :

```typescript
logger.debug('test in %s mode level %s', 'debug', 5, { myprop: 'myval' });
// Output => debug: test in debug mode level 5 { myprop: 'myval' }
```

## Error Stack

Error Stack can be used in Debug or Normal mode. It allows to parse the error directly in the output.

- Debug :

```typescript
logger.error('test error stack', new Error('My Error'));
// The error will be parsed next to the initial message
```

- Normal :

```typescript
logger.error('test error stack', new Error('My Error'));
// The error will be available in the json object under a stack property
```

## Transports

You can activate 2 different transports mode independently :

- Console Transport :

```typescript
consoleTransport: {
  enable: true;
}
```

- File Transport :

```typescript
fileTransport: {
  enable: true;
  filePath: 'path_to_the_file';
}
```
