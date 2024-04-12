import {Router} from 'express';
const router = Router();
import {userData} from '../data/index.js';
import { checkName, checkAge, checkEmail, checkPassword } from '../validation.js';
import {users} from '../config/mongoCollections.js'; // import collection

router.route('/')
  .get(async (req, res) => {
})

router.route('/signup')
  .get(async (req, res) => {
    res.render('landing/signup', {pageTitle: 'Sign Up', authenticated: false});
})
  .post(async(req,res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;
    let age = parseInt(req.body.age);
    let errors = [];
    try {
      firstName = checkName(firstName, "First Name");
      lastName = checkName(lastName, "Last Name");
      email = checkEmail(email, "Email Address");
      password = checkPassword(password, "Password");
      age = checkAge(age, "Age");
      
      // Check Email is not Already in Use
      const userCollection = await users();
      const existingEmail = await userCollection.find({email: email}).toArray();
      if (existingEmail.length !== 0) throw `Error: Email is already in use`;
    } catch (e) {
      errors.push(e);
    }

    if (errors.length > 0) {
      res.status(400).render('landing/signup', {
        errors: errors,
        hasErrors: true,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        age: age
      });
      return;
    }
    try {
      const user = await userData.addUser(email, password, firstName, lastName, age);
      if (user.householdName.length === 0) {
        res.status(200).render('users/info', user);
      } else {
        res.status(200).render('groceryList/all');
      }
    } catch (e) {
      res.status(404).json({error: e});
    }

  })




export default router;