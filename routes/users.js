import { Router } from 'express';
const router = Router();
import { userData } from '../data/index.js';
import { checkName, checkAge, checkEmail, checkPasswordSignUp, checkPasswordLogin } from '../validation.js';
import { users } from '../config/mongoCollections.js'; // import collection
import bcrypt from 'bcrypt';

router.route('/')
  .get(async (req, res) => {

  })

// Render Signup Page
router.route('/signup')
  .get(async (req, res) => {
    res.render('landing/signup', { pageTitle: 'Sign Up' });
    return;
  })
  .post(async (req, res) => {
    // request body
    const newUserData = req.body;
    let firstName = newUserData.firstName;
    let lastName = newUserData.lastName;
    let email = newUserData.email;
    let password = newUserData.password;
    let age = parseInt(newUserData.age);
    let errors = [];

    // Error Checking
    try {
      firstName = checkName(firstName, "First Name");
    } catch (e) {
      errors.push(e);
    }
    try {
      lastName = checkName(lastName, "Last Name");
    } catch (e) {
      errors.push(e);
    }
    try {
      email = checkEmail(email, "Email Address");
    } catch (e) {
      errors.push(e);
    }
    try {
      password = checkPasswordSignUp(password, "Password");
    } catch (e) {
      errors.push(e);
    }
    try {
      age = checkAge(age, "Age");
    } catch (e) {
      errors.push(e);
    }
    try {
      // Check Email is not Already in Use
      const userCollection = await users();
      const existingUser = await userCollection.find({ email: email }).toArray();
      if (existingUser.length !== 0) throw `Error: Email is already in use`;
    } catch (e) {
      errors.push(e);
    }

    // If any errors return fields already supplied with errors
    if (errors.length > 0) {
      res.status(400).render('landing/signup', {
        errors: errors,
        hasErrors: true,
        user: newUserData
      });
      return;
    }
    try {
      const user = await userData.addUser(email, password, firstName, lastName, age);
      // Create Account Successfull set req.session.user
      req.session.user = { firstName: user.firstName, lastName: user.lastName, userId: user._id, householdName: user.householdName }
      res.redirect('/private'); // redirect to private
      return;
    } catch (e) {
      res.status(404).json({ error: e });
    }
  })

router.route('/login')
  .get(async (req, res) => {
    res.render('landing/login', { pageTitle: 'Log In' });
    return;
  })
  .post(async (req, res) => {
    // Get Request Body
    const userLogInData = req.body;
    let email = userLogInData.email;
    let password = userLogInData.password;
    let errors = [];

    // Error Checking
    try {
      email = checkEmail(email, "Email Address");
    } catch (e) {
      errors.push(e);
    }
    try {
      password = checkPasswordLogin(password, "Password");
    } catch (e) {
      errors.push(e);
    }
    // If any errors then display them
    if (errors.length > 0) {
      res.status(400).render('landing/login', {
        errors: errors,
        hasErrors: true,
        user: userLogInData
      });
      return;
    }
    // Get Info About User From Email
    const userCollection = await users();
    const existingUser = await userCollection.find({ email: email }).toArray();
    try {
      // Check if Email is in Use
      if (existingUser.length === 0) throw `Error: No Account Exists With That Email`;
    } catch (e) {
      errors.push(e);
    }
    // If any errors then display them
    if (errors.length > 0) {
      res.status(400).render('landing/login', {
        errors: errors,
        hasErrors: true,
        user: userLogInData
      });
      return;
    }
    // If user supplied both an email and password
    if (email !== "" && password !== "") {
      // Check if email and password matches
      try {
        let compare = await bcrypt.compare(password, existingUser[0].hashedPassword);
        if (!compare) throw `Error: Incorrect Password`;
      } catch (e) {
        errors.push(e);
      }
      // If any errors then display them
      if (errors.length > 0) {
        res.status(400).render('landing/login', {
          errors: errors,
          hasErrors: true,
          user: userLogInData
        });
        return;
      }
      try {
        // Login Successfull set req.session.user
        req.session.user = { firstName: existingUser[0].firstName, lastName: existingUser[0].lastName, userId: existingUser[0]._id, householdName: existingUser[0].householdName }
        res.redirect('/private');
        return;
      } catch (e) {
        res.status(404).json({ error: e });
      }
    }
  })




export default router;