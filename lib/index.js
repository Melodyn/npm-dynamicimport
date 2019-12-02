// @ts-check
import { promises as fs, existsSync } from 'fs';
import * as path from 'path';

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
  console.log({ modulesRawPaths });
  return 'ok';
};

export default autoloader;
