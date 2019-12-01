import * as path from 'path';

const projectRoot = path.resolve(__dirname, 'backend');

export default {
  projectRoot,
  cases: {
    validUserConfig_index: ['backend', 'modules', '*', 'index.js'],
    validUserConfig_module: ['backend', 'modules', '*', 'module.js'],
    validPackageJson: projectRoot,
    invalidModulePath: ['backend', 'module.js'],
    invalidPackageJson: path.resolve(__dirname, '..', '..'),
  },
  expected: {},
};
