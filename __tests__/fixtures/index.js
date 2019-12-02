import * as path from 'path';

const projectRoot = path.resolve(__dirname, 'backend');

export default {
  projectRoot,
  cases: {
    validUserConfig_index: ['backend', 'modules', '*', 'index.*'],
    validUserConfig_module: ['backend', 'modules', '*', 'module.*'],
    validPackageJson: projectRoot,
    invalidModulePath: ['backend', 'module.*'],
    invalidPackageJson: path.resolve(__dirname, '..', '..'),
  },
  expected: {},
};
