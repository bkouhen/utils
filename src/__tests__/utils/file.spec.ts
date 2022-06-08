import path from 'path';
import stream from 'stream';
import { WinstonLogger } from '../../interfaces/Logger';
import { countLines, countLinesSync, fileExists, countLinesFromStream } from '../../utils/file';

const assetsPath = path.join(__dirname, '..', '/assets');

beforeEach(() => {
  jest.clearAllMocks();
});

const logger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn() } as unknown as WinstonLogger;

describe('fileExists tests', () => {
  test('if fileExists function does work correctly', () => {
    const fileFound = fileExists(`${assetsPath}/sample.json`, false);
    expect(fileFound).toStrictEqual(true);
    const fileNotFound = fileExists(`${assetsPath}/sample.not_found.json`, false, logger);
    expect(fileNotFound).toStrictEqual(false);
    expect(logger.warn).toBeCalledTimes(1);
  });

  test('if fileExists function throws when no file found', () => {
    expect(() => fileExists(`${assetsPath}/sample.not_found.json`, true, logger)).toThrowError();
  });
});

describe('countLinesSync tests', () => {
  test('if it returns the correct number of lines', () => {
    const lines = countLinesSync(`${assetsPath}/sample.json`, true, logger);
    expect(lines).toStrictEqual(21);
  });

  test('if it throws when no file found', () => {
    expect(() => countLinesSync(`${assetsPath}/sample.not_found.json`)).toThrowError();
    expect(() => countLinesSync(`${assetsPath}/sample.not_found.json`, true)).toThrowError();
    expect(() => countLinesSync(`${assetsPath}/sample.not_found.json`, true, logger)).toThrowError();
  });

  test('if it returns -1 when no file found - no throwing', () => {
    expect(countLinesSync('', false)).toStrictEqual(-1);
    expect(logger.warn).toBeCalledTimes(0);
    expect(logger.error).toBeCalledTimes(0);

    expect(countLinesSync(`${assetsPath}/sample.not_found.json`, false, undefined)).toStrictEqual(-1);
    expect(logger.warn).toBeCalledTimes(0);
    expect(logger.error).toBeCalledTimes(0);

    expect(countLinesSync(`${assetsPath}/sample.not_found.json`, false, logger)).toStrictEqual(-1);
    expect(logger.warn).toBeCalledTimes(1);
    expect(logger.error).toBeCalledTimes(1);
  });
});

describe('countLines tests', () => {
  test('if it returns the correct number of lines', async () => {
    const lines = await countLines(`${assetsPath}/sample.json`, true, logger);
    expect(lines).toStrictEqual(21);
  });

  test('if it throws when no file found', async () => {
    await expect(() => countLines(`${assetsPath}/sample.not_found.json`)).rejects.toThrowError();
    await expect(() => countLines(`${assetsPath}/sample.not_found.json`, true)).rejects.toThrowError();
    await expect(() => countLines(`${assetsPath}/sample.not_found.json`, true, logger)).rejects.toThrowError();
  });

  test('if it returns -1 when no file found - no throwing', async () => {
    await expect(countLines('', false)).resolves.toStrictEqual(-1);
    expect(logger.warn).toBeCalledTimes(0);
    expect(logger.error).toBeCalledTimes(0);

    await expect(countLines(`${assetsPath}/sample.not_found.json`, false, undefined)).resolves.toStrictEqual(-1);
    expect(logger.warn).toBeCalledTimes(0);
    expect(logger.error).toBeCalledTimes(0);

    await expect(countLines(`${assetsPath}/sample.not_found.json`, false, logger)).resolves.toStrictEqual(-1);
    expect(logger.warn).toBeCalledTimes(1);
    expect(logger.error).toBeCalledTimes(1);
  });
});

describe('countLinesFromStream tests', () => {
  test('if stream returns the correct number of lines', async () => {
    const readStream = new stream.Readable();
    readStream.push('This is Line1\n');
    readStream.push('This is Line2\n');
    readStream.push('This is Line3\n');
    readStream.push(null);
    const lines = await countLinesFromStream(readStream);
    expect(lines).toStrictEqual(3);
  });
});
