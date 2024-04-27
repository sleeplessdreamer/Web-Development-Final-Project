import { users, groceryLists } from "../config/mongoCollections.js";
import { checkId, checkString, checkHouseholdName } from '../validation.js'
import userData from './users.js'
import {ObjectId} from 'mongodb';
const exportedMethods = {
    async newGroceryList (
    userId,
    groceryName,
    items,
    listType
  ) {

    if(!userId || !groceryName || !items){
      throw 'Must provide all fields to Grocery List';
    }

    //check if grocerylist name exists already in household?
    //if listType = community, shopper must be present
    //shopper must be valid id in household
    userId = checkId(userId, "User ID");

    const userMember = await userData.getUserById(userId);
    if (!userMember) throw `User could not be found`;

    if(items.length < 1){
      throw 'There must be at least one item in the list';
    }

    if(typeof listType !== 'string'){
      throw 'type of list must be a string';
    }

    const dateCreated = Date();

    const newList = {
      userId,
      groceryName,
      items,
      listType,
      dateCreated
    }

    const groceryListCollection = await groceryLists();

    const insertInfo = await groceryListCollection.insertOne(newList);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Error: Could not add household';
    return newList;
  },
  
  async getAllGroceryLists() {
    const groceryListCollection = await groceryLists();
    let gList = await groceryListCollection.find({}).toArray();
    if (!gList) {
      throw `Could not get all grocery lists`;
    }
    const listNames = gList.map((element) => element.groceryName);
    return gList;
  },

  async getGroceryLists(id) {
    const groceryListCollection = await groceryLists(); 
    const gList = await groceryListCollection.findOne({ _id: new ObjectId(id) });
    if (!gList){
      throw 'Error: List not found.'
    }
    return gList;
  },

  async deleteGroceryList(id) {
    const groceryListCollection = await groceryLists(); 
    const deleteInfo = await groceryListCollection.findOneAndDelete({ _id: new ObjectId(id) });
    if (!deleteInfo){
      throw 'Error: Deletion unsuccessful'; 
    }
    return {groceryListDeleted: true};
  },
  
  async updateGroceryList(
    userId,
    groceryName,
    items,
  ) {
    return;
    }
  };
  export default exportedMethods;
