import {
  exec,
  execSync,
  spawn as childSpawn,
  SpawnOptionsWithoutStdio,
  spawnSync as childSpawnSync,
} from 'child_process';
import util from 'util';

export class Process {
  /**
   * Promisified version of the `child_process` exec function
   * @param command The whole command as written in the shell
   * @returns: stdout and stderr
   *
   * @example
   * ```ts
   * async function lsExample() {
   *   const { stdout, stderr } = await Process.exec('ls');
   *   console.log('stdout:', stdout);
   *   console.error('stderr:', stderr);
   * }
   * lsExample();
   * ```
   */
  public static async exec(command: string): Promise<{ stdout: string; stderr: string }> {
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
   * Sync version of the `child_process` execSync function
   * @param command The whole command as written in the shell
   * @returns: stdout
   *
   * @example
   * ```ts
   * function lsExample() {
   *   const stdout = Process.execSync('ls');
   *   console.log('stdout:', stdout);
   * }
   * lsExample();
   * ```
   */
  public static execSync(command: string): string {
    try {
      if (!command) {
        throw new Error('No command has been filled in');
      }
      return execSync(command).toString();
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
   *   const ls = Process.spawn('ls -lh /usr');
   *    ls.stdout.on('data', (data) => {
   *      console.log(`stdout: ${data}`);
   *    });
   *
   *    ls.stderr.on('data', (data) => {
   *      console.log(`stderr: ${data}`);
   *    });
   *
   *    ls.on('close', (code) => {
   *      console.log(`child process exited with code ${code}`);
   *    });
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
