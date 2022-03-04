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
            const storageHandler = await zendro.models.data.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('data', {
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
                    type: {
                        type: Sequelize[dict['String']]
                    },
                    fileName: {
                        type: Sequelize[dict['String']]
                    },
                    mimeType: {
                        type: Sequelize[dict['String']]
                    },
                    fileSize: {
                        type: Sequelize[dict['Int']]
                    },
                    fileURL: {
                        type: Sequelize[dict['String']]
                    },
                    assay_dataFiles_fk: {
                        type: Sequelize[dict['String']]
                    },
                    process_inputs_data_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    process_outputs_data_fk: {
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
            const storageHandler = await zendro.models.data.storageHandler;
            const recordsExists = await zendro.models.data.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of data and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('data');
        } catch (error) {
            throw new Error(error);
        }
    }
};