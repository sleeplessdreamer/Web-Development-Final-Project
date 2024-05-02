import { users, groceryLists, household } from "../config/mongoCollections.js";
import { checkHouseholdName, checkId, checkString } from '../validation.js';
import userData from './users.js'
import {ObjectId} from 'mongodb';
const exportedMethods = {
    async newGroceryList (
    userId,
    householdName,
    groceryName,
    listType
  ) {

    userId = checkId(userId, "User ID");
    householdName = checkHouseholdName(householdName, "Household Name");
    groceryName = checkString(groceryName, "Grocery List Name");
    if(listType.toLowerCase() !== 'community')
     if (listType.toLowerCase() !== 'special occasion')
      if (listType.toLowerCase() !== 'personal') {
      throw 'Not a valid list type';
    }
    const userMember = await userData.getUserById(userId);
    if (!userMember) throw `User could not be found`;

    let dateCreated = new Date();
    let day = dateCreated.getUTCDate();
    let month = dateCreated.getUTCMonth() + 1;
    const year = dateCreated.getUTCFullYear();
    if (month.toString().length === 1) {
      month = "0" + month;
    }
    if (day.toString().length === 1) {
      day = "0" + day;
    }
    dateCreated = month + "/" + day + "/" + year;

    const newList = {
      userName: userMember.firstName + " " + userMember.lastName,
      groceryName,
      listType,
      items: [],
      dateCreated
    }

    // check if household exists
    const householdCollection = await household();
    const existingHousehold = await householdCollection.find({ householdName: householdName }).toArray();
    if (existingHousehold.length === 0) throw `Error: Household does not exist`;

    // check if user belongs to that household
    if (userMember.householdName.length === 0) throw `Error: User must belong to a household to make grocery lists`;
    if (userMember.householdName !== householdName) throw `Error: User does not belong to this household`;
    // insert grocery list to collection
    const groceryListCollection = await groceryLists();
    const insertInfo = await groceryListCollection.insertOne(newList);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Error: Could not add grocery list';

    // update household with new grocery list
    let updatedInfo = await householdCollection.findOneAndUpdate(
      { _id: new ObjectId(existingHousehold[0]._id) },
      { $push: {groceryLists: newList._id.toString()}}, // push ID of list to household
      { returnDocument: 'after' }
    );
    if (!updatedInfo) throw 'Error: Could not update household successfully';

    // update user with new grocery list
    const userCollection = await users();
    updatedInfo = await userCollection.findOneAndUpdate(
      { _id: userMember._id },
      { $push: {groceryLists: newList._id.toString()}}, // push ID of list to household
      { returnDocument: 'after' }
    );
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
    id = checkId(id, "Grocery List Id");
    const groceryListCollection = await groceryLists(); 
    const gList = await groceryListCollection.findOne({ _id: new ObjectId(id) });
    if (!gList){
      throw 'Error: List not found.'
    }
    return gList;
  },

  async deleteGroceryList(id) {
    id = checkId(id, "Grocery List Id");
    const groceryListCollection = await groceryLists(); 
    const deleteInfo = await groceryListCollection.findOneAndDelete({ _id: new ObjectId(id) });
    if (!deleteInfo){
      throw 'Error: Deletion unsuccessful'; 
    }

    // TODO: update user & pull grocery list from user's grocery lists

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
    groceryName = checkString(groceryName, "Grocery List Name");

    let name = groceryName.trim();
    if(name.length === 0){
      throw 'You must provide an input for the list name';
    }

    const userMember = await userData.getUserById(userId);

    const updateGroceryList = {
      userName: userMember.firstName + " " + userMember.lastName,
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
