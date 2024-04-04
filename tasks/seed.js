import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import users from '../data/users.js';
import households from '../data/household.js';


const db = await dbConnection();
await db.dropDatabase();

let userOne = undefined,
userTwo = undefined,
ourHousehold = undefined;

userOne = await users.addUser(
    "lnappi@stevens.edu",
    "Password123!",
    "lilli",
    "nappi",
    21
 );

userTwo = await users.addUser(
    "adeshmukh@stevens.edu",
    "cannotB3h@cked!",
    "aditi",
    "deshmukh",
    21
 );

ourHousehold = await households.createHousehold(
    "GirlBosses",
    userOne._id.toString()
);

// try to add household Name that already exists will throw error
try {
    await households.createHousehold(
    "GirlBosses",
    userTwo._id.toString()
    )
} catch (e) {
    console.log(e);
}

// try to join household that does not exist will throw error
try {
    await households.joinHousehold(
    "girlboss",
    userTwo._id.toString()
    )
} catch (e) {
    console.log(e);
}

ourHousehold = await households.joinHousehold(
    "GirlBosses",
    userTwo._id.toString()
);

console.log(ourHousehold);


console.log()




console.log('Done seeding database');

await closeConnection();