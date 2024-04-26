import {users, comments} from '../config/mongoCollections.js';
import {checkId} from '../validation.js';
import userData from './users.js'
import { ObjectId } from 'mongodb';

const exportedMethods = {
    async newComment (
    userId,
    text,
  ) {
    // error checking
    if (text.trim() == ""){
      throw 'please enter text';
    }
    const user = await userData.getUserById(userId);
    if (!user){
      throw 'Error: User not found'; 
    }
    const commentCollection = await comments(); 
    const date = new Date();
    const entry = {
      userId,
      text,
      date
    };
    const insertInfo = await commentCollection.insertOne(entry);
    // if not acknowledged
    if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw 'Error: Could not add comment';
    }
    entry._id = entry._id.toString();
    
    return {commentAdded: true}; // do we need it to return the comment?
  },
  
  async getComment(id) {
    // search database and return comment
    // if comment not found throw 
    const commentCollection = await comments(); 
    const comment = await commentCollection.findOne({ _id: new ObjectId(id) });
    if (!comment){
      throw 'Error: Comment not found.'
    }
    return comment;
  },

  async deleteComment(id) {
    // serach database and remove comment
    const commentCollection = await comments(); 
    const deleteInfo = await commentCollection.findOneAndDelete({ _id: new ObjectId(id) });
    if (!deleteInfo){
      throw 'Error: Deletion unsuccessful'; 
    }
    return {commentDeleted: true};
  },
  
  async updateComment(id, text) {
    const commentCollection = await comments(); 
    const comment = await commentCollection.findOneAndUpdate({ _id: new ObjectId(id) }, {$set: {text: text}}, { returnOriginal: false } );
    if (!comment){
      throw 'Error: Comment not found.'
    }
    return {commentUpdated: true}; // change this to return updated comment?
    }
  };
  export default exportedMethods;