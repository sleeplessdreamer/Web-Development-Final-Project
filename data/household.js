import {checkId, checkString} from '../validation.js'
import {household, users} from '../config/mongoCollections.js'; // import collection
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

    // Add householdName to user info
    const updatedUser = {
      householdName: householdName,
    }
    const userCollection = await users();
    const updatedInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(userId)},
      {$set: updatedUser},
      {returnDocument: 'after'}
    );
    // if user cannot be updated method should throw
    if (!updatedInfo) {
      throw 'Error: Could not update user successfully';
    }
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
  async getHouseholdByName(householdName) {
    householdName = checkString(householdName, 'Household Name');
    const householdCollection = await household();
    const house = await householdCollection.find({householdName: householdName}).toArray();
    if (!house) throw `Error: Household not found`;
    return house[0];
  },

  async getAllUsersByHousehold(householdName) {
    householdName = checkString(householdName, "Household Name");
    let members = await this.getHouseholdByName(householdName);
    members = members.members; // just get the members    
    return members;
  }

  };
  export default exportedMethods;