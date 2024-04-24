import {announcements} from '../config/mongoCollections.js'; // import collection
import {ObjectId} from 'mongodb';
import {checkId, checkString} from '../validation.js'

const exportedMethods = {
  // might get rid of this function because we can just make a add the new announcement within the functions like in joinHousehold
  //   async newAnnouncement (
  //   action,
  //   comment,
  //   userId
  // ) {
  //   return;
  // },

  async deleteOldAnnouncement(id) {
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
    return;
  },
  
  async updateAnnouncement(
    action,
    groceryItem,
    groceryList,
    comment,
    userId
  ) {
    return;
    }
  };
  export default exportedMethods;
  