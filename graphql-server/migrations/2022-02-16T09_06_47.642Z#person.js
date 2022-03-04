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
            const storageHandler = await zendro.models.person.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('people', {
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

                    lastName: {
                        type: Sequelize[dict['String']]
                    },
                    firstName: {
                        type: Sequelize[dict['String']]
                    },
                    midInitials: {
                        type: Sequelize[dict['String']]
                    },
                    email: {
                        type: Sequelize[dict['String']]
                    },
                    phone: {
                        type: Sequelize[dict['String']]
                    },
                    fax: {
                        type: Sequelize[dict['String']]
                    },
                    address: {
                        type: Sequelize[dict['String']]
                    },
                    affiliation: {
                        type: Sequelize[dict['String']]
                    },
                    roles_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    study_people_fk: {
                        type: Sequelize[dict['[String]']],
                        defaultValue: '[]'
                    },
                    investigation_people_fk: {
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
            const storageHandler = await zendro.models.person.storageHandler;
            const recordsExists = await zendro.models.person.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of person and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('people');
        } catch (error) {
            throw new Error(error);
        }
    }
};