import { pExec, spawn } from '../../utils/process';
import { lineSplitStream } from '../../helpers/stream/streamHelper';
import path from 'path';
import stream from 'stream';

const assetsPath = path.join(__dirname, '/../assets');

describe('Exec and Spawn tests', () => {
  test('if promisified exec function does work correctly', async () => {
    const list = await pExec(`ls ${assetsPath}`);
    expect(list.stdout.includes('sample.json')).toStrictEqual(true);
  });

  test('if spawn throws when no command is provided', async () => {
    await expect(() => spawn('')).toThrowError();
  });

  test('if spawn function works correctly', async () => {
    const list = spawn(`ls ${assetsPath}`);
    const pipe = list.stdout.pipe(lineSplitStream()).pipe(new stream.PassThrough({ objectMode: true }));

    const dataArray = [];

    for await (const data of pipe) {
      dataArray.push(data.toString());
    }

    expect(dataArray.includes('sample.json')).toStrictEqual(true);
  });
});
