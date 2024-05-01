import { users, groceryLists } from "../config/mongoCollections.js";
import { checkId, checkString, checkHouseholdName } from '../validation.js'
import userData from './users.js'
import {ObjectId} from 'mongodb';
const exportedMethods = {
    async newGroceryList (
    userId,
    groceryName,
    listType
  ) {

    if(!userId || !groceryName || !listType){
      throw 'Must provide all fields to Grocery List';
    }

    userId = checkId(userId, "User ID");

    const userMember = await userData.getUserById(userId);
    if (!userMember) throw `User could not be found`;


    if(typeof listType !== 'string'){
      throw 'type of list must be a string';
    }

    if(listType.toLowerCase() !== 'community' || listType.toLowerCase !== 'special occasion' || listType.toLowerCase() !== 'personal'){
      throw 'Not a valid list type';
    }

    const dateCreated = Date();

    const newList = {
      userId,
      groceryName,
      listType,
      items: [],
      dateCreated
    }

    const groceryListCollection = await groceryLists();

    const insertInfo = await groceryListCollection.insertOne(newList);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Error: Could not add grocery list';
    newList._id = newList._id.toString();
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

  async getGroceryList(id) {
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
    if(!userId || !groceryName || !items){
      throw 'Must provide all fields to update Grocery List';
    }

    userId = checkId(userId, "User Id");

    let name = groceryName.trim();
    if(name.length === 0){
      throw 'You must provide an input for the list name';
    }

    const updateGroceryList = {
      userId: userId,
      groceryName: name,
      items: items,
    }


    const groceryListCollection = await groceryLists();
    const gList = await groceryListCollection.findOneAndUpdate({ _id: new ObjectId(id) }, {$set: updateGroceryList}, { returnOriginal: false } );
    if (!gList){
      throw 'Error: Could not update list'
    }
    return {groceryListUpdated: true};
    }
  };
  export default exportedMethods;
