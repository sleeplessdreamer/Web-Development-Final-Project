import {Router} from 'express';
const router = Router();
import {groceryItemsData} from '../data/index.js';

router.route('/createItem')
  .get(async (req, res) => {
    const user = req.session.user;
    const listId = req.query.listId

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
  let { listId, itemName, quantity, priority, category, comments } = req.body;
  
  try {
      // Call the method to create a new grocery list item
      quantity = parseInt(quantity)
      let newItemInfo = await groceryItemsData.newItem(listId, itemName, quantity, priority, category, comments);
      console.log(newItemInfo);
      console.log("bleh")
      // Redirect to a success page or return a success message
      req.session.successMessage = 'New item added successfully!';
      
      res.redirect(`/items/createItem?listId=${listId}`);
  } catch (error) {
      // Handle errors appropriately, for example, render an error page
      res.status(500).render('error', { error: error });
  }
});

export default router;