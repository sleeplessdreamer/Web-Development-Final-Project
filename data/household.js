import {checkId, checkString} from '../validation.js'
import {household} from '../config/mongoCollections.js'; // import collection
import userData from './users.js'
import {ObjectId} from 'mongodb';

const exportedMethods = {
    async createHousehold (householdName, userId) {
    // Error Checking
    householdName = checkString(householdName, "Household Name")
    userId = checkId(userId, "User ID")
    
    // Check if Household name already exists
    const householdCollection = await household();
    const existingHousehold = await householdCollection.find({householdName: householdName}).toArray();
    if (existingHousehold.length !== 0) throw `Error: that Household Name already exists`;
    
    // Get name of user who created household and put them in members list
    const userMember = await userData.getUserById(userId);
    if (!userMember) throw `User could not be found`;
    
    // Create New Household
    let members = [userMember.firstName + " " + userMember.lastName], // put the user who created the id in the household
    groceryLists = [] 
    const newhouseHold = {
      householdName,
      members,
      groceryLists
    }

    // Insert New Household
    const insertInfo = await householdCollection.insertOne(newhouseHold);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Error: Could not add household';
    newhouseHold._id = newhouseHold._id.toString(); // convert to string
    return newhouseHold;
  },
  
  async joinHousehold(householdName, userId) {
    householdName = checkString(householdName, "Household Name");
    userId = checkId(userId, "User Id");

    const householdCollection = await household();
    const existingHousehold = await householdCollection.find({householdName: householdName}).toArray();
    if (existingHousehold.length === 0) throw `Error: Household does not exist`;
    // Get name of user who created is joining household and put them in members list
    const userMember = await userData.getUserById(userId);
    if (!userMember) throw `User could not be found`;
    let updatedInfo = await householdCollection.findOneAndUpdate(
      {_id: new ObjectId(existingHousehold[0]._id)},
      {$push: {members: userMember.firstName + " " + userMember.lastName}},
      {returnDocument: "after"}
    );
    if (!updatedInfo) {
      throw 'Error: Could not update household successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
  },

  };
  export default exportedMethods;