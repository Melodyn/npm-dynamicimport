import * as path from 'path';
import autoloader from '../../lib';

const correctProjectRoot = path.resolve(__dirname, '..', 'fixtures', 'backend');
const incorrectProjectRoot = path.resolve(__dirname, '..', '..');

describe('Positive cases', () => {
  test('Just test', async () => {
    await expect(autoloader(correctProjectRoot)).resolves.toEqual('ok');
  });
});

describe('Negative cases', () => {
  test('Incorrect arguments', async () => {
    await expect(autoloader(undefined, undefined)).rejects.toThrow('Missing project root');
    await expect(autoloader('/', [])).rejects.toThrow('Not found package.json in /package.json');
    await expect(autoloader(incorrectProjectRoot)).rejects.toThrow(
      "Missing field 'autoload' in /usr/src/app/package.json",
    );
  });
});
