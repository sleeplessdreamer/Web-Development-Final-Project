import { Router } from 'express';
const router = Router();
import { householdData, userData, groceryListData } from '../data/index.js';
import { checkHouseholdName } from '../validation.js';
import xss from 'xss';

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
      await householdData.rotateShopper(); // rotate shopper when page is refreshed  
      const groceryLists = await householdData.getAllGroceryListsByHousehold(user.householdName);
      res.status(200).render('household/info', {
        pageTitle: 'Info',
        user,
        authenticated: true,
        members: members,
        house: house,
        groceryLists: groceryLists,
        household: true
      });
    } catch (e) {
      errors.push(e);
      res.status(400).render('error', {
        pageTitle: 'Error',
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
    let householdName = xss(createData.householdName);
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
    let householdName = xss(joinData.householdName);
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
      currentUser.householdName = house.householdName; // update req.session.user too
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

router.route('/searchLists')
  .get(async (req,res) => {
    const user = req.session.user;
    const itemName = req.query.itemName;
    try {
      const searchQuery = itemName.trim().toLowerCase()

      if (searchQuery === ""){
        throw `Search Query cannot be empty`;
      }
  
      const allLists = await groceryListData.getAllGroceryLists();
  
      const matchingLists = allLists.filter(list => {
        return list.items.some(item => item.itemName.toLowerCase().includes(searchQuery));
      });
      //console.log(matchingLists)
  
      res.render('household/searchResults', { pageTitle: 'Search Results', matchingLists, searchQuery, user, authenticated: true,
      household: true });
    } catch (error) {
      res.render('error', { pageTitle: 'Error', errors: error });
    }
  });

export default router;