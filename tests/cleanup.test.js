/* eslint-disable global-require */
const sinon = require('sinon');
const fse = require('fs-extra');
const uuid = require('uuid');
const { expect } = require('chai');
const path = require('path');

/** @type {import('@hkube/db/lib/MongoDB').ProviderInterface} */
let db = null;
/** @type {import('../lib/cleaner')} */
let service = null;

describe('cleanup', () => {
    before(() => {
        db = require('./../lib/db').connection;
        service = require('../lib/cleaner');
    });
    it.only('should perform cleanup', async () => {
        const prepare = node => ({
            id: uuid.v1(),
            nodes: [{ dataSource: node }],
        });
        const activeNodes = [
            { id: 'still-active' },
            { name: 'not-to-clean', snapshot: { name: 'x' } },
        ].map(prepare);
        const inactiveNodes = [
            { id: 'still-active' }, // under a
            { id: 'should-be-cleaned' }, // under b
            { name: 'not-to-clean', snapshot: { name: 'x' } },
            { name: 'to-clean', snapshot: { name: 'x' } },
        ].map(prepare);

        const removeStub = sinon.fake.resolves();
        sinon.replace(fse, 'remove', removeStub);
        sinon.replace(
            db.jobs,
            'scanMountedDataSources',
            ({ returnActiveJobs }) =>
                returnActiveJobs ? activeNodes : inactiveNodes
        );
        const mountingDir = path.resolve(
            __dirname,
            'mocks',
            'mountedDataSources'
        );
        service.rootDir = mountingDir;

        await service.clean();
        const calls = removeStub.getCalls();
        expect(calls).to.have.lengthOf(2);
        expect(calls[0].firstArg).to.match(/b\/should-be-cleaned/i);
        expect(calls[1].firstArg).to.match(/to-clean\/x/i);
    });
});
