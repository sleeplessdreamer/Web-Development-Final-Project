import announcementDataFunctions from './announcementPost.js';
import commentsDataFunctions from './comments.js';
import groceryListDataFunctions from './groceryList.js';
import groceryItemsDataFunctions from './groceryListItems.js';
import householdDataFunctions from './household.js';
import userDataFunctions from './users.js';

// call rotateShopper function to update shopper for every household
await householdDataFunctions.rotateShopper();

export const householdData = householdDataFunctions;
export const announcementData = announcementDataFunctions;
export const commentsData = commentsDataFunctions;
export const groceryListData = groceryListDataFunctions;
export const groceryItemsData = groceryItemsDataFunctions;
export const userData = userDataFunctions;