import { groceryLists } from "../config/mongoCollections.js";
import groceryListData from "./groceryList.js";
import { checkAge, checkId, checkString } from '../validation.js';
import { ObjectId } from 'mongodb';

const exportedMethods = {
  async newItem(
    listId,
    itemName,
    quantity,
    priority,
    category,
    comments
  ) {
    if (category === undefined) {//comments are optional when initializing an item
      throw `All arguments must be passed`;
    }

    checkString(itemName, "Item Name");
    itemName = itemName.trim();
    checkAge(quantity, 'Quantity'); //Just a check is whole number function
    checkString(priority, "Priority");
    priority = priority.trim();
    if (priority.toLowerCase() !== "low")
      if (priority.toLowerCase() !== 'medium')
        if (priority.toLowerCase() !== 'high')
          throw `Error: invalid priority ranking`;
    checkString(category);
    category = category.trim();
    // if no comment supplied just make it an empty field don't get rid of the field
    if (!comments) {
      comments = [];
    } else {
      comments = checkString(comments, "Comments");
    }
    const newItem = {
      _id: new ObjectId(),
      listId: listId,
      itemName: itemName,
      quantity: quantity,
      priority: priority,
      category: category,
      comments: comments
    }

    const groceryListList = await groceryLists();
    let foundItem = await groceryListList.findOne(
      { '_id': new ObjectId(listId), 'items.itemName': itemName },
      { projection: { _id: 1, 'items.$': 1 } }
    );
    let updateInfo;
    if (foundItem === null) {
      updateInfo = await groceryListList.findOneAndUpdate(
        { _id: new ObjectId(listId) },
        { $push: { items: newItem } },
        { returnDocument: 'after' }
      );
    }
    else {
      foundItem = foundItem.items[0];
      quantity = foundItem.quantity + quantity;
      updateInfo = await groceryListList.findOneAndUpdate(
        { 'items._id': new ObjectId(foundItem._id) },
        { $set: { 'items.$.quantity': quantity } },
        { returnDocument: 'after' }
      );
    }
    if (!updateInfo) throw 'Error: update unsuccessful';
    return updateInfo; // show entire list not just new item
  },

  async getAllItems(groceryListId) {
    if (!groceryListId) throw `You must provide an list id`;

    if (!ObjectId.isValid(groceryListId)) throw `invalid list ID`; //ensuring that the list exists

    let targetList = await groceryListData.getGroceryList(groceryListId);
    return targetList.items;
  },

  async getItemById(targetListID, itemId){
    if (!targetListID) throw `You must provide an list id`;
    if (!ObjectId.isValid(targetListID)) throw `invalid list Id`;
    console.log(targetListID);
    console.log(itemId);

    const groceryListList = await groceryLists();
    const foundItem = await groceryListList.findOne(
      { 'items._id': new ObjectId(itemId) }
    );
    if (!foundItem) {
      throw `Item not found`;
    }
    return foundItem.items[0];
  },


  async getItem(targetListID, itemName) {// searching for items by name within a list
    if (!targetListID) throw `You must provide an list id`;
    if (!ObjectId.isValid(targetListID)) throw `invalid list Id`;

    checkString(itemName);
    itemName = itemName.trim();

    const groceryListList = await groceryLists();
    const foundItem = await groceryListList.findOne(
      { '_id': new ObjectId(targetListID), 'items.itemName': itemName },
      { projection: { _id: 1, 'items.$': 1 } }
    );
    if (!foundItem) {
      throw `Item not found`;
    }
    return foundItem.items[0];
  },

  async deleteLItem(listId, itemId) {
    if (!listId) throw `You must provide an list ID`;
    if (!itemId) throw `You must provide an item ID`;
    if (!ObjectId.isValid(itemId)) throw `invalid item ID`;
    if (!ObjectId.isValid(listId)) throw `invalid list ID`;
    const listCollection = await groceryLists();
    const list = await listCollection.findOne({ 'items._id': new ObjectId(itemId) });
    const deletionInfo = await listCollection.updateOne(
      { _id: new ObjectId(listId) },
      { $pull: { items: { _id: new ObjectId(itemId) } } }
    );
    if (!deletionInfo) throw `Could not delete item with id of ${itemId}`;
    return { groceryItemDeleted: true };
  },

  async updateItem(itemId, updateObject) {
    if (!itemId) throw `You must provide an item id`;
    if (!ObjectId.isValid(itemId)) throw `Invalid Review ID`;

    let itemName, quantity, priority, category, comments;
    if (updateObject.itemName) {
      checkString(updateObject.itemName);
      itemName = updateObject.itemName.trim();
    }
    if (updateObject.quantity) {
      checkAge(updateObject.quantity);
      quantity = updateObject.quantity;
    }
    if (updateObject.priority) {
      checkString(updateObject.priority);
      priority = updateObject.priority.trim();
    }
    if (updateObject.category) {
      checkString(updateObject.category);
      category = updateObject.category.trim();
    }

    if (updateObject.comments) {
      if (!Array.isArray(updateObject.comments)){
        throw 'Error: Comments must be an array.'
      }
      comments = updateObject.comments;
    } else {
      comments = [];
    }

    // cannot get rid of item ID when updating or change it
    const updatedItem = {
      _id: new ObjectId(itemId),
      itemName: itemName,
      quantity: quantity,
      priority: priority,
      category: category,
      comments: comments
    }

    const groceryListList = await groceryLists();
    let updateInfo = await groceryListList.findOneAndUpdate(
      { 'items._id': new ObjectId(itemId) },
      { $set: { 'items.$': updatedItem } },
      { returnDocument: 'after' }
    );
    if (!updateInfo){
      throw `Update failed, could not find item with id ${itemId}`;
    }
    else{
      return updateInfo;
    }
  },

  async updateQuantity(itemId, incQuantity) {
    if(!itemId){
      throw `You must provide an item ID`;
    }
    else{
      const checkID = checkId(itemId, 'Item ID');
      if(checkID === undefined){
        throw `You must provide an item ID`;
      }
    }

    if(!incQuantity){
      throw `You must provide a quantity`;
    }
    else{
      const checkQuant = checkAge(incQuantity, 'Quantity');
      if(checkQuant === undefined){
        throw `You must provide a quantity`;
      }
    }

    const groceryListt = await groceryLists();
    const item = groceryListt.items.find(item => item._id === itemId);

    if(!item){
      throw `Could not find item with id of ${itemId}`;
    }

    const finalQuant = item.quantity + incQuantity;
    if(incQuantity === -1 && item.quantity === 1){
      this.deleteLItem(itemId);
    }
    if(finalQuant < 0){
      throw `Quantity cannot be less than 0`;
    }

    const updatedItem = await groceryListt.updateOne(
      { 'items._id': new ObjectId(itemId) },
      { $set: { 'items.$.quantity': finalQuant } },
      { returnDocument: 'after' }
    );

    if(updatedItem.modifiedCount === 0){
      throw `Could not update quantity for item with id of ${itemId}`;
    }
    else{
      return { updated: true };
    }
  }
};
export default exportedMethods;