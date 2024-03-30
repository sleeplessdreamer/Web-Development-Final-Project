import {dbConnection} from './mongoConnection.js';

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
export const announcements = getCollectionFn('announcements');
export const comments = getCollectionFn('comments');
export const groceryLists = getCollectionFn('groceryLists');
export const household = getCollectionFn('household');
export const users = getCollectionFn('users');