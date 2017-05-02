let instance = { initialized: false };

/**
* A singleton class that will be defined once on runtime.
* This way when we import the require and define functions they will all
* Reference the same name space
*/
class GlobalFunctions {
  constructor() {
    if (!instance.initialized) {
      this.initialized = true;
      this.functions = {};
      instance = this;
    }
    return instance;
  }
  /**
  * require returns a function which through closures has access to its parents singleton
  * we can export the require function by calling it down below and both require and define will access the same
  * functions name space
  */
  require() {
    const singleton = this;
    return (name) => {
      const fn = singleton.functions[name];
      if (!fn) {
        throw new Error(`function ${name} does not exist`);
      }
      return fn;
    };
  }
  /**
  * define returns a function that allows us to register new functions into our singleton namespace
  * we can export the define function by calling it down below and both require and define will access the same
  * functions name space
  */
  define() {
    const singleton = this;
    return (name, fn) => {
      singleton.functions[name] = fn;
    };
  }
}
const requireDefine = new GlobalFunctions();
const define = requireDefine.define();
const requireCopy = requireDefine.require();

export default { requireCopy, define };
