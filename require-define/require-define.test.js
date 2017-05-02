import { expect } from 'chai';
import index from './index';

const { requireCopy, define } = index;

describe('## Require and Define functionality', () => {
  describe('## define allows you to save a function by name', () => {
    it('should hold a copy of a function in the requireCopy', async() => {
      const exampleFunction = (a, b) => a + b;
      define('sum', exampleFunction);
      const sum = requireCopy('sum');
      expect(sum.toString()).to.eql(exampleFunction.toString());
    });
    it('required function should have the same functionality in the stored function', async() => {
      const sum = requireCopy('sum');
      expect(sum(2, 2)).to.eql(4);
    });
    it('should overwrite a function with the same name', async() => {
      const exampleFunction = (a, b) => a / b;
      const newDefine = define;
      newDefine('sum', exampleFunction);
      const sum = requireCopy('sum');
      expect(sum(2, 2)).to.eql(1);
    });
    it('a second copy of the define function will still access the same name space', async () => {
      const exampleFunction = (a, b) => a * b;
      const newDefine = define;
      newDefine('sum', exampleFunction);
      const sum = requireCopy('sum');
      expect(sum(2, 3)).to.eql(6);
    });
  });
  describe('## require allows you to access a function by name', () => {
    it('should allow you to access functions from define', async() => {
      const newFunction = (a, b) => a - b;
      define('subtract', newFunction);
      const subtract = requireCopy('subtract');
      expect(subtract(3, 3)).to.eql(0);
    });
    it('should throw an error saying the module does not exist', (done) => {
      try {
        requireCopy('nonexistant');
      } catch (e) {
        expect(e).to.exist; // eslint-disable-line
        done();
      }
    });
    it('a second copy of the require function will still access the same name space', async () => {
      const newRequire = requireCopy;
      const sum = newRequire('sum');
      expect(sum(2, 2)).to.eql(4);
    });
  });
});

