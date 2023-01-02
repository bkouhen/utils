import fs from 'fs-extra';
import path from 'path';
import { ensureDirs } from '../../utils/file';
import { WinstonLogger } from '../Logger/interfaces';
import { Process } from '../Process/Process';
import { generateConfigFile } from './Config';
import { FileName, ScriptConfiguration } from './interfaces';

export class Script {
  constructor(private config: ScriptConfiguration, private logger?: WinstonLogger) {
    this.config.override = this.config.override ?? false;
    this.config.createDockerFiles = this.config.createDockerFiles ?? true;
    this.config.installDependencies = this.config.installDependencies ?? true;
    this.config.runNpmStart = this.config.runNpmStart ?? true;
  }

  public async generateScript(): Promise<void> {
    if (!this.config || !this.config.absolutePath || !this.config.scriptName) {
      throw new Error(`Wrong or missing configuration`);
    }

    const rootDirExists = await fs.pathExists(this.config.absolutePath);
    if (!rootDirExists) {
      throw new Error(`Provided absolute path does not exist`);
    }

    const scriptDir = path.join(this.config.absolutePath, this.config.scriptName);
    const scriptDirExists = await fs.pathExists(scriptDir);

    if (scriptDirExists) {
      if (!this.config.override) {
        throw new Error('Script name already taken, please choose another one');
      }
      await fs.remove(scriptDir);
    }

    const srcDir = path.join(scriptDir, 'src');
    const testsDir = path.join(scriptDir, 'tests');

    await ensureDirs([scriptDir, srcDir, testsDir]);

    await generateConfigFile(FileName.INDEX, srcDir);
    await generateConfigFile(FileName.NPM, scriptDir, { name: this.config.scriptName });
    await generateConfigFile(FileName.JEST, scriptDir, { name: this.config.scriptName });
    await generateConfigFile(FileName.EDITOR_CONFIG, scriptDir);
    await generateConfigFile(FileName.PRETTIER, scriptDir);
    await generateConfigFile(FileName.TYPESCRIPT, scriptDir);

    if (this.config.createDockerFiles) {
      await generateConfigFile(FileName.DOCKERFILE, scriptDir);
      await generateConfigFile(FileName.DOCKER_COMPOSE, scriptDir);
    }

    if (this.config.installDependencies) {
      this.installDependencies(scriptDir);

      if (this.config.runNpmStart) {
        this.runNpmStart(scriptDir);
      }
    }
  }

  private installDependencies(scriptDir: string): { output: string; code: number } {
    try {
      const installDeps = Process.spawnSync(`npm install --prefix ${scriptDir}`);
      const stdout = installDeps.stdout?.toString();
      const stderr = installDeps.stderr?.toString();
      const exitCode = installDeps.status;
      if (exitCode === 0) {
        this.logger?.info('npm packages successfully installed!');
        this.logger?.info(stdout);
      } else {
        this.logger?.error(`there was an issue while installing npm packages: ${stderr}`);
      }
      return exitCode === 0 ? { output: stdout, code: exitCode } : { output: stderr, code: exitCode || 1 };
    } catch (e) {
      this.logger?.error(`Process could not be spawned: ${e.message}`);
      return { output: e.message, code: 1 };
    }
  }

  private runNpmStart(scriptDir: string): { output: string; code: number } {
    try {
      const npmStart = Process.spawnSync(`npm run start:dev --prefix ${scriptDir}`);
      const stdout = npmStart.stdout?.toString();
      const stderr = npmStart.stderr?.toString();
      const exitCode = npmStart.status;
      if (exitCode === 0) {
        this.logger?.info('npm start command succeeded');
        this.logger?.info(stdout);
      } else {
        this.logger?.error(`there was an issue while starting the application: ${stderr}`);
      }
      return exitCode === 0 ? { output: stdout, code: exitCode } : { output: stderr, code: exitCode || 1 };
    } catch (e) {
      this.logger?.error(`Process could not be spawned: ${e.message}`);
      return { output: e.message, code: 1 };
    }
  }
}
