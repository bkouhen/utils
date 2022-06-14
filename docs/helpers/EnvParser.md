[../Docs](../../README.md)

# Environment Variable Parser

Parse your environment variable into chosen formats and use them in your scripts as config properties

## Usage

### Transformers

- String

```typescript
import { env, str } from '@bkouhen/utils';

process.env.MY_STRING = 'Hello';
process.env.MY_INTEGER = '2';
process.env.MY_BOOLEAN = 'false';

env(str)('MY_STRING'); // Returns 'Hello' as a string
env(str)('MY_INTEGER'); // Returns '2' as a string
env(str)('MY_BOOLEAN'); // Returns 'false' as a string
```

- Integer

```typescript
import { env, int } from '@bkouhen/utils';

process.env.MY_INTEGER = '2';
process.env.MY_FLOAT = '2.5';

env(int)('MY_INTEGER'); // Returns 2 as a number
env(int)('MY_FLOAT'); // Returns 2 as a number
```

- Float

```typescript
import { env, float } from '@bkouhen/utils';

process.env.MY_FLOAT = '2.5';

env(float)('MY_FLOAT'); // Returns 2.5 as a number
```

- Boolean

```typescript
import { env, bool } from '@bkouhen/utils';

process.env.MY_BOOLEAN = 'false';

env(bool)('MY_BOOLEAN'); // Returns false as a boolean
```

- Json

```typescript
import { env, json } from '@bkouhen/utils';

process.env.MY_JSON = '{"name":"Mark", "age":23}';

env(json)('MY_JSON'); // Returns the parsed json object { name: 'Mark', age: 23 }
```

- Base64

```typescript
import { env, base64 } from '@bkouhen/utils';

process.env.BASE64 = 'SGVsbG8gV29ybGQ=';
process.env.BASE64_ESCAPE = 'SGVsbG8KV29ybGQ=';

env(base64())('BASE64'); // Returns 'Hello World' as a string
env(base64())('BASE64_ESCAPE'); // Returns 'Hello\nWorld' as a string
env(base64(true))('BASE64_ESCAPE'); // Returns 'Hello\\nWorld' as a string
```

- Array

```typescript
import { env, array, int } from '@bkouhen/utils';

process.env.ARRAY_OF_INT = '1,2,3';

env(array(',', int))('ARRAY_OF_INT'); // Returns [1,2,3] as an array of integers
```

- Required

```typescript
import { env, required } from '@bkouhen/utils';

env(required)('DOES_NOT_EXIST'); // Throws an error if the environment variable is not parseable
```

- Default Value

```typescript
import { env, defaultValue } from '@bkouhen/utils';

process.env.MY_STRING = 'Hello All';

env(defaultValue('Hello You'))('MY_STRING'); // Returns 'Hello All' as the environment variable is parseable
env(defaultValue('Hello You'))('MY_STRING2'); // Returns 'Hello You' as the environment variable is not parseable
```

### Chaining

You can chain multiple transformer functions in order to get the desired format for you variable

```typescript
import { env, str, int, required, defaultValue } from '@bkouhen/utils';

process.env.MY_INTEGER = '2000';

env(str, int)('MY_INTEGER'); // Returns '2000' as a string
env(int, str, int)('MY_INTEGER'); // Returns 2000 as a number
env(int, required)('MY_INTEGER'); // Returns 2000 as a number
env(int, defaultValue('10'))(''); // Returns 10 as a number
env(int, defaultValue('10'), required)('MY_INTEGER'); // Returns 2000 as a number
```
