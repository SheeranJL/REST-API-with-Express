'use strict'
const { Model, DataTypes } = require('sequelize');  //<-- importing Model and DataTypes modules
const bcrypt = require('bcrypt');                   //<-- for password encryption

//**Creating database table for User**//
module.exports = (sequelize) => {
  class User extends Model {}
  User.init({                              //<-- initialising database table for User

    id: {                                  //<-- id field set to integer, is the primary key, and auto-generates
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    firstName: {                            //<-- firstName column
      type: DataTypes.STRING,               //
      allowNull: false,                     //
      validate: {                           //<-- Setting validation with custom messages for when posted the data isn't valid
        notNull: {
          msg: 'Please enter a first name'
        },
        notEmpty: {
          msg: 'Please provide your first name'
        }
      }
    },

    lastName: {                              //<-- lastName column
      type: DataTypes.STRING,
      allowNull: false,
      validate: {                            //<-- Setting validation with custom messages for when posted the data isn't valid
        notNull: {
          msg: 'Please enter a last name'
        },
        notEmpty: {
          msg: 'Please provide your last name'
        }
      }
    },

    emailAddress: {                           //<-- emailAddress column
      type: DataTypes.STRING,
      allowNull: false,
      validate: {                             //<-- Setting validation with custom messages for when posted the data isn't valid
        notNull: {
          msg: 'Please enter an email address',
        },
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address'
        }
      }
    },

    password: {                               //<-- password column
      type: DataTypes.STRING,
      allowNull: false,
      validate: {                             //<-- Setting validation with custom messages for when posted the data isn't valid
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
        len: {
          args: [8, 20],
          msg: 'The password must be between 8 and 20 characters in length'
        },

        //The code below uses a setter to set the value of the password entry to a hashed value, rather than plain text.
        set(val) {
          if ( val === this.password ) {                      //<-- if val (value being set for password) is equal to the user password..
            const hashedPassword = bcrypt.hashSync(val, 10);  //<-- then declare a variable which will hold the hashed password value after being hashed.
            this.setDataValue('password', hashedPassword);    //<-- then update the underlying data value (the password), to it's hashed value instead. This prevents the plain text from being stored.
          }
        },
      }
    },
  }, {sequelize});

  User.associate = (models) => {
    User.hasMany(models.Course, { //<-- User can be associated with one or more Courses.
      as: 'Enrolled',
      foreignKey: {
        fieldName: 'userId',     //<--- setting custom field name
        //allowNull: false
      }
    });
  };

  return User;
};
