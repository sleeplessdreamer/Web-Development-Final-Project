import { Router } from 'express';
const router = Router();
import { groceryItemsData } from '../data/index.js';
import { checkString, checkAge } from '../validation.js';
import xss from 'xss';

router.route('/createItem')
  .get(async (req, res) => {
    const user = req.session.user;
    const listId = req.query.listId;

    const successMessage = req.session.successMessage;
    // Clear the success message from the session
    delete req.session.successMessage;

    res.status(200).render('items/new', {
      pageTitle: 'New Item',
      user,
      authenticated: true,
      household: true,
      listId: listId,
      successMessage: successMessage
    });
  })
  .post(async (req, res) => {
    const user = req.session.user;
    const newItemData = req.body;
    let listId = xss(newItemData.listId);
    let itemName = xss(newItemData.itemName);
    let quantity = parseInt(newItemData.quantity)
    let priority = xss(newItemData.priority);
    let category = xss(newItemData.category);
    let comments = xss(newItemData.comments);
    let errors = [];
    try {
      itemName = checkString(itemName, "Item Name")
    } catch (e) {
      errors.push(e);
    }
    try {
      quantity = checkAge(quantity, 'Quantity'); //Just a check is whole number function
    } catch (e) {
      errors.push(e);
    }
    try {
      priority = checkString(priority, "Priority");
      if (priority.toLowerCase() !== "low")
        if (priority.toLowerCase() !== 'medium')
          if (priority.toLowerCase() !== 'high')
            throw `Error: invalid priority ranking`;
    } catch (e) {
      errors.push(e);
    }
    try {
      category = checkString(category, 'Category');
    } catch (e) {
      errors.push(e);
    }
    // If any errors then display them
    if (errors.length > 0) {
      res.status(400).render('items/new', {
        pageTitle: "New Item",
        errors: errors,
        hasErrors: true,
        groceryItem: newItemData,
        listId: listId,
        authenticated: true,
        household: true
      });
      return;
    }
    try {
      // Call the method to create a new grocery list item
      let newItemInfo = await groceryItemsData.newItem(listId, itemName, quantity, priority, category, comments);
      if (!newItemInfo) throw `Error: could not add new item`;
      return res.redirect(`/items/createItem?listId=${listId}`);
    } catch (error) {
      // Handle errors appropriately, for example, render an error page
      res.status(500).render('error', { error: error });
    }
  });

export default router;