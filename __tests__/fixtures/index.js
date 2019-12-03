import * as path from 'path';

const projectRoot = path.resolve(__dirname, 'backend');

export default {
  projectRoot,
  cases: {
    validUserConfig_index: ['modules', '*', 'index.js|ts'],
    validUserConfig_module: ['modules', '*', 'module.js|ts'],
    validPackageJson: projectRoot,
    invalidModulePath: ['module.js|ts'],
    invalidPackageJson: path.resolve(__dirname, '..', '..'),
  },
  expected: {},
};
