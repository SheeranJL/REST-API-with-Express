'use strict'

const express = require('express');                             //<-- Importing Express module for routing.
const {User, Course} = require('./models');                     //<-- Importing User and Course models.
const {asyncHandler} = require('./middleware/async-handler');   //<-- Importing our aSyncHandler middleware to handle our try/catch blocks and handle errors.
const router = express.Router();                                //<-- Setting up our routing using the imported Express module on line:3.
const http = require('http');                                   //<-- Importing http module so we can set header Location to redirect after POST submit.
const {authenticateUser} = require('./middleware/authenticate') //<-- Importing our Authentication middleware to assist with checking auth credentials against users in DB.




//**Route handler to GET current authenticated user after login details are submitted**//
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {

  const userAuth = req.currentUser;                             //<-- Hold the current authenticated use in var (currentUser comes from auth middleware)
  const user = await User.findByPk(userAuth.id, {               //<-- Finding the user in our DB with the id that is the same as the auth id of the authenticated user
    attributes: {                                               //<-- Declaring which Model attributes we wish to exclude from the JSON output that we display to the user once logged in
      exclude: ['password', 'createdAt', 'updatedAt' ]
    },
  })
  if (user) {                                                   //<-- If the user var returns true, meaning login was successful and we were able to locate their DB profile
    res.status(200).json(user)                                  //<-- Then return a status if 200 (successful) and display user profile JSON data (excluding attributes we declared in line 19, above.)
  }
}));


//**Create a new user*//
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);                                //<-- Await the creation of a new User via the body of the request
    res.status(201).location('/').end();                        //<-- Once done, send a successful 201 status and redirect back to home route
  } catch (error) {                                             //<-- The below code will catch any errors, determine whether they're related to validation or constraint errors...
    console.log('Error', error.name)                            //<-- ... and then output those errors in JSON
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
}
}));


//**Return all courses including linked Users**//
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({                         //<-- Await the return of all courses in the DB
    include: [{                                                  //<-- Making sure to include all associated users enrolled in the course.
      model: User,
      as: 'Enrolled',
    }]
  });
  res.status(200).json(courses);                                 //<-- Once courses are gathered and there's no errors (handled by our middleware) then display courses in JSON output.
}));



//**Return a corresponding course with id param including associated users**//
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {           //<--- finding course by requested ID params in URL and including any associated users in the JSON output.
    include: [{
      model: User,
      as: 'Enrolled',
    }]
  });
  (course) ? res.status(200).json({course}) : res.status(401).json({message:'Course not found'})
}));



//**Creates a new course (user must be authenticated to create new course)**
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.create(req.body);                                //<-- Create a new course with the info provided in the request body
    res.status(201).location(`/courses/${course.id}`).end();    //<-- Once created, send a 201 success response and direct URL to the new course
  } catch(error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {       //<-- Catch any of these specific errors and display as JSON.
      const errors = error.errors.map(err => err.message);
      res.status(400).json({errors});
    } else {
      throw error;
    }
  }
}));


//**Edits an existing course (User must authenticate to make the PUT request)**//
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);               //<--- Obtaining the course via id url param
  if (course) {                                                      //<--- Does the course exist?

    Course.update(                                                   //<--- Updating course item
      { title: req.body.title,                                       //<--- With the data provided in req.body
        description: req.body.description,                           //<--- ...
        estimatedTime: req.body.estimatedTime,                       //<--- ...
        materialsNeeded: req.body.materialsNeeded                    //<--- ...
      }, {
        where: {id: req.params.id}                                   //<--- And declaring which specific course to update
      }
    )
    await course.save();                                             //<--- Saving the modidications back to database
    res.status(204).end();                                           //<--- Sending 204 status and terminating
  } else {
    res.status(404).json({message: 'Course not found - cannot update'})
  }
}));


//**Deletes an existing course (User must be authenticated to delete)**//
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findOne({                              //<-- Finding course with the id equal to the params provided in the body for id
    id: req.params.id
  });
  if (course) {                                                      //<-- If the course exists, then destroy the entry where the id of the course is equal to the id of params in body
    Course.destroy({
      where: {id : req.params.id}
    })
    res.status(204).end();                                           //<-- Once deleted, return a 204 successful status and terminate.
  } else {
    res.status(404).json({message: 'Course not found - cannot delete'})
  }
}))


router.delete('/users/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = User.findByPk(req.params.id);
  if (user) {
    User.destroy({
      where: {
        id : req.params.id
      }
    })
    res.status(201).end();
  } else {
    res.status(404).json({message : 'Cannot find user'})
  }
}))




module.exports = router;  //<-- Exporting routes to be used in app.js
