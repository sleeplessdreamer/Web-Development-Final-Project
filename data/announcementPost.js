import {announcements} from '../config/mongoCollections.js'; // import collection
import {ObjectId} from 'mongodb';
import {checkId, checkString} from '../validation.js'

const exportedMethods = {
  async newAnnouncement (
    action,
    comment,
    userId,
    householdName
  ) {
    action = checkString(action, 'Action');
    comment = checkString(comment, 'Comment');
    userId = checkId(userId, 'User ID');
    householdName = checkString(householdName, 'Household Name');
    const announcementCollection = await announcements();
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const date = `${month}/${day}/${year}`;

    const newAnnouncement = {
      action: action,
      comment: comment,
      userId: new ObjectId(userId),
      householdName: householdName,
      currentDate: date
    };
    const insertInfo = await announcementCollection.insertOne(newAnnouncement);

    if(insertInfo.insertedCount === 0){
      throw `Could not add announcement`;
    }
    else{
      return {inserted: true};
    }
  },

  async deleteOldAnnouncement(id) {
    id = checkId(id, 'ID');
    const announcementCollection = await announcements();
    const deleteAnnouncement = await announcementCollection.deleteOne({_id: ObjectId(id)});
    if (deleteAnnouncement.deletedCount === 0){
      throw `Could not delete announcement with id of ${id}`;
    }
    else{
      return {deleted: true};
    }
    return;
  },
  // because if there are different households should only see announcements from your household
  async getAllAnnouncementsByHouseholdName(householdName) {
    householdName = checkString(householdName);
    const announcementCollection = await announcements();
    let announcementList = await announcementCollection
    .find({householdName: householdName})
    .project({ _id: 0, announcement: 1, comment: 1, currentDate: 1 })   // just return needed fields
    .toArray();
    if (!announcementList) throw `Could not get all Announcements`
    announcementList.reverse(); // most recent announcements on top
    return announcementList; // return list of announcements
  },

  async deleteComment(id) {
    id = checkId(id, 'ID');
    const announcementCollection = await announcements();
    const deleteComment = await announcementCollection.deleteOne({_id: ObjectId(id)});
    if (deleteComment.deletedCount === 0){
      throw `Could not delete comment with id of ${id}`;
    }
    else{
      return {updated: true};
    }
  },
  
  async updateAnnouncement(
    id,
    action,
    groceryItem,
    groceryList,
    comment,
    userId
  ) {
    id = checkId(id, 'ID');
    userId = checkId(userId, 'User ID');
    action = checkString(action, 'Action');
    groceryItem = checkString(groceryItem, 'Grocery Item');
    groceryList = checkString(groceryList, 'Grocery List');
    comment = checkString(comment, 'Comment');
    userId = checkId(userId, 'User ID');
    const announcementCollection = await announcements();
    const updatedAnnouncement = await announcementCollection.updateOne(
      {
        _id: ObjectId(id)
      },
      {
        $set: { // UNSURE OF THIS SECTION OF CODE
          action: action,
          groceryItem: groceryItem,
          groceryList: groceryList,
          comment: comment,
          userId: new ObjectId(userId)
        } // UP TO HERE
      }
    );
    if(!updatedAnnouncement.modifiedCount){
      throw `Could not update announcement with id of ${id}`;
    }
    else{
      return {updated: true};
    }
    }
  };
  export default exportedMethods;
  