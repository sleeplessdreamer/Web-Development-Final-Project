import {Router} from 'express';
const router = Router();
import {householdData} from '../data/index.js';
import { checkString } from '../validation.js';
router.get('/', async (req, res) => {
});

router.route('/new')
  .get(async (req, res) => {
    const user = req.session.user;
    res.render('household/new', {
      pageTitle: 'New Household Name', 
      user,
      authenticated: true});
})

router.route('/info')
   .get(async (req, res) => {
    const user = req.session.user;
    let errors = [];
    try {
      const members = await householdData.getAllUsersByHousehold(user.householdName, user.userId);
      res.render('household/info', {
        pageTitle: 'Info', 
        user,
        authenticated: true,
        members: members});
    } catch (e) {
      errors.push(e);
      res.render('error', {
        pageTitle: 'Info', 
        user,
        authenticated: true,
        errors: errors});
    }
});

router.route('/create') 
  .get(async (req, res) => {
    const user = req.session.user;
    res.render('household/create', {
      pageTitle: 'Create Hosehold', 
      user,
      authenticated: true});
})
  .post(async(req,res) => {
    const currentUser = req.session.user;
    const createData = req.body;
    let householdName = createData.householdName;
    let errors = [];
    // Error Checking
    try {
      householdName = checkString(householdName, "Household Name");
    } catch (e) {
      errors.push(e);
    }
    // If any errors then display them
    if (errors.length > 0) {
      res.status(400).render('household/create', {
        pageTitle: "Create Household",
        errors: errors,
        hasErrors: true,
        user: createData,
        authenticated: true
      });
      return;
    }
    try {
      const house = await householdData.createHousehold(householdName, currentUser.userId);
      currentUser.householdName = house.householdName; // update req.session.user too
      return res.redirect('/household/info');
    } catch (e) {
      let errors = [];
      errors.push(e);
      res.status(400).render("household/create", {
        pageTitle: "Create Household",
        errors: errors,
        hasErrors: true,
        user: createData,
        authenticated: true
      });
      return;
    }
});

router.route('/join')
  .get(async (req, res) => {
    const user = req.session.user;
    res.render('household/join', 
    {pageTitle: 'Join Hosehold', 
    user,
    authenticated: true});
})
  .post(async(req,res) => {
    // Get Request Body
    const currentUser = req.session.user;
    const joinData = req.body;
    let householdName = joinData.householdName;
    let errors = [];
    // Error Checking
    try {
      householdName = checkString(householdName, "Household Name");
    } catch (e) {
      errors.push(e);
    }
    // If any errors then display them
    if (errors.length > 0) {
      res.status(400).render('household/join', {
        pageTitle: "Join Household",
        errors: errors,
        hasErrors: true,
        user: joinData,
        authenticated: true
      });
      return;
    }
    try {
      // Login Successfull set req.session.user
      const house = await householdData.joinHousehold(householdName, currentUser.userId);
      currentUser.householdName = house.householdName; // update req.session.user too
      return res.redirect('/household/info');
    } catch (e) {
      let errors = [];
      errors.push(e);
      res.status(400).render("household/join", {
        pageTitle: "Join Household",
        errors: errors,
        hasErrors: true,
        user: joinData,
        authenticated: true
      });
      return;
    }
});

export default router;