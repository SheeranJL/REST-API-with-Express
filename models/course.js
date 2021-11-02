'use strict'
const {Model, DataTypes} = require('sequelize');


//initialising Course database table//
module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({                           //<-- initialising Course dbase table

    id: {                                 //<-- ID column + validation rules
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {                              //<-- Title column + validation rules
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a title'
        },
        notEmpty: {
          msg: 'please provide a title'
        }
      }
    },

    description: {                        //<-- Description column + validation rules
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a description'
        },
        notEmpty: {
          msg: 'Please provide a description'
        }
      }
    },

    estimatedTime: {                      //<-- Estimated Time column - no validation rules
      type: DataTypes.STRING,
    },

    materialsNeeded: {                    //<-- Materials needed column - no validation rules
      type: DataTypes.STRING,
    },
  }, {sequelize});

  Course.associate = (models) => {        //<-- Associating the Course model to the User model.
    Course.belongsTo(models.User, {
      as: 'Enrolled',
      foreignKey: {
        fieldName: 'userId', //<--- setting custom field name
        allowNull: false,
      }
    });
  };

  return Course;
}
