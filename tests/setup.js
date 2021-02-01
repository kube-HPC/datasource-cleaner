const sinon = require('sinon');

const DATASOURCE_GIT_REPOS_DIR = 'temp/git-repositories';

const STORAGE_DIR = '/var/tmp/fs/storage/local-hkube-datasource';

before(async () => {
    // eslint-disable-next-line
    const bootstrap = require('../bootstrap');
    /** @type {import('./../lib/utils/types').config} */
    const config = await bootstrap.init(true);
    const baseUrl = `${config.swagger.protocol}://${config.swagger.host}:${config.swagger.port}`;
    const restUrl = `${baseUrl}/${config.rest.prefix}/v1`;
    const internalUrl = `${baseUrl}/internal/v1`;
    global.testParams = {
        restUrl,
        internalUrl,
        config,
        DATASOURCE_GIT_REPOS_DIR,
        STORAGE_DIR,
        directories: config.directories,
    };
});

afterEach(() => {
    sinon.restore();
});
