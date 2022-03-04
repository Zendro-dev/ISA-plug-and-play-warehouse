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
            const storageHandler = await zendro.models.publication.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('publications', {
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

                    pubMedID: {
                        type: Sequelize[dict['String']]
                    },
                    doi: {
                        type: Sequelize[dict['String']]
                    },
                    authorList: {
                        type: Sequelize[dict['String']]
                    },
                    title: {
                        type: Sequelize[dict['String']]
                    },
                    status_fk: {
                        type: Sequelize[dict['String']]
                    },
                    study_publications_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    investigation_publications_fk: {
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
            const storageHandler = await zendro.models.publication.storageHandler;
            const recordsExists = await zendro.models.publication.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of publication and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('publications');
        } catch (error) {
            throw new Error(error);
        }
    }
};