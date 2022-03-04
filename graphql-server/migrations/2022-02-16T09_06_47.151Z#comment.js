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
            const storageHandler = await zendro.models.comment.storageHandler;
            await storageHandler.getQueryInterface()
                .createTable('comments', {
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
                    value: {
                        type: Sequelize[dict['String']]
                    },
                    assay_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    ontology_annotation_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    data_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    process_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    ontology_source_reference_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    person_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    publication_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    investigation_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    factor_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    study_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    protocol_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    protocol_parameter_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    material_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    source_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    material_attribute_value_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    factor_value_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    process_parameter_value_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    sample_comments_fk: {
                        type: Sequelize[dict['String']]
                    },
                    component_comments_fk: {
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
            const storageHandler = await zendro.models.comment.storageHandler;
            const recordsExists = await zendro.models.comment.count();
            if (recordsExists && !DOWN_MIGRATION) {
                throw new Error(`You are trying to delete all records of comment and its associations. 
            If you are sure about this, set environment variable 'DOWN_MIGRATION' to 'true' 
            and re-execute this down-migration.`);
            }
            await storageHandler.getQueryInterface().dropTable('comments');
        } catch (error) {
            throw new Error(error);
        }
    }
};