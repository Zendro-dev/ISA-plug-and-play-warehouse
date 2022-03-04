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
            const storageHandler = await zendro.models.ontology_annotation.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('ontology_annotations', {
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

                    annotationValue: {
                        type: Sequelize[dict['String']]
                    },
                    termSource: {
                        type: Sequelize[dict['String']]
                    },
                    termAccession: {
                        type: Sequelize[dict['String']]
                    },
                    assay_unitCategories_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    study_studyDesignDescriptors_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    study_unitCategories_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    person_roles_fk: {
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
            const storageHandler = await zendro.models.ontology_annotation.storageHandler;
            const recordsExists = await zendro.models.ontology_annotation.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of ontology_annotation and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('ontology_annotations');
        } catch (error) {
            throw new Error(error);
        }
    }
};