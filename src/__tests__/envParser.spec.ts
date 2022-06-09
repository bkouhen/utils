import { array, base64, bool, defaultValue, float, int, json, required, str, env } from '../helpers/env/envParser';

process.env.STRING = 'Hello World';
process.env.ZERO = '0';
process.env.INTEGER = '2000';
process.env.FLOAT = '0.2';
process.env.TRUE_BOOLEAN = 'true';
process.env.FALSE_BOOLEAN = 'false';
process.env.JSON = '{"name":"Mark", "age":23}';

process.env.BASE64 = 'SGVsbG8gV29ybGQ=';
process.env.BASE64_ESCAPE = 'SGVsbG8KV29ybGQ=';

process.env.ARRAY_OF_1 = '1';
process.env.ARRAY_OF_INT = '1,2,3';
process.env.ARRAY_OF_BOOL = 'true,false';
process.env.ARRAY_OF_FLOAT = '0.1;0.2;0.3';
process.env.ARRAY_OF_JSON = '{"name":"Mark","age":23};{"name":"Eren","age":18}';
process.env.ARRAY_ERROR_TYPE = '1,2,coucou,3';
process.env.ARRAY_ERROR_SPACE = '1, 2,3';

describe('Unit Functions tests', () => {
  test('if str function works correctly', () => {
    expect(str('Hello')).toStrictEqual('Hello');
    expect(str('2')).toStrictEqual('2');
    expect(str()).toBeUndefined();
  });

  test('if int function works correctly', () => {
    expect(int('2')).toStrictEqual(2);
    expect(int('0.2')).toStrictEqual(0);
    expect(int('1.6')).toStrictEqual(1);
    expect(int('hello')).toBeUndefined();
    expect(int()).toBeUndefined();
  });

  test('if float function works correctly', () => {
    expect(float('2')).toStrictEqual(2);
    expect(float('0.2')).toStrictEqual(0.2);
    expect(float('1.6')).toStrictEqual(1.6);
    expect(float('hello')).toBeUndefined();
    expect(float()).toBeUndefined();
  });

  test('if bool function works correctly', () => {
    expect(bool('true')).toStrictEqual(true);
    expect(bool('false')).toStrictEqual(false);
    expect(bool('hello')).toBeUndefined();
    expect(bool()).toBeUndefined();
  });

  test('if json function works correctly', () => {
    expect(json('{"name":"Mark", "age":23}')).toStrictEqual({ name: 'Mark', age: 23 });
    expect(json('hello')).toBeUndefined();
    expect(json()).toBeUndefined();
  });

  test('if base64 function works correctly', () => {
    expect(base64()()).toBeUndefined();
    expect(base64()('SGVsbG8gV29ybGQ=')).toStrictEqual('Hello World');
    expect(base64(false)('SGVsbG8KV29ybGQ=')).toStrictEqual('Hello\nWorld');
    expect(base64(true)('SGVsbG8KV29ybGQ=')).toStrictEqual('Hello\\nWorld');
  });

  test('if array function works correctly', () => {
    expect(array(',', str)('1,2,3')).toStrictEqual(['1', '2', '3']);
    expect(array(',', int)('1,2,3')).toStrictEqual([1, 2, 3]);
    expect(array(',', float)('0.1,2,3')).toStrictEqual([0.1, 2, 3]);
    expect(array(';', bool)('true;false')).toStrictEqual([true, false]);
    expect(array(',', str)('1, 2,3')).toStrictEqual(['1', ' 2', '3']);
    expect(array(',', int)('1,2,coucou,3')).toStrictEqual([1, 2, 3]);
    expect(array(';', json)('{"name":"Mark","age":23};{"name":"Eren","age":18}')).toStrictEqual([
      { name: 'Mark', age: 23 },
      { name: 'Eren', age: 18 },
    ]);
    expect(array(',', int)()).toBeUndefined();
    expect(array('', int)('1,2,3')).toBeUndefined();
  });

  test('if defaultValue function works correctly', () => {
    expect(defaultValue(1)(3)).toStrictEqual(3);
    expect(defaultValue(1)()).toStrictEqual(1);
    expect(defaultValue(false)(true)).toStrictEqual(true);
  });

  test('if required function works correctly', () => {
    expect(() => required()).toThrowError();
    expect(required('')).toStrictEqual('');
    expect(required(false)).toStrictEqual(false);
    expect(required({})).toStrictEqual({});
    expect(required([])).toStrictEqual([]);
    expect(required(null)).toStrictEqual(null);
  });
});

describe('Env Parser tests', () => {
  test('if it does parse with no input functions', () => {
    expect(env()('STRING')).toStrictEqual('Hello World');
    expect(env()('')).toBeUndefined();
  });

  test('if it does parse an int', () => {
    expect(env(int)('INTEGER')).toStrictEqual(2000);
    expect(env(int)('ZERO')).toStrictEqual(0);
    expect(env(int)('')).toBeUndefined();
  });

  test('if it does parse a float', () => {
    expect(env(float)('FLOAT')).toStrictEqual(0.2);
    expect(env(float)('')).toBeUndefined();
  });

  test('if it does parse a boolean', () => {
    expect(env(bool)('TRUE_BOOLEAN')).toStrictEqual(true);
    expect(env(bool)('FALSE_BOOLEAN')).toStrictEqual(false);
    expect(env(bool)('')).toBeUndefined();
  });

  test('if it does parse a json', () => {
    expect(env(json)('JSON')).toStrictEqual({ name: 'Mark', age: 23 });
    expect(env(json)('')).toBeUndefined();
  });

  test('if it does parse a base64', () => {
    expect(env(base64(false))('BASE64')).toStrictEqual('Hello World');
    expect(env(base64(false))('BASE64_ESCAPE')).toStrictEqual('Hello\nWorld');
    expect(env(base64(true))('BASE64_ESCAPE')).toStrictEqual('Hello\\nWorld');
    expect(env(base64(false))('')).toBeUndefined();
  });

  test('if it does parse an array', () => {
    expect(env(array(',', int))('ARRAY_OF_INT')).toStrictEqual([1, 2, 3]);
    expect(env(array(',', int))('')).toBeUndefined();
  });

  test('if required throws an error', () => {
    expect(() => env(required)('DOES_NOT_EXIST')).toThrowError(
      'Error while parsing variable DOES_NOT_EXIST: Unable to parse the value, check its type',
    );
  });

  test('if it does take the defaultValue', () => {
    expect(env(defaultValue('Hello Me'))('STRING')).toStrictEqual('Hello World');
    expect(env(defaultValue('Hello Me'))('STRING_NO_EXIST')).toStrictEqual('Hello Me');
  });

  test('if chaining functions works', () => {
    expect(env(str, int)('INTEGER')).toStrictEqual('2000');
    expect(env(int, str, int)('INTEGER')).toStrictEqual(2000);
    expect(env(int, required)('INTEGER')).toStrictEqual(2000);
    expect(() => env(int, required)('INTEGER_NO_EXIST')).toThrowError();
    expect(env(int, bool, json)('INTEGER')).toBeUndefined();
    expect(env(int, defaultValue('10'))('')).toStrictEqual(10);
    expect(env(int, defaultValue('10'), required)('INTEGER')).toStrictEqual(2000);
  });
});
