import { Router } from 'express';
const router = Router();
import { groceryItemsData, groceryListData } from '../data/index.js';
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

router.route('/:id')
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
      //console.error('Error fetching grocery list:', e);
      res.status(500).render('error', { error: e });
    }
  });

router.route('/edit/:id')
  .get(async (req, res) => {
    const user = req.session.user;
    const listId = req.params.id;
    let groceryList;
    try {
      groceryList = await groceryListData.getGroceryList(listId);
    } catch (e) {
      res.status(500).render('error', { error: e });
    }
    try {
      res.status(200).render('groceryList/edit', {
        pageTitle: 'Edit Grocery List',
        user,
        authenticated: true,
        groceryList: groceryList,
        listId: listId,
        household: true
      });
    } catch (e) {
      //console.error('Error displaying edit grocery list form:', e);
      res.status(500).render('error', { error: e });
    }
  })
  .post(async (req, res) => {
    let editData = req.body;
    let groceryName, listType;
    let listId = req.params.id;
    let errors = [];
    try {
      listId = checkId(listId, "List Id");
    } catch (e) {
      errors.push(e);
    }
    let oldGroceryList = await groceryListData.getGroceryList(listId);
    if (editData.groceryName) {
      groceryName = xss(editData.groceryName);
      try {
        groceryName = checkString(groceryName, "Grocery List Name");
      } catch (e) {
        errors.push(e);
      }
    } else {
      groceryName = oldGroceryList.groceryName;
    }
    if (editData.listType) {
      listType = xss(editData.listType)
      try {
        if (listType.trim().toLowerCase() !== 'community')
          if (listType.trim().toLowerCase() !== 'special occasion')
            if (listType.trim().toLowerCase() !== 'personal') {
              throw 'Not a valid list type';
            }
      } catch (e) {
        errors.push(e);
      }
    } else {
      listType = oldGroceryList.listType;
    }
    if (errors.length > 0) {
      res.status(400).render('groceryList/edit', {
        pageTitle: "New Grocery List",
        errors: errors,
        hasErrors: true,
        groceryList: newListData,
        listId: listId,
        authenticated: true,
        household: true
      });
      return;
    }
    try {
      // Call the method to create a new grocery list item
      let editListInfo = await groceryListData.updateGroceryList(listId, groceryName, listType);
      if (!editListInfo) throw `Error could not edit list`;
      return res.redirect('/household/info');
    } catch (error) {
      // Handle errors appropriately, for example, render an error page
      res.status(500).render('error', { error: error });
    }
  })


export default router;