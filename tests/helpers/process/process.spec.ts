import { Process } from '../../../src/lib/process/Process';
import { lineSplitStream } from '../../../src/helpers/stream/streamHelper';
import path from 'path';
import stream from 'stream';

const assetsPath = path.join(__dirname, '/../../assets');

describe('Exec Tests', () => {
  test('if pExec function throws when no command is provided', () => {
    expect(() => Process.pExec('')).toThrowError();
  });

  test('if pExec function throws when wrong command is provided', () => {
    expect(Process.pExec('wrongcmd')).rejects.toThrowError();
  });

  test('if pExec function works correctly', async () => {
    const list = await Process.pExec(`ls ${assetsPath}`);
    expect(list.stdout.includes('sample.json')).toStrictEqual(true);
  });
});

describe('Spawn Tests', () => {
  test('if spawn function throws when no command is provided', () => {
    expect(() => Process.spawn('')).toThrowError();
  });

  test('if spawn function throws when wrong command is provided', async () => {
    const errSpawn = Process.spawn('wrongcmd');
    const errMsg: Promise<unknown> = new Promise((_, reject) => {
      errSpawn.on('error', (e) => {
        reject(e);
      });
    });
    expect(errMsg).rejects.toThrowError('spawn wrongcmd ENOENT');
  });

  test('if spawn function works correctly', async () => {
    const listStream = Process.spawn(`ls ${assetsPath}`);
    const pipe = listStream.stdout.pipe(lineSplitStream()).pipe(new stream.PassThrough({ objectMode: true }));

    const dataArray = [];

    for await (const data of pipe) {
      dataArray.push(data.toString());
    }

    expect(dataArray.includes('sample.json')).toStrictEqual(true);
  });

  test('if spawnSync function throws when no command is provided', async () => {
    expect(() => Process.spawnSync('')).toThrowError();
  });

  test('if spawnSync function throws when wrong command is provided', () => {
    const errSpawn = Process.spawnSync('wrongcmd');
    expect(errSpawn.stdout).toBeNull();
    expect(errSpawn.error).toBeDefined();
    expect(errSpawn.error?.message).toStrictEqual('spawnSync wrongcmd ENOENT');
  });

  test('if spawnSync function works correctly', () => {
    const list = Process.spawnSync(`ls ${assetsPath}`);
    expect(list.stdout.toString().includes('sample.json')).toStrictEqual(true);
    expect(list.stderr.toString()).toBeFalsy();
  });
});
