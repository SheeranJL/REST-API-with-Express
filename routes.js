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
      res.status(400).location('/').json({ errors })
    } else {
      throw error;
    }
}
}));


//**Return all courses including the User associated with each course**//
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [{ //<--- Making sure to include all associated users enrolled in the course.
      model: User,
      as: 'Enrolled',
    }]
  });
  res.status(200).json(courses);
}));



//**Return a corresponding course with id param including associated users**//
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, { //<--- finding course by requested ID params in URL and including any associated users in the JSON output.
    include: [{
      model: User,
      as: 'Enrolled',
    }]
  });
  (course) ? res.status(200).json({course}) : res.status(401).json({message:'Course not found'})
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


//**Edits an existing course**//
router.put('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);   //<--- Obtaining the course via id url param
  if (course) {                                          //<--- Does the course exist?

    Course.update(                                       //<--- Updating course item
      { title: req.body.title,                           //<--- With these key/values
        description: req.body.description,               //<--- ...
        estimatedTime: req.body.estimatedTime,           //<--- ...
        materialsNeeded: req.body.materialsNeeded        //<--- ...
      }, {
        where: {id: req.params.id}                       //<--- And declaring which specific course to update
      }
    )
    await course.save();                                 //<--- Saving the modidications back to database
    res.status(204).end();                               //<--- Sending 204 status and ending block
  } else {
    res.status(404).json({message: 'Course not found - cannot update'})
  }
}));


//**Deletes an existing course**//
router.delete('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    id: req.params.id
  });
  if (course) {
    Course.destroy({
      where: {id:req.params.id}
    })
    res.status(204).end();
  } else {
    res.status(404).json({message: 'Course not found - cannot delete'})
  }
}))




module.exports = router;
