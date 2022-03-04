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
            const storageHandler = await zendro.models.ontology_source_reference.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('ontology_source_references', {
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

                    description: {
                        type: Sequelize[dict['String']]
                    },
                    file: {
                        type: Sequelize[dict['String']]
                    },
                    name: {
                        type: Sequelize[dict['String']]
                    },
                    version: {
                        type: Sequelize[dict['String']]
                    },
                    investigation_ontologySourceReferences_fk: {
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
            const storageHandler = await zendro.models.ontology_source_reference.storageHandler;
            const recordsExists = await zendro.models.ontology_source_reference.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of ontology_source_reference and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('ontology_source_references');
        } catch (error) {
            throw new Error(error);
        }
    }
};