const moment = require('moment');
const Logger = require('@hkube/logger');
const fse = require('fs-extra');
const component = require('./componentNames').CLEANER;

const log = Logger.GetLogFromContainer();
const dbConnection = require('./db');
const { getDatasourcesInUseFolder } = require('./utils/pathUtils');
const { glob } = require('./utils/glob');

/** @typedef {import('./utils/types').config} config */

class Cleaner {
    /** @param {config} config */
    async init(config) {
        this.config = config;
        this.db = dbConnection.connection;
        this.rootDir = getDatasourcesInUseFolder(config);
        this.keepHotDuration = config.keepDataSourceHotDuration;
    }

    _extractIds(collection) {
        return collection
            .flatMap(({ nodes }) => nodes)
            .map(
                ({ dataSource }) =>
                    dataSource.id ||
                    `${dataSource.name}/${dataSource.snapshot.name}`
            );
    }

    async clean() {
        log.debug(moment().format(), { component });
        const active = await this.db.jobs.scanMountedDataSources({
            returnActiveJobs: true,
        });
        const inactive = await this.db.jobs.scanMountedDataSources({
            returnActiveJobs: false,
            inactiveTime: this.keepHotDuration,
            inactiveTimeUnits: 'hours',
        });

        const protectedIds = new Set(this._extractIds(active));
        const dropCandidates = new Set(this._extractIds(inactive));
        const cleanup = [...dropCandidates].filter(id => !protectedIds.has(id));
        const directories = await Promise.all(
            cleanup.map(id => glob(`**/${id}`, this.rootDir))
        );
        await Promise.all(
            directories
                .filter(([dir]) => dir)
                .map(([dir]) => {
                    const path = `${this.rootDir}/${dir}`;
                    log.debug(`removing dir ${path}`);
                    return fse.remove(path);
                })
        );
    }
}

module.exports = new Cleaner();
