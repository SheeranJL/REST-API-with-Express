'use strict'
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
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

    description: {
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

    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a time'
        },
        notEmpty: {
          msg: 'Please provide an estimated time'
        }
      }
    },

    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter materials required'
        },
        notEmpty: {
          msg: 'Please provide materials'
        }
      }
    },

  }, {sequelize});

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'Enrolled',
      foreignKey: {
        fieldName: 'UserId', //<--- setting custom field name
        allowNull: false,
      }
    });
  };

  return Course;
}
