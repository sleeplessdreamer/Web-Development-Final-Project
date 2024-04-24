import { checkId, checkString } from '../validation.js'
import { household, users, announcements } from '../config/mongoCollections.js'; // import collection
import userData from './users.js'
import { ObjectId } from 'mongodb';

const exportedMethods = {
  async createHousehold(householdName, userId) {
    // Error Checking
    householdName = checkString(householdName, "Household Name")
    userId = checkId(userId, "User ID")

    // Check if Household name already exists
    const householdCollection = await household();
    const existingHousehold = await householdCollection.find({ householdName: householdName }).toArray();
    if (existingHousehold.length !== 0) throw `Error: that Household Name already exists`;

    // Get name of user who created household and put them in members list
    const userMember = await userData.getUserById(userId);
    if (!userMember) throw `User could not be found`;

    if (userMember.householdName.length !== 0 ) throw `Error: User is already in a household`;
    
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
      { _id: new ObjectId(userId) },
      { $set: updatedUser },
      { returnDocument: 'after' }
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

    //householdName = householdName.toLowerCase(); // case in-sensitive
    const householdCollection = await household();
    const existingHousehold = await householdCollection.find({ householdName: householdName }).toArray();
    if (existingHousehold.length === 0) throw `Error: Household does not exist`;

    // Get name of user who created is joining household and put them in members list
    const userMember = await userData.getUserById(userId);
    if (!userMember) throw `User could not be found`;

    if (userMember.householdName.length !== 0 ) throw `Error: User is already in a household`;

    // Get all exisitng household members
    const allMembers = await this.getAllUsersByHousehold(householdName);
    let nameCounter = 0; // count number of itmes name appears
    let memberName = userMember.firstName + " " + userMember.lastName;
    let memberLastName;
    // Check if there are duplicate names in the household
    const numberRegEx = /\d+$/;
    let match = false;
    allMembers.forEach((member) => {
      let hasNumber = member.match(numberRegEx)
      if (hasNumber) {
        member = member.slice(0, -hasNumber[0].length);
      }
      if (member === memberName) {
        nameCounter++; // increment name counter
        match = true;
        memberLastName = userMember.lastName + nameCounter.toString(); // append nameCounter and convert to string
      } else {
        if (!match) {
          memberLastName = userMember.lastName; // else keep the same
        }
      }
    });
    // Add new member to Household collection
    let updatedInfo = await householdCollection.findOneAndUpdate(
      { _id: new ObjectId(existingHousehold[0]._id) },
      { $push: { members: userMember.firstName + " " + memberLastName } },
      { returnDocument: "after" }
    );
    if (!updatedInfo) {
      throw 'Error: Could not update household successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    // Add householdName to user info
    const updatedUser = {
      householdName: householdName,
      lastName: memberLastName // update name if there are duplicates
    }
    // Get user and add householdName they just joined to their information
    const userCollection = await users();
    updatedInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updatedUser },
      { returnDocument: 'after' }
    );
    // if user cannot be updated method should throw
    if (!updatedInfo) {
      throw 'Error: Could not update user successfully';
    }
    await this.joinAnnouncement(householdName, userId); // make announcement
    return updatedInfo; // return household with new member
  },
  async joinAnnouncement(householdName, userId) {
    householdName = checkString(householdName, "Household Name");
    userId = checkId(userId, "User Id");

    // Get name of user who is joining household
    const userMember = await userData.getUserById(userId);
    if (!userMember) throw `User could not be found`;

    // Make New Announcement
    const announcement = userMember.firstName + " " + userMember.lastName + " joined the household!"
    let currentDate = new Date(), groceryList = [], groceryItem = "", action = "join", comment = "";
    let day = currentDate.getUTCDate()
    let month = currentDate.getUTCMonth() + 1
    const year = currentDate.getUTCFullYear();
    if (month.toString().length === 1) {
      month = "0" + month;
    }
    if (day.toString().length === 1) {
      day = "0" + day;
    }
    currentDate = month + "/" + day + "/" + year;

    const newAnnouncement = {
      action, // might get rid of this 
      groceryList,
      groceryItem,
      comment,
      userId,
      householdName,
      announcement, // added this for text to store in database
      currentDate
    }
    // Insert New Announcement
    const announcementCollection = await announcements();
    const insertInfo = await announcementCollection.insertOne(newAnnouncement);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error: Could not add announcement';

    // Update user information with new announcement
    const userCollection = await users();
    let updatedInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $push: { announcements: newAnnouncement } },
      { returnDocument: "after" }
    );
    if (!updatedInfo) {
      throw 'Error: Could not update user successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();

    return insertInfo;
  },

  async getHouseholdByName(householdName) {
    householdName = checkString(householdName, 'Household Name');
    const householdCollection = await household();
    const house = await householdCollection.find({ householdName: householdName }).toArray();
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