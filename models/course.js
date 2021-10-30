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
        }
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a description'
        }
      }
    },

    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a time'
        }
      }
    },

    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter materials required'
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
