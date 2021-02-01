/* eslint-disable global-require */
const configIt = require('@hkube/config');
const Logger = require('@hkube/logger');
const moment = require('moment');

const { main, logger } = configIt.load();
const log = new Logger(main.serviceName, logger);
const component = require('./lib/consts/componentNames').MAIN;
const cleaner = require('./lib/cleaner/cleaner');

const modules = [require('./lib/api-server-client')];

class Bootstrap {
    async init() {
        moment.defaultFormat = 'DD/MM/YYYY HH:mm:ss';
        try {
            this._handleErrors();
            log.info(`running application in ${configIt.env()} environment`, {
                component,
            });
            await Promise.all(modules.map(m => m.init(main)));
            await cleaner.clean();
            return main;
        } catch (error) {
            this._onInitFailed(error);
        }
        return null;
    }

    _onInitFailed(error) {
        log.error(error.message, { component }, error);
        log.error(error);
        process.exit(1);
    }

    _handleErrors() {
        process.on('exit', code => {
            log.info(`exit ${code ? `code ${code}` : ''}`, { component });
        });
        process.on('SIGINT', () => {
            log.info('SIGINT', { component });
            process.exit(1);
        });
        process.on('SIGTERM', () => {
            log.info('SIGTERM', { component });
            process.exit(1);
        });
        process.on('unhandledRejection', error => {
            log.error(
                `unhandledRejection: ${error.message}`,
                { component },
                error
            );
            log.error(error);
        });
        process.on('uncaughtException', error => {
            log.error(
                `uncaughtException: ${error.message}`,
                { component },
                error
            );
            log.error(JSON.stringify(error));
            process.exit(1);
        });
    }
}

module.exports = new Bootstrap();
