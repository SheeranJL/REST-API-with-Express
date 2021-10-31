'use strict'
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt'); //<--- for password encryption


module.exports = (sequelize) => {
  class User extends Model {}
  User.init({

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

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
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address'
        }
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
        len: {
          args: [8, 20],
          msg: 'The password should be between 8 and 20 characters in length'
        },
        set(val) {
          if ( val === this.password ) {
            const hashedPassword = bcrypt.hashSync(val, 10);
            console.log(hashedPassword);
            this.setDataValue('password', hashedPassword);
          }
        },
      }
    },
  }, {sequelize});

  User.associate = (models) => {
    User.hasMany(models.Course, { //<-- User can be associated with one or more Courses.
      as: 'Enrolled',
      foreignKey: {
        fieldName: 'UserId',      //<--- setting custom field name
        allowNull: false,
      }
    });
  };

  return User;
};
