import CustomJestConfigLoader from '../../../src/configLoaders/CustomJestConfigLoader';
import * as sinon from 'sinon';
import { expect, assert } from 'chai';
import * as path from 'path';
import * as fs from 'fs';

const fakeRequire: any = {
  require: () => { }
};

describe(`${CustomJestConfigLoader.name} integration`, () => {
  let sut: CustomJestConfigLoader;
  const projectRoot: string = '/path/to/project/root';
  const fsStub: FsStub = {};
  let requireStub: sinon.SinonStub;

  beforeEach(() => {
    fsStub.readFileSync = sinon.stub(fs, 'readFileSync');
    requireStub = sinon.stub(fakeRequire, 'require');

    fsStub.readFileSync.returns('{ "jest": { "exampleProperty": "examplePackageJsonValue" }}');
    requireStub.returns({ exampleProperty: 'exampleJestConfigValue' });

    sut = new CustomJestConfigLoader(projectRoot, fs, fakeRequire.require);
  });

  it('should load the Jest configuration from the jest.config.js in the projectroot', () => {
    const config = sut.loadConfig();

    assert(requireStub.calledWith(path.join(projectRoot, 'jest.config.js')), `loader not called with ${projectRoot}/jest.config.js`);
    expect(config).to.deep.equal({
      exampleProperty: 'exampleJestConfigValue'
    });
  });

  it('should fallback and load the Jest configuration from the package.json when jest.config.js is not present in the project', () => {
    requireStub.throws(Error('ENOENT: no such file or directory, open package.json'));
    const config = sut.loadConfig();

    assert(fsStub.readFileSync.calledWith(path.join(projectRoot, 'package.json'), 'utf8'), `readFileSync not called with ${projectRoot}/package.json`);
    expect(config).to.deep.equal({
      exampleProperty: 'examplePackageJsonValue'
    });
  });

  it('should load the default Jest configuration if there is no package.json config or jest.config.js', () => {
    requireStub.throws(Error('ENOENT: no such file or directory, open package.json'));
    fsStub.readFileSync.returns('{ }'); // note, no `jest` key here!
    const config = sut.loadConfig();
    expect(config).to.deep.equal({});
  });
});

interface FsStub {
  [key: string]: sinon.SinonStub;
}
