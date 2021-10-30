'use strict'

const express = require('express');
const {User, Course} = require('./models');
const {asyncHandler} = require('./middleware/async-handler');

const router = express.Router();

//**Get current authenticated user**//
router.get('/users', asyncHandler(async (req, res) => {
  // const user = req.currentUser;
  const users = await User.findAll();
  res.status(200).json(users)
}));


//**Create a new user*//
router.post('/users', asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    await User.create(req.body);
    res.status(201).json({message: 'account created'});
  } catch (error) {
    console.log('Error', error.name)
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors })
    } else {
      throw error;
    }
}
}));



//**Return all courses including the User associated with each course**//
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll();
  res.status(200).json(courses);
}));


//**Return a corresponding course with id param incouding user corresponding w/ course**//
router.get('/courses/:id', asyncHandler(async (req, res) => {
  //code goes here
}));


//**Creates a new course**
router.post('/courses', asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    await Course.create(req.body);
    res.status(201).json({message:'Course created!'})
  } catch(error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(500).json({errors});
    } else {
      throw error;
    }
  }
}));


//**Edits a corresponding course**//
router.put('/courses/:id', asyncHandler(async (req, res) => {
  //code goes here
}));


//**Deleted a corresponding course**//
router.delete('/courses/:id', asyncHandler(async (req, res) => {
  //code goes here
}))





module.exports = router;
