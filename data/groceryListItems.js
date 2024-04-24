import { groceryLists } from "../config/mongoCollections.js";
import * as groceryListData from "./groceryList.js";
import {checkAge, checkId, checkString} from '../validation.js';
import {ObjectId} from 'mongodb';

const exportedMethods = {
    async newItem (
      itemName,
      quantity,
      priority,
      category,
      comments
  ) {
    if (category === undefined){//comments are optional when initializing an item
      throw `All arguments must be passed`;
    }

    checkString(itemName, "Item Name");
    itemName = itemName.trim();
    checkAge(quantity, 'Quantity'); //Just a check is whole number function
    checkString(priority, "Priority");
    priority = priority.trim();
    checkString(category);
    category = category.trim();
    if (comments){
      //TODO when Comment file is done
      let newItem = {
        _id: new ObjectId(),
        itemName:itemName,
        quantity: quantity,
        priority:priority,
        category:category,
        comments:comments
      }
    }
    else{
      let newItem = {
        _id: new ObjectId(),
        itemName:itemName,
        quantity: quantity,
        priority:priority,
        category:category
      }
    }

    const groceryListList = await groceryLists();
    const targetList = await groceryListList.findOneAndUpdate(
      {_id:new ObjectId(targetList._id)},
      {$push: {items:newItem}},
      {returnDocument: 'after'}
    );

    return newItem;
  },
  
  async getAllItems(groceryListId) {
    checkString(groceryListId);
    groceryListId = groceryListId.trim();

    if (!ObjectId.isValid(groceryListId)) throw `invalid list ID`; //ensuring that the list exists
    
    let targetList = await groceryListData.get(groceryListId);
    return targetList.items;
  },

  async getItem(id) {
    if (!id) throw `You must provide an item id`;
    if (!ObjectId.isValid(id)) throw `invalid item Id`;

    const groceryListList = await groceryLists();
    const foundItem = await groceryListList.findOne(
      {'items._id': new ObjectId(id)},
      {projection: {_id: 1, 'items.$': 1}}
    );

    if(!foundItem){
      throw `Item not found`;
    }
    return foundItem.reviews[0];
  },

  async deleteLItem(id) {
    return;
  },
  
  async updateItem(itemId, updateObject) {
    if(!itemId) throw `You must provide an item id`;
    if (!ObjectId.isValid(itemId)) throw `Invalid Review ID`;

    if(updateObject.itemName){
      checkString(updateObject.itemName);
      updateObject.itemName = updateObject.itemName.trim();
    }
    if(updateObject.quantity){
      checkAge(updateObject.quantity);
    }
    if(updateObject.priority){
      checkString(updateObject.priority);
      updateObject.priority = updateObject.priority.trim();
    }
    if(updateObject.category){
      checkString(updateObject.category);
      updateObject.category = updateObject.category.trim();
    }

    const groceryListList = await groceryLists();
    let updateInfo = await groceryListList.findOneAndUpdate(
      {'items._id': new ObjectId(itemId)},
      {$set: {'items.$': updateObject}},
      {returnDocument: 'after'}
    );

    if(!updateInfo) throw `Update failed, could not find item with id ${itemId}`;

    return updateInfo;
    }
  };
  export default exportedMethods;