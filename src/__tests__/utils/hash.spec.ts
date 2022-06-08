import { hash } from '../../utils/hash';
import { WinstonLogger } from '../../interfaces/Logger';

beforeEach(() => {
  jest.clearAllMocks();
});

const logger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn() } as unknown as WinstonLogger;

describe('Crypto hash tests', () => {
  test('if it throws an error when algorithm is invalid', () => {
    expect(() => hash('FAKE_ALG', 'this_is_a_great_password', true, undefined, logger)).toThrowError(
      'Digest method not supported',
    );
    expect(logger.error).toBeCalledTimes(1);
  });

  test('if it returns -1 when throw is disabled and algorithm is invalid', () => {
    expect(hash('FAKE_ALG', 'this_is_a_great_password', false, undefined, logger)).toStrictEqual(-1);
    expect(logger.error).toBeCalledTimes(1);
  });

  test('if it hashes correctly in SHA256', () => {
    expect(hash('SHA256', 'this_is_a_great_password', false, undefined, logger)).toStrictEqual(
      '553d054f9e3d3cbf2a88cfb2aece623bf827b5160b40db994691c8dea6dbe33e',
    );
    expect(logger.error).toBeCalledTimes(0);
  });

  test('if it hashes correctly in SHA1', () => {
    expect(hash('SHA1', 'this_is_a_great_password', false, undefined, logger)).toStrictEqual(
      'bf282fd1c9a351e8f4763e5db22690600abb3e5d',
    );
    expect(logger.error).toBeCalledTimes(0);
  });
});
