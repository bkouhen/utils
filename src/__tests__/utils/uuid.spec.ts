import { WinstonLogger } from '../../interfaces/Logger';
import { generateUUID, validateUUID, getUUIDVersion } from '../../utils/uuid';

beforeEach(() => {
  jest.clearAllMocks();
});

const logger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn() } as unknown as WinstonLogger;

describe('UUID tests', () => {
  test('if it throws when timestamp is invalid', () => {
    const uniqId = 'email1_clientid1_eventid1_date1';
    const ts = 1654690;
    expect(() => generateUUID(uniqId, ts, true, logger)).toThrowError('');
    expect(logger.error).toBeCalledTimes(0);
  });

  test('if it returns -1 when throwing is disabled and timestamp is invalid', () => {
    const uniqId = 'email1_clientid1_eventid1_date1';
    const ts = 1654690;
    expect(generateUUID(uniqId, ts, false, logger)).toStrictEqual(-1);
    expect(logger.error).toBeCalledTimes(1);
  });

  test('if it generates correct unique identifiers on UUID V1', () => {
    const uniqId1 = 'email1_clientid1_eventid1_date1';
    const ts1 = 1654690725264;

    const uniqId2 = 'email2_clientid2_eventid2_date2';
    const ts2 = 1654690725;

    const uuid1 = generateUUID(uniqId1, ts1, true, logger);
    const uuid2 = generateUUID(uniqId2, ts2, true, logger);

    expect(logger.warn).toBeCalledTimes(1);

    expect((uuid1 as string).length).toStrictEqual((uuid2 as string).length);
    expect((uuid1 as string).length).toStrictEqual(36);

    expect(validateUUID(uuid1.toString())).toStrictEqual(true);
    expect(validateUUID(uuid2.toString())).toStrictEqual(true);

    expect(getUUIDVersion(uuid1.toString())).toStrictEqual(1);
    expect(getUUIDVersion(uuid2.toString())).toStrictEqual(1);

    expect(uuid1).not.toStrictEqual(uuid2);
  });
});
