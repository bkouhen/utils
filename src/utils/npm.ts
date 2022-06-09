import fs from 'fs-extra';
import { NpmPackage } from '../interfaces/Npm';

/**
 * Function that allows to generate a formatted package json object
 *
 * @param pkg Npm Package information in object format
 * @returns the formatted Npm Package
 */
export const generateNpmPackage = (pkg: NpmPackage): NpmPackage => {
  const pkgFile: NpmPackage = {
    name: pkg.name,
    version: pkg.version || '0.0.1',
    description: pkg.description || 'No description provided',
    author: pkg.author || 'Boubker El Kouhene',
    main: pkg.main || 'dist/index.js',
    private: pkg.private || false,
    license: pkg.license || 'ISC',
    scripts: pkg.scripts || {
      test: 'jest',
      'test:watch': 'jest --watchAll',
      'test:coverage': 'jest --coverage',
      'test:docker': 'docker-compose run --rm test',
      clean: 'rm -rf node_modules dist',
      build: 'tsc',
      watch: 'tsc -w',
      start: 'tsc && node ./dist/index.js',
      'start:dev': 'ts-node ./src/index.ts',
      'start:docker': 'docker-compose run --rm script',
    },
    devDependencies: pkg.devDependencies || {
      '@types/jest': '27.4.1',
      '@types/node': '17.0.21',
      jest: '27.4.1',
      'ts-jest': '27.1.3',
      'ts-node': '10.7.0',
      typescript: '4.6.2',
    },
    dependencies: pkg.dependencies || {},
  };
  return pkgFile;
};

/**
 * Function that allows to generate the package.json file at the specified path
 *
 * @param filePath absolute path where to generate the file
 * @param pkg Npm Package information in object format
 */
export const generateJSONPackageFile = async (filePath: string, pkg: NpmPackage): Promise<void> => {
  const pkgFile = generateNpmPackage(pkg);
  await fs.writeJSON(filePath, pkgFile, { spaces: 2, EOL: '\n', replacer: null });
};
