const sinon = require('sinon');

before(async () => {
    // eslint-disable-next-line
    const bootstrap = require('../bootstrap');
    await bootstrap.init(true);
});

afterEach(() => {
    sinon.restore();
});
