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
            const storageHandler = await zendro.models.study.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('studies', {
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
                    identifier: {
                        type: Sequelize[dict['String']]
                    },
                    title: {
                        type: Sequelize[dict['String']]
                    },
                    description: {
                        type: Sequelize[dict['String']]
                    },
                    submissionDate: {
                        type: Sequelize[dict['DateTime']]
                    },
                    publicReleaseDate: {
                        type: Sequelize[dict['DateTime']]
                    },
                    publications_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    people_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    studyDesignDescriptors_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    protocols_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    materials_sources_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    materials_samples_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    materials_otherMaterials_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    processSequence_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    assays_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    factors_fk: {
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
                    investigation_studies_fk: {
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
            const storageHandler = await zendro.models.study.storageHandler;
            const recordsExists = await zendro.models.study.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of study and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('studies');
        } catch (error) {
            throw new Error(error);
        }
    }
};