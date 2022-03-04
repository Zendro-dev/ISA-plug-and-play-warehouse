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
            const storageHandler = await zendro.models.assay.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('assays', {
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

                    filename: {
                        type: Sequelize[dict['String']]
                    },
                    measurementType_fk: {
                        type: Sequelize[dict['String']]
                    },
                    technologyType_fk: {
                        type: Sequelize[dict['String']]
                    },
                    technologyPlatform: {
                        type: Sequelize[dict['String']]
                    },
                    materials_samples_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    materials_otherMaterials_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    characteristicCategories_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    unitCategories_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    study_assays_fk: {
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
            const storageHandler = await zendro.models.assay.storageHandler;
            const recordsExists = await zendro.models.assay.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of assay and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('assays');
        } catch (error) {
            throw new Error(error);
        }
    }
};