import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon'; // eslint-disable-line
import sinonChai from 'sinon-chai';

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.config.includeStack = true;
