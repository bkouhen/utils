import { waitFor } from '../../utils/time';

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');
});

afterEach(() => {
  jest.useRealTimers();
});

describe('waitFor function tests', () => {
  test('if waitFor function does wait x seconds before proceeding', async () => {
    waitFor(2000);

    jest.runAllTimers();

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000);
  });
});
