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
      res.status(500).render('error', { pageTitle: 'Error', errors: error, authenticated: true, household: true });
    }
  });

<<<<<<< HEAD
router.route('/updateQuantity')
  .post(async (req, res) => {
    const user = req.session.user;
    const { quantity, itemId } = req.body;
    try {
      const updatedItem = await groceryItemsData.updateQuantity(itemId, quantity);
      if (!updatedItem){
        throw `Error: could not update quantity`;
      }
      else{
        return res.redirect('/lists');
      }
    } catch (error) {
      // Handle errors appropriately, for example, render an error page
      res.status(500).render('error', { error: error });
    }
  });

=======
  router.route('/editItem/:id')
    .get(async (req, res) => {
    const user = req.session.user;
    const listId = req.query.listId;
    const itemId = req.params.id;
    //console.log(listId);
    const successMessage = req.session.successMessage;
    delete req.session.successMessage;

    let oldData; 
      try{
        oldData = await groceryItemsData.getItemById(listId, itemId);
      } catch (e){
        console.log(e);
      }
      //console.log(oldData);

    res.status(200).render('items/edit', {
      pageTitle: 'Edit Item',
      user,
      authenticated: true,
      household: true,
      listId: listId,
      itemId: itemId,
      oldData: oldData,
      successMessage: successMessage
    });
    })
    .post(async (req, res) => {
      // get List Id
      const listId = req.query.listId; 
      console.log(listId);
      const itemId = req.params.id;
      const newInput = req.body; 
      //console.log(newInput);
      let nlistId = xss(newInput.listId);
      let itemName = xss(newInput.itemName);
      let quantity = parseInt(newInput.quantity)
      let priority = xss(newInput.priority);
      let category = xss(newInput.category);
      let comments = xss(newInput.comments);
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
      if (errors.length > 0) {
        res.status(400).render('items/edit', {
          pageTitle: "Edit Item",
          errors: errors,
          hasErrors: true,
          oldData: newInput,
          listId: listId,
          authenticated: true,
          household: true
        });
        return;
      }

      newInput.quantity = Number(newInput.quantity);
      newInput.comments = [newInput.comments];

      
      // now update
      try{
        let result = await groceryItemsData.updateItem(itemId, newInput);
        if (!result) throw `Error: could not update item`;
        return res.redirect(`/groceryLists/${listId}`);
      } catch(e){
        res.status(500).render('error', { pageTitle: 'Error', errors: error, authenticated: true, household: true });
      }
    
    }
);
>>>>>>> 83d39c7ef3bd9cf32d60cda3670fc179322174fc

router.route('/deleteItem/:id')
  .get(async (req, res) => {
    const user = req.session.user;
    const listId = req.query.listId;
    const itemId = req.params.id;
    //console.log(listId);
    const successMessage = req.session.successMessage;
    delete req.session.successMessage;

    res.status(200).render('items/delete', {
      pageTitle: 'Delete Item',
      user,
      authenticated: true,
      household: true,
      listId: listId,
      itemId: itemId,
      //oldData: oldData,
      successMessage: successMessage
    });

  })
  .post(async (req, res) =>{
    const listId = req.query.listId; 
    console.log(listId);
    const itemId = req.params.id;
    console.log(itemId);
    let deleteItem; 
    try {
      deleteItem = await groceryItemsData.deleteLItem(listId, itemId);
      if (deleteItem.groceryItemDeleted === false) throw 'Error: Could not delete item.'
      return res.redirect(`/groceryLists/${listId}`);
    } catch (e){
      console.log(e); 
    }
  });

export default router;