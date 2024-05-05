import {Router} from 'express';
const router = Router();
import {groceryListData} from '../data/index.js';

router.route('/new')//hasn't been tested
  .get(async (req, res) => {
    const user = req.session.user;

    try {
      res.status(200).render('groceryList/new', { 
        pageTitle: 'Grocery List',
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
    let { userId, householdName, groceryName, listType } = req.body;
    
    try {
        // Call the method to create a new grocery list item
        let newListInfo = await groceryListData.newGroceryList(userId, householdName, groceryName, listType)
        console.log(newListInfo);     
        
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
  })
  .patch(async (req, res) => {
    const { id } = req.params;
    const { groceryName, listType } = req.body;

    try {
      const updatedList = await groceryListData.updateGroceryList(id, groceryName, listType);
      res.status(200).json(updatedList);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const { householdName } = req.body;
    try {
      const deletionResult = await groceryListData.deleteGroceryList(id, householdName);
      res.status(200).json(deletionResult);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

export default router;
