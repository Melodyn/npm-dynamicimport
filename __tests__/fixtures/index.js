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
  expected: {
    validUserConfig_index: { default: [{ default: 'this module "a"' }, { default: 'this module "b"' }] },
    validUserConfig_module: { default: [{ default: 'this module "c"' }] },
    validPackageJson: { modules: [{ default: 'this module "b"' }], bobules: [{ default: 'this module "c"' }] },
  },
};
