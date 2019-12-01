export default {
  cases: {
    fromUserConfig_index: ['backend', 'modules', '*', 'index.js'],
    fromUserConfig_module: ['backend', 'modules', '*', 'module.js'],
    fromPackageJson: './backend',
    invalidPath: ['backend', 'module.js'],
  },
  expected: {},
};
