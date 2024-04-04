import {announcements} from '../config/mongoCollections.js'; // import collection
import {ObjectId} from 'mongodb';

const exportedMethods = {
    async newAnnouncement (
    action,
    groceryItem,
    groceryList,
    comment,
    userId
  ) {
    return;
  },

  async deleteOldAnnouncement(id) {
    return;
  },
  
  async getAllAnnouncements() {
    return;
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
  