import { Router } from 'express';
const router = Router();
import { userData } from '../data/index.js';
import { checkName, checkAge, checkEmail, checkPasswordSignUp, checkPasswordLogin } from '../validation.js';
import { users } from '../config/mongoCollections.js'; // import collection

router.route('/')
  .get(async (req, res) => {

  })

// Render Signup Page
router.route('/signup')
  .get(async (req, res) => {
    res.render('landing/signup', {
      pageTitle: 'Sign Up',
      authenticated: false});
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
      const authenticated = req.session.user;
      if (authenticated && authenticated.householdName.length === 0) {
        return res.redirect('/household/new');
      }
      else if (authenticated && authenticated.householdName.length !== 0) {
        return res.redirect('/household/info');
      }
    } catch (e) {
      let errors = [];
      errors.push(e);
      res.status(400).render("login", {
        pageTitle: "Login",
        errors: errors,
        hasErrors: true,
        user: newUserData,
        authenticated: false
      });
      return;
    }
  })

router.route('/login')
  .get(async (req, res) => {
    res.render('landing/login', { 
      pageTitle: 'Log In',
      authenticated: false});
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
        pageTitle: "Login",
        errors: errors,
        hasErrors: true,
        user: userLogInData
      });
      return;
    }
    try {
      // Login Successfull set req.session.user
      const user = await userData.logInUser(email, password);
      req.session.user = { firstName: user.firstName, lastName: user.lastName, userId: user._id, householdName: user.householdName }
      const authenticated = req.session.user;
      if (authenticated && authenticated.householdName.length === 0) {
        return res.redirect('/household/new');
      }
      else if (authenticated && authenticated.householdName.length !== 0) {
        return res.redirect('/household/info');
      }
    } catch (e) {
      let errors = [];
      errors.push(e);
      res.status(400).render("landing/login", {
        pageTitle: "Login",
        errors: errors,
        hasErrors: true,
        user: userLogInData,
        authenticated: false
      });
      return;
    }
  });

  router.route('/profile')
  .get(async (req, res) => {
    const user = req.session.user;
    res.render('users/profile', {
      pageTitle: 'My Profile',
      authenticated: true,
      user});
  });

  router.route('/logout').get(async (req, res) => {
    //code here for GET
    res.render('users/logout', {
      pageTitle: 'Logout', 
      firstName: req.session.user.firstName, 
      lastName: req.session.user.lastName,
      themePreference: req.session.user.themePreference,
      authenticated: false
    });
    req.session.destroy();
  });






export default router;