'use strict';
const dict = require('../utils/graphql-sequelize-types');
const {
    Sequelize
} = require("sequelize");
const {
    DOWN_MIGRATION
} = require('../config/globals');
/**
 * @module - Migrations to create or to drop a table correpondant to a sequelize model.
 */
module.exports = {

    /**
     * up - Creates a table with the fields specified in the the createTable function.
     *
     * @param  {object} zendro initialized zendro object
     */
    up: async (zendro) => {
        try {
            const storageHandler = await zendro.models.protocol.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('protocols', {
                    id: {
                        type: Sequelize.STRING,
                        primaryKey: true
                    },

                    createdAt: {
                        type: Sequelize.DATE
                    },

                    updatedAt: {
                        type: Sequelize.DATE
                    },

                    name: {
                        type: Sequelize[dict['String']]
                    },
                    protocolType_fk: {
                        type: Sequelize[dict['String']]
                    },
                    description: {
                        type: Sequelize[dict['String']]
                    },
                    uri: {
                        type: Sequelize[dict['String']]
                    },
                    version: {
                        type: Sequelize[dict['String']]
                    },
                    parameters_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    components_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    study_protocols_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    }

                });
        } catch (error) {
            throw new Error(error);
        }
    },

    /**
     * down - Drop a table.
     *
     * @param  {object} zendro initialized zendro object
     */
    down: async (zendro) => {
        try {
            const storageHandler = await zendro.models.protocol.storageHandler;
            const recordsExists = await zendro.models.protocol.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of protocol and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('protocols');
        } catch (error) {
            throw new Error(error);
        }
    }
};