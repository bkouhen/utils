import fs from 'fs-extra';
import { DockerBuildOptions, DockerPushOptions } from '../interfaces/Docker';
import { spawn } from './process';
import chalk from 'chalk';

/**
 * Function that generates a Dockerfile in a specified path
 *
 * @param filePath absolute path of the file to write
 * @param builder_version node builder version to use (default = 14)
 * @param app_version node app version to use (default = 14-slim)
 */
export const generateDockerFile = async (
  filePath: string,
  builder_version: string = '14',
  app_version: string = '14-slim',
): Promise<void> => {
  const content = `FROM node:${builder_version} AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \\
	cmake \\
	&& rm -rf /var/lib/apt/lists/*

COPY . .
RUN rm -rf node_modules dist
RUN npm install && npm cache clean --force
RUN npm run build
RUN npm prune --production

FROM node:${app_version} AS app

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

CMD [ "npm", "run", "start" ]
`;
  await fs.writeFile(filePath, content);
};

/**
 * Function that generates a Docker Compose file in a specified path
 *
 * @param filePath absolute path of the file to write
 * @param node_version node version to use (default = 14)
 */
export const generateDockerComposeFile = async (filePath: string, node_version: string = '14'): Promise<void> => {
  const content = `version: '3.7'

services:
  build:
    image: node:${node_version}
    container_name: build
    working_dir: /app
    volumes:
      - ./:/app
    command: npm run watch

  script:
    image: node:${node_version}
    container_name: script
    working_dir: /app
    volumes:
      - ./:/app
    command: npm run start:dev

  test:
    image: node:${node_version}
    container_name: test
    working_dir: /app
    volumes:
      - ./:/app
    command: npm run test:watch
`;
  await fs.writeFile(filePath, content);
};

export const buildDockerImage = async (options: DockerBuildOptions) => {
  const imageTag = `${options.registry}/${options.scriptName}:${options.version}`.toLowerCase();
  const buildCommand = `docker image build -f ${options.file || 'Dockerfile'} -t ${imageTag} --no-cache ${
    options.context || '.'
  }`;

  console.log(chalk.green('Starting building docker image...'));

  try {
    const exitStatus = await new Promise((resolve, reject) => {
      const imageBuild = spawn(buildCommand);

      imageBuild.stdout.on('data', (data: Buffer) => {
        console.log(chalk.blue(data.toString()));
      });

      imageBuild.stderr.on('data', (data: Buffer) => {
        console.error(chalk.blue(data.toString()));
      });

      imageBuild.on('exit', (exitCode: number) => {
        const resolveMessage = `Spawned Build Process exited with code: ${exitCode}`;
        if (exitCode === 0) {
          return resolve(resolveMessage);
        } else {
          return reject(new Error(resolveMessage));
        }
      });
    });

    console.log(chalk.green(exitStatus));
    console.log(chalk.green(`You can now run: docker image push ${imageTag}`));
    return exitStatus;
  } catch (e) {
    console.error(chalk.red(e));
    throw e;
  }
};

export const pushDockerImage = async (options: DockerPushOptions) => {
  const imageTag = `${options.registry}/${options.scriptName}:${options.version}`.toLowerCase();
  const buildCommand = `docker image push ${imageTag}`;

  console.log(chalk.green('Starting pushing docker image...'));

  try {
    const exitStatus = await new Promise((resolve, reject) => {
      const imagePush = spawn(buildCommand);

      imagePush.stdout.on('data', (data: Buffer) => {
        console.log(chalk.blue(data.toString()));
      });

      imagePush.stderr.on('data', (data: Buffer) => {
        console.error(chalk.blue(data.toString()));
      });

      imagePush.on('exit', (exitCode: number) => {
        const resolveMessage = `Spawned Push Process exited with code: ${exitCode}`;
        if (exitCode === 0) {
          return resolve(resolveMessage);
        } else {
          return reject(new Error(resolveMessage));
        }
      });
    });

    console.log(chalk.green(exitStatus));
    return exitStatus;
  } catch (e) {
    console.error(chalk.red(e));
    throw e;
  }
};
