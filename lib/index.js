// @ts-check
import { promises as fs, existsSync } from 'fs';
import * as path from 'path';

/**
 * @param filename {string}
 * @returns {string[]}
 */
const processFileExtensions = filename => {
  const filenameParts = filename.split('.');
  return filenameParts
    .pop()
    .split('|')
    .map(extension => filenameParts.concat(extension).join('.'));
};

/**
 * @param projectRoot {string}
 * @param modulePath {string[]}
 * @returns {Promise<any>}
 */
const buildPaths = async (projectRoot, modulePath, searchFlag = '*') => {
  if (modulePath.length === 0) {
    return projectRoot;
  }
  const [currentPathPart, ...tail] = modulePath;
  if (currentPathPart !== searchFlag) {
    return buildPaths(path.resolve(projectRoot, currentPathPart), tail, searchFlag);
  }

  return fs
    .readdir(projectRoot, { withFileTypes: true })
    .then(includes => includes.filter(obj => obj.isDirectory()))
    .then(includedDirs => includedDirs.map(dir => path.resolve(projectRoot, dir.name)))
    .then(subDirs => Promise.all(subDirs.map(subDir => buildPaths(subDir, tail, searchFlag))))
    .then(paths => paths.flat())
    .catch(() => []);
};

/**
 * @param projectRoot {string}
 * @param modulePath {string[]=}
 * @param moduleName {string=}
 * @returns {Promise<Object<string, string[]>>}
 */
const getModulesRawPaths = async (projectRoot, modulePath = [], moduleName = 'default') => {
  if (!projectRoot) {
    throw new Error('Missing project root');
  }
  if (!existsSync(projectRoot)) {
    throw new Error(`Path ${projectRoot} not exists`);
  }

  const isPackageJsonStrategy = !modulePath || modulePath.length === 0;
  if (isPackageJsonStrategy) {
    const packageJsonFilePath = path.resolve(projectRoot, 'package.json');
    if (!existsSync(packageJsonFilePath)) {
      throw new Error(`Not found package.json in ${packageJsonFilePath}`);
    }
    return fs.readFile(packageJsonFilePath).then(content => {
      const fields = JSON.parse(content.toString());
      if (!Object.hasOwnProperty.call(fields, 'autoload')) {
        throw new Error(`Missing field 'autoload' in ${packageJsonFilePath}`);
      }
      return fields.autoload;
    });
  }

  return {
    [moduleName]: modulePath,
  };
};

/**
 * @param projectRoot {string}
 * @param modulePath {string[]=}
 * @param moduleName {string=}
 * @returns {Promise<string>}
 */
const autoloader = async (projectRoot, modulePath = [], moduleName = 'default') => {
  const modulesRawPaths = await getModulesRawPaths(projectRoot, modulePath, moduleName);
  const modulesPathsFiles = Object.entries(modulesRawPaths).reduce((acc, [moduleName, moduleRawPath]) => {
    const filename = moduleRawPath.pop();
    const processedFilenames = processFileExtensions(filename);
    const pathsWithFiles = processedFilenames.map(filename => moduleRawPath.concat(filename));
    return { ...acc, [moduleName]: pathsWithFiles };
  }, {});
  console.log(JSON.stringify(modulesPathsFiles, null, 2));
  return 'ok';
};

export default autoloader;
