import path from 'path';
import stream from 'stream';
import { promisify } from 'util';
import { Process } from './Process';

const pipeline = promisify(stream.pipeline);

const cwd = path.join(__dirname);

describe('Exec Tests', () => {
  test('if exec function throws when no command is provided', async () => {
    await expect(Process.exec('')).rejects.toThrowError(/No command has been filled in/);
  });

  test('if exec function throws when wrong command is provided', async () => {
    await expect(Process.exec('wrongcmd')).rejects.toThrowError(/wrongcmd/);
  });

  test('if exec function works correctly', async () => {
    const ls = await Process.exec(`ls ${cwd}`);
    expect(ls.stdout.includes('Process.spec.ts')).toStrictEqual(true);
  });

  test('if execSync function throws when no command is provided', () => {
    expect(() => Process.execSync('')).toThrowError(/No command has been filled in/);
  });

  test('if execSync function throws when wrong command is provided', () => {
    expect(() => Process.execSync('wrongcmd')).toThrowError(/wrongcmd/);
  });

  test('if execSync function works correctly', () => {
    const ls = Process.execSync(`ls ${cwd}`);
    expect(ls.includes('Process.spec.ts')).toStrictEqual(true);
  });
});

describe('Spawn Tests', () => {
  test('if spawn function throws when no command is provided', () => {
    expect(() => Process.spawn('')).toThrowError(/No command has been filled in/);
  });

  test('if spawn function throws when wrong command is provided', async () => {
    const errSpawn = Process.spawn('wrongcmd');
    const errMsg = new Promise((_, reject) => {
      errSpawn.on('error', (e) => reject(e));
    });
    await expect(errMsg).rejects.toThrowError(/wrongcmd/);
  });

  test('if spawn function works correctly', async () => {
    const dataArray: string[] = [];

    const ls = Process.spawn(`ls ${cwd}`);
    await pipeline(
      ls.stdout,
      new stream.Transform({
        transform: (chunk: Buffer, _, next) => {
          const chunks = chunk.toString().split('\n');
          chunks.forEach((c) => {
            dataArray.push(c);
          });
          next(null);
        },
      }),
    );

    expect(dataArray.includes('Process.spec.ts')).toStrictEqual(true);
  });

  test('if spawnSync function throws when no command is provided', () => {
    expect(() => Process.spawnSync('')).toThrowError(/No command has been filled in/);
  });

  test('if spawnSync function throws when wrong command is provided', () => {
    const errSpawn = Process.spawnSync('wrongcmd');
    expect(errSpawn.stdout).toBeNull();
    expect(errSpawn.error).toBeDefined();
    expect(errSpawn.error?.message).toMatch(/wrongcmd/);
  });

  test('if spawnSync function works correctly', () => {
    const ls = Process.spawnSync(`ls ${cwd}`);
    expect(ls.stdout.toString().includes('Process.spec.ts')).toStrictEqual(true);
    expect(ls.stderr.toString()).toBeFalsy();
  });
});
