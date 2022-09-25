import util from 'util';
import { exec, spawn as childSpawn, spawnSync as childSpawnSync, SpawnOptionsWithoutStdio } from 'child_process';

export class Process {
  constructor() {}

  /**
   * Promisified version of the `child_process` exec function
   *
   * @example
   * ```ts
   * async function lsExample() {
   *   const { stdout, stderr } = await Process.pExec('ls');
   *   console.log('stdout:', stdout);
   *   console.error('stderr:', stderr);
   * }
   * lsExample();
   * ```
   */
  public static pExec(command: string) {
    try {
      if (!command) {
        throw new Error('No command has been filled in');
      }
      const promisifiedExec = util.promisify(exec);
      return promisifiedExec(command);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Function allowing to create a new spawn child process as an exec command
   *
   * @param command The whole command as written in the shell
   * @param options The options passed to classic spawn functions
   * @returns a stream as a child process
   *
   * @example
   * ```ts
   * async function lsExample() {
   *   const { stdout, stderr } = await Process.spawn('ls -lh /usr');
   *   console.log('stdout:', stdout);
   *   console.error('stderr:', stderr);
   * }
   * lsExample();
   * ```
   */
  public static spawn(command: string, options?: SpawnOptionsWithoutStdio) {
    try {
      if (!command) {
        throw new Error('No command has been filled in');
      }
      let argumentsArray = command.split(' ');
      const baseCommand = argumentsArray.shift();
      return childSpawn(baseCommand!, [...argumentsArray], options);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Function allowing to create a new spawn child process as an exec command
   *
   * @param command The whole command as written in the shell
   * @param options The options passed to classic spawn functions
   * @returns the output of the child process
   *
   * @example
   * ```ts
   * const result = Process.spawnSync('ls -lh /usr);
   * console.log(result);
   * ```
   */
  public static spawnSync(command: string, options?: SpawnOptionsWithoutStdio) {
    try {
      if (!command) {
        throw new Error('No command has been filled in');
      }
      let argumentsArray = command.split(' ');
      const baseCommand = argumentsArray.shift();
      return childSpawnSync(baseCommand!, [...argumentsArray], options);
    } catch (e) {
      throw e;
    }
  }
}
