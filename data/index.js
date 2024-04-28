import { household } from '../config/mongoCollections.js';
import announcementDataFunctions from './announcementPost.js';
import commentsDataFunctions from './comments.js';
import groceryListDataFunctions from './groceryList.js';
import householdDataFunctions from './household.js';
import userDataFunctions from './users.js';
import * as cron from 'node-cron';

// Call rotate shopper function every week
cron.schedule('* * * * 0', () => {
    householdDataFunctions.rotateShopper();
});

export const householdData = householdDataFunctions;
export const announcementData = announcementDataFunctions;
export const commentsData = commentsDataFunctions;
export const groceryListData = groceryListDataFunctions;
export const userData = userDataFunctions;

