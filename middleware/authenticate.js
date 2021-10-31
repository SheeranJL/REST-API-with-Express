'use strict'

const auth = require('basic-auth');        //<-- importing basic-auth module from dependancies
const {User} = require('../models');       //<-- importing User model so we can check against existing credentials for users
const bcrypt = require('bcrypt');          //<-- importing bcrypt encryption module to hash user passwords



exports.authenticateUser = async (req, res, next) => {
  let message;                             //<-- we use this var to indicate if there was an authentication error
  const credentials = auth(req);           //<-- holds user/pass object from Auth req header

  if (credentials) {
    const user = await User.findOne({
      where: {emailAddress: credentials.name}})
        if (user) {
          const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated) {
              console.log(`Welcome ${user.firstName} ${user.lastName}!`);
              req.currentUser = user;
          } else {
            message = `Could not authenticate ${user.firstName} ${user.lastName}.`;
          }
      } else {
        message = `Could not find account.`;
      }
  } else {
    message = 'Auth header not found.';
  }

  if (message) {
    console.warn(message);
    res.status(401).json({message: 'Incorrect username or password.'})
  } else {
    next();
  }
};
