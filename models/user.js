'use strict'
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); //<--- for password encryption


module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a first name'
        },
        notEmpty: {
          msg: 'Please provide your first name'
        }
      }
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a last name'
        },
        notEmpty: {
          msg: 'Please provide your last name'
        }
      }
    },

    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter an email address',
        },
        notEmpty: {
          msg: 'Please provide your email address'
        }
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a password'
        },
        notEmpty: {
          msg: 'Please provide a password'
        }
      }
    }

  }, {sequelize});

  User.associate = (models) => {
    User.hasMany(models.Course, { //<-- User can be associated with one or more Courses.
      as: 'Enrolled',
      foreignKey: {
        fieldName: 'UserId', //<--- setting custom field name
        allowNull: false,
      }
    });
  };

  return User;
};
