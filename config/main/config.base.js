/* eslint-disable import/no-dynamic-require */
const packageJson = require(`${process.cwd()}/package.json`);
const formatter = require(`${process.cwd()}/lib/utils/formatters`);

const config = {};
config.serviceName = packageJson.name;
config.systemVersion = process.env.HKUBE_SYSTEM_VERSION;

const secured = !!process.env.DATASOURCE_SERVICE_SSL;
config.defaultStorage = process.env.DEFAULT_STORAGE || 's3';
config.dvcStorage = process.env.DVC_STORAGE || 's3';
config.clusterName = process.env.CLUSTER_NAME || 'local';
config.keepDataSourceHotDuration = formatter.parseInt(
    process.env.KEEP_DATASOURCE_HOT_DURATION,
    0
);

config.version = packageJson.version;
config.podName = process.env.POD_NAME;

config.rest = {
    port: process.env.DATASOURCE_SERVICE_REST_PORT || 3005,
    prefix: 'api',
    poweredBy: 'HKube Server',
    rateLimit: {
        route: '/api',
        ms: process.env.DATASOURCE_SERVICE_RATE_LIMIT_MS || 1000,
        max: process.env.DATASOURCE_SERVICE_RATE_LIMIT_MAX || 5,
        delay: process.env.DATASOURCE_SERVICE_RATE_LIMIT_DELAY || 0,
    },
};

config.swagger = {
    protocol: secured ? 'https' : 'http',
    host: process.env.BASE_URL_HOST || 'localhost',
    port: process.env.BASE_URL_PORT || config.rest.port,
    path: process.env.BASE_URL_PATH || '',
};

config.db = {
    provider: 'mongo',
    mongo: {
        auth: {
            user: process.env.MONGODB_SERVICE_USER_NAME || 'tester',
            password: process.env.MONGODB_SERVICE_PASSWORD || 'password',
        },
        host: process.env.MONGODB_SERVICE_HOST || 'localhost',
        port: formatter.parseInt(process.env.MONGODB_SERVICE_PORT, 27017),
        dbName: process.env.MONGODB_SERVICE_NAME || 'hkube',
        useUnifiedTopology: true,
    },
};

config.directories = {
    dataSourcesInUse:
        process.env.DATASOURCES_IN_USE_FOLDER || 'dataSources-in-use',
};

module.exports = config;
