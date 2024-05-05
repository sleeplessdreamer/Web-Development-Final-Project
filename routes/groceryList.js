import { Router } from 'express';
const router = Router();
import { groceryListData } from '../data/index.js';
import { checkHouseholdName, checkString, checkId } from '../validation.js';
import xss from 'xss';

router.route('/new')//hasn't been tested
  .get(async (req, res) => {
    const user = req.session.user;

    try {
      res.status(200).render('groceryList/new', {
        pageTitle: 'New Grocery List',
        user,
        authenticated: true,
        household: true
      });
    } catch (e) {
      console.error('Error displaying new grocery list form:', e);
      res.status(500).render('error', { error: e });
    }
  })
  .post(async (req, res) => {
    const user = req.session.user;
    const newListData = req.body;
    let userId = user.userId;
    let householdName = user.householdName;
    let groceryName = xss(newListData.groceryName);
    let listType = xss(newListData.listType);
    let errors = [];
    try {
      groceryName = checkString(groceryName, "Grocery Name");
    } catch (e) {
      errors.push(e);
    }
    try {
      if (listType.toLowerCase() !== 'community')
        if (listType.toLowerCase() !== 'special occasion')
          if (listType.toLowerCase() !== 'personal') {
            throw 'Not a valid list type';
          }
    } catch (e) {
      errors.push(e);
    }
    // If any errors then display them
    if (errors.length > 0) {
      res.status(400).render('groceryList/new', {
        pageTitle: "New Grocery List",
        errors: errors,
        hasErrors: true,
        groceryList: newListData,
        authenticated: true,
        household: true
      });
      return;
    }
    try {
      // Call the method to create a new grocery list item
      let newListInfo = await groceryListData.newGroceryList(userId, householdName, groceryName, listType);
      if (!newListInfo) throw `Error could not create new list`;
      return res.redirect('/household/info');
    } catch (error) {
      // Handle errors appropriately, for example, render an error page
      res.status(500).render('error', { error: error });
    }
  });

router.route('/:id')//This part works
  .get(async (req, res) => {
    const user = req.session.user;
    const listId = req.params.id;

    try {
      const groceryList = await groceryListData.getGroceryList(listId);
      res.status(200).render('groceryList/single', {
        pageTitle: 'Grocery List',
        user,
        authenticated: true,
        household: true,
        groceryList,
        listId
      });
    } catch (e) {
      console.error('Error fetching grocery list:', e);
      res.status(500).render('error', { error: e });
    }
  });

export default router;