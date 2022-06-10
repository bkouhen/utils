import util from 'util';
import { exec, spawn as childSpawn, spawnSync as childSpawnSync, SpawnOptionsWithoutStdio } from 'child_process';

/**
 * Promisified version of the `child_process` exec function
 *
 * @example
 * ```ts
 * async function lsExample() {
 *   const { stdout, stderr } = await pExec('ls');
 *   console.log('stdout:', stdout);
 *   console.error('stderr:', stderr);
 * }
 * lsExample();
 * ```
 */
export const pExec = util.promisify(exec);

/**
 * Function allowing to create a new spawn child process as an exec command
 *
 * @param command The whole command as written in the shell
 * @param options The options passed to classic spawn functions
 * @returns a stream as a child process
 *
 * @example
 * ```ts
 * const gunzipBase = spawn(`gunzip -c ${assetsPath}/sample.long.csv.gz`]);
 * const pipeBase = gunzipBase.stdout.pipe(lineSplitStream()).pipe(new stream.PassThrough({ objectMode: true }));
 *
 * for await (const data of pipeBase) {
 *  const lineSplit = data.toString().split(',').join('');
 *  resultMap.set(resBase, lineSplit);
 *  resBase += 1;
 * }
 * ```
 */
export const spawn = (command: string, options?: SpawnOptionsWithoutStdio) => {
  if (!command) throw new Error('No command has been filled in');
  let argumentsArray = command.split(' ');
  const baseCommand = argumentsArray.shift();
  return childSpawn(baseCommand!, [...argumentsArray], options);
};

export const spawnSync = (command: string, options?: SpawnOptionsWithoutStdio) => {
  if (!command) throw new Error('No command has been filled in');
  let argumentsArray = command.split(' ');
  const baseCommand = argumentsArray.shift();
  return childSpawnSync(baseCommand!, [...argumentsArray], options);
};
