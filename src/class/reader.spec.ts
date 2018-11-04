import { expect } from 'chai';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { Reader } from './reader';

describe('#Reader', () => {
  let reader: Reader;
  let executeWhenRead: Function;

  beforeEach(() => {
    reader = new Reader();
  });

  describe('#constructor', () => {
    it('should call promisify', async () => {
      expect(util).to.respondTo('promisify');
    });
  });

  describe('#readFeatureFilesFromFolder', () => {
    beforeEach(() => {
      executeWhenRead = () => {};
    });

    it('should read the initial folder', async () => {
      await reader.readFeatureFilesFromFolder('./fixtures/', executeWhenRead);

      expect(reader).to.respondTo('readDirAsync');
      expect(fs).to.respondTo('readdir');
    });

    it('should read folders recursively', async () => {
      await reader.readFeatureFilesFromFolder('./fixtures/', executeWhenRead);

      expect(path).to.respondTo('resolve');
      expect(reader).to.respondTo('statAsync');
      expect(reader).to.respondTo('readFeatureFilesFromFolder');
    });

    it('should manage error without thrown exception if folders does not exist', async () => {
      let readFeatureFilesFromFolderError;

      try {
        await reader.readFeatureFilesFromFolder('./not-existing-folder', executeWhenRead);
      } catch (error) {
        readFeatureFilesFromFolderError = error;
      }

      expect(readFeatureFilesFromFolderError).to.equal(undefined);
    });
  });

  describe('#readContentFeatureFile', async () => {
    it('should read file content', async () => {
      const contentFile = await reader.readContentFeatureFile('./fixtures/features/copy-folder/copy.feature');

      expect(reader).to.respondTo('readFileAsync');
      expect(contentFile).not.to.equal('');
    });

    it('should return an empty string if file does not exist', async () => {
      const contentFile = await reader.readContentFeatureFile('./fake-file.txt');

      expect(reader).to.respondTo('readFileAsync');
      expect(contentFile).to.equal('');
    });
  });
});
