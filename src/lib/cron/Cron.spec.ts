import { Cron } from './Cron';

describe('Cron Tests', () => {
  test('if convert function throws when no expression is provided', () => {
    expect(() => Cron.convert('')).toThrowError(/No cron expression has been filled in/);
  });

  test('if convert function works correctly', () => {
    const expr1 = '5 0 * 8 *';
    expect(Cron.convert(expr1)).toMatch(/At 12:05 AM, only in August/);
    const expr2 = '15 14 1 * *';
    expect(Cron.convert(expr2)).toMatch(/At 02:15 PM, on day 1 of the month/);
    const expr3 = '0 22 * * 1-5';
    expect(Cron.convert(expr3)).toMatch(/At 10:00 PM, Monday through Friday/);
    const expr4 = '23 0-20/2 * * *';
    expect(Cron.convert(expr4)).toMatch(/At 23 minutes past the hour, every 2 hours, between 12:00 AM and 08:59 PM/);
    const expr5 = '5 4 * * sun';
    expect(Cron.convert(expr5)).toMatch(/At 04:05 AM, only on Sunday/);
  });

  test('if listNextIterations function throws when no expression is provided', () => {
    expect(() => Cron.listNextIterations('')).toThrowError(/No cron expression has been filled in/);
  });

  test('if listNextIterations function works correctly', () => {
    const expr1 = '5 0 * 8 *';
    const nextIterations = Cron.listNextIterations(expr1, 5);
    expect(nextIterations.length).toStrictEqual(5);
  });

  test('if list function works correctly', async () => {
    const crontab = `#NOTHING\n#NOTHING2\n\n#TEST\n* * * * * bash -c "echo Hello >> /tmp/file.txt"\n* * * * * bash -c "echo Hello >> /tmp/file.txt"\n#TEST2\n5 0 * 8 * bash -c "echo Hello >> /tmp/file.txt"\n`;
    const listAll = await Cron.list({ crontab, all: true });
    expect(listAll).toStrictEqual(crontab);

    const filteredList = await Cron.list({ crontab });
    const expectedList = `#TEST\nEvery minute bash -c "echo Hello >> /tmp/file.txt"\nEvery minute bash -c "echo Hello >> /tmp/file.txt"\n\n#TEST2\nAt 12:05 AM, only in August bash -c "echo Hello >> /tmp/file.txt"`;
    expect(filteredList).toStrictEqual(expectedList);
  });
});
