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
 * @param objectsArray {object[]}
 * @returns {*}
 */
const arrayToObject = objectsArray =>
  objectsArray.reduce((acc, obj) => {
    const [[key, value]] = Object.entries(obj);
    return { ...acc, [key]: value };
  }, {});

/**
 * @param projectRoot {string}
 * @param modulePath {string[]}
 * @returns {Promise<string|string[]>}
 */
const buildPaths = async (projectRoot, modulePath, searchFlag = '*') => {
  if (modulePath.length === 0) {
    return existsSync(projectRoot) ? projectRoot : '';
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
  const modulesFilesPathsParts = Object.entries(modulesRawPaths).reduce((acc, [moduleName, moduleRawPath]) => {
    const filename = moduleRawPath.pop();
    const processedFilenames = processFileExtensions(filename);
    const pathsWithFiles = processedFilenames.map(filename => moduleRawPath.concat(filename));
    return { ...acc, [moduleName]: pathsWithFiles };
  }, {});
  const modulesFilesPaths = await Promise.all(
    Object.entries(modulesFilesPathsParts).map(([moduleName, modulePathParts]) =>
      Promise.all(modulePathParts.map(modulePathPart => buildPaths(projectRoot, modulePathPart)))
        .then(paths => paths.flat().filter(modulePath => modulePath))
        .then(existingPaths => ({ [moduleName]: existingPaths })),
    ),
  );
  const modulesFlatFilesPaths = arrayToObject(modulesFilesPaths);
  const availableModules = Object.entries(modulesFlatFilesPaths).reduce(
    (acc, [moduleName, modulePathParts]) =>
      modulePathParts.length === 0 ? acc : { ...acc, [moduleName]: modulePathParts },
    {},
  );
  const modules = await Promise.all(
    Object.entries(availableModules).map(([moduleName, modulePaths]) =>
      Promise.all(modulePaths.map(modulePath => import(modulePath))).then(loadedModules => ({
        [moduleName]: loadedModules,
      })),
    ),
  );
  const flatModules = arrayToObject(modules);
  console.log(flatModules);
  return 'ok';
};

export default autoloader;
