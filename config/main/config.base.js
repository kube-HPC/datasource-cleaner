/* eslint-disable import/no-dynamic-require */
const packageJson = require(`${process.cwd()}/package.json`);
const formatter = require(`${process.cwd()}/lib/utils/formatters`);

const config = {};
config.serviceName = packageJson.name;

config.clusterName = process.env.CLUSTER_NAME || 'local';
config.keepDataSourceHotDuration = formatter.parseInt(
    process.env.KEEP_DATASOURCE_HOT_DURATION,
    0
);

config.version = packageJson.version;

config.rest = {
    prefix: 'api',
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

config.fs = {
    baseDatasourcesDirectory:
        process.env.BASE_DATASOURCES_DIRECTORY ||
        '/var/tmp/fs/datasources-storage',
};

config.directories = {
    dataSourcesInUse:
        process.env.DATASOURCES_IN_USE_FOLDER || 'dataSources-in-use',
};

module.exports = config;
