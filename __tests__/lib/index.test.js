import autoloader from '../../lib';
import fixtures from '../fixtures';

describe('Positive cases', () => {
  test('Load modules', async () => {
    const { cases, expected, projectRoot } = fixtures;
    const recievedValidPackageJson = await autoloader(cases.validPackageJson);
    const recievedValidUserConfig_index = await autoloader(projectRoot, cases.validUserConfig_index);
    const recievedValidUserConfig_module = await autoloader(projectRoot, cases.validUserConfig_module);

    expect(recievedValidPackageJson).toMatchObject(expected.validPackageJson);
    expect(recievedValidPackageJson.modules).toHaveLength(expected.validPackageJson.modules.length);
    expect(recievedValidPackageJson.bobules).toHaveLength(expected.validPackageJson.bobules.length);
    expect(recievedValidPackageJson.bobules[0].default).toEqual(expected.validPackageJson.bobules[0].default);

    expect(recievedValidUserConfig_index).toMatchObject(expected.validUserConfig_index);
    expect(recievedValidUserConfig_index.default).toHaveLength(expected.validUserConfig_index.default.length);
    expect(recievedValidUserConfig_index.default[0].default).toEqual(expected.validUserConfig_index.default[0].default);

    expect(recievedValidUserConfig_module).toMatchObject(expected.validUserConfig_module);
    expect(recievedValidUserConfig_module.default).toHaveLength(expected.validUserConfig_module.default.length);
    expect(recievedValidUserConfig_module.default[0].default).toEqual(
      expected.validUserConfig_module.default[0].default,
    );
  });
});

describe('Negative cases', () => {
  test('Incorrect arguments', async () => {
    const {
      cases: { invalidPackageJson },
    } = fixtures;
    await expect(autoloader(undefined, undefined)).rejects.toThrow('Missing project root');
    await expect(autoloader('/aaaa')).rejects.toThrow('Path /aaaa not exists');
    await expect(autoloader('/', [])).rejects.toThrow('Not found package.json in /package.json');
    await expect(autoloader(invalidPackageJson)).rejects.toThrow(`Missing field 'autoload' in ${invalidPackageJson}`);
  });
});
