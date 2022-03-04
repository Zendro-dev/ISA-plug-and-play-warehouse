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
            const storageHandler = await zendro.models.process.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('processes', {
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
                    executesProtocol_fk: {
                        type: Sequelize[dict['String']]
                    },
                    performer: {
                        type: Sequelize[dict['String']]
                    },
                    date: {
                        type: Sequelize[dict['DateTime']]
                    },
                    previousProcess_fk: {
                        type: Sequelize[dict['String']]
                    },
                    nextProcess_fk: {
                        type: Sequelize[dict['String']]
                    },
                    inputs_source_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    inputs_sample_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    inputs_data_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    inputs_material_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    outputs_sample_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    outputs_data_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    outputs_material_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    study_processSequence_fk: {
                        type: Sequelize[dict['String']]
                    },
                    assay_processSequence_fk: {
                        type: Sequelize[dict['String']]
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
            const storageHandler = await zendro.models.process.storageHandler;
            const recordsExists = await zendro.models.process.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of process and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('processes');
        } catch (error) {
            throw new Error(error);
        }
    }
};