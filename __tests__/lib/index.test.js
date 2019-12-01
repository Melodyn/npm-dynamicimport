import autoloader from '../../lib';
import fixtures from '../fixtures';

describe('Positive cases', () => {
  test('Just test', async () => {
    const { cases } = fixtures;
    await expect(autoloader(cases.validPackageJson)).resolves.toEqual('ok');
  });
});

describe('Negative cases', () => {
  test('Incorrect arguments', async () => {
    const {
      cases: { invalidPackageJson },
    } = fixtures;
    await expect(autoloader(undefined, undefined)).rejects.toThrow('Missing project root');
    await expect(autoloader('/', [])).rejects.toThrow('Not found package.json in /package.json');
    await expect(autoloader(invalidPackageJson)).rejects.toThrow(
      "Missing field 'autoload' in /usr/src/app/package.json",
    );
  });
});
