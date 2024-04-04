import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import users from '../data/users.js';

const db = await dbConnection();
await db.dropDatabase();

let userOne = undefined;

userOne = await users.addUser(
    "nappilil10@gmail.com",
    "Password123!",
    "lilli",
    "nappi",
    21
 );
console.log(userOne);
console.log()




console.log('Done seeding database');

await closeConnection();