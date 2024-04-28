import { Router } from 'express';
const router = Router();
import { announcementData, householdData } from '../data/index.js';
import { checkHouseholdName } from '../validation.js';

router.get('/', async (req, res) => {
});

router.route('/new')
  .get(async (req, res) => {
    const user = req.session.user;
    res.status(200).render('household/new', {
      pageTitle: 'New Household Name',
      user,
      authenticated: true,
      household: false,
    });
  })

router.route('/info')
  .get(async (req, res) => {
    let user = req.session.user;
    let errors = [];
    try {
      const members = await householdData.getAllUsersByHousehold(user.householdName);
      const house = await householdData.getHouseholdByName(user.householdName);
      res.status(200).render('household/info', {
        pageTitle: 'Info',
        user,
        authenticated: true,
        members: members,
        house: house,
        household: true
      });
    } catch (e) {
      errors.push(e);
      res.status(400).render('error', {
        pageTitle: 'Info',
        user,
        authenticated: true,
        household: true,
        errors: errors
      });
    }
  });

router.route('/create')
  .get(async (req, res) => {
    const user = req.session.user;
    res.status(200).render('household/create', {
      pageTitle: 'Create Hosehold',
      user,
      authenticated: true,
      household: false,
    });
  })
  .post(async (req, res) => {
    const currentUser = req.session.user;
    const createData = req.body;
    let householdName = createData.householdName;
    let errors = [];
    // Error Checking
    try {
      householdName = checkHouseholdName(householdName, "Household Name");
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
        authenticated: true,
        household: false
      });
      return;
    }
    try {
      const house = await householdData.createHousehold(householdName, currentUser.userId);
      currentUser.householdName = house.householdName; // update req.session.user too
      if (currentUser.householdName.length !== 0) {
        return res.redirect('/household/info');
      } else {
        return res.redirect('/household/new');
      }
    } catch (e) {
      let errors = [];
      errors.push(e);
      res.status(400).render("household/create", {
        pageTitle: "Create Household",
        errors: errors,
        hasErrors: true,
        user: createData,
        authenticated: true,
        household: false
      });
      return;
    }
  });

router.route('/join')
  .get(async (req, res) => {
    const user = req.session.user;
    res.status(200).render('household/join',
      {
        pageTitle: 'Join Hosehold',
        user,
        authenticated: true,
        household: false,
      });
  })
  .post(async (req, res) => {
    // Get Request Body
    const currentUser = req.session.user;
    const joinData = req.body;
    let householdName = joinData.householdName;
    let errors = [];
    // Error Checking
    try {
      householdName = checkHouseholdName(householdName, "Household Name");
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
        authenticated: true,
        household: false
      });
      return;
    }
    try {
      // Login Successfull set req.session.user
      const house = await householdData.joinHousehold(householdName, currentUser.userId);
      const allMembers = await householdData.getAllUsersByHousehold(householdName);
      let nameCounter = 0; // count number of itmes name appears
      let memberName = currentUser.firstName + " " + currentUser.lastName;
      let memberLastName;
      // Check if there are duplicate names in the household
      allMembers.forEach((member) => {
        if (member === memberName) {
          nameCounter++ // increment name counter
          memberLastName = currentUser.lastName + nameCounter.toString(); // append nameCounter and convert to string
        } else {
          memberLastName = currentUser.lastName; // else keep the same
        }
      });
      currentUser.householdName = house.householdName; // update req.session.user too
      currentUser.lastName = memberLastName;
      if (currentUser.householdName.length !== 0) {
        return res.redirect('/household/info');
      } else {
        return res.redirect('/household/new');
      }
    } catch (e) {
      let errors = [];
      errors.push(e);
      res.status(400).render("household/join", {
        pageTitle: "Join Household",
        errors: errors,
        hasErrors: true,
        user: joinData,
        authenticated: true,
        household: false
      });
      return;
    }
  });

export default router;