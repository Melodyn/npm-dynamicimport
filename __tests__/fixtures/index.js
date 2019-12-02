import * as path from 'path';

const projectRoot = path.resolve(__dirname, 'backend');

export default {
  projectRoot,
  cases: {
    validUserConfig_index: ['backend', 'modules', '*', 'index.js|ts'],
    validUserConfig_module: ['backend', 'modules', '*', 'module.js|ts'],
    validPackageJson: projectRoot,
    invalidModulePath: ['backend', 'module.js|ts'],
    invalidPackageJson: path.resolve(__dirname, '..', '..'),
  },
  expected: {},
};
