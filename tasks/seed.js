import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import users from '../data/users.js';
import households from '../data/household.js';
import announcements from '../data/announcementPost.js';


const db = await dbConnection();
await db.dropDatabase();

let userOne = undefined,
userTwo = undefined,
ourHousehold = undefined;

// Add user (valid)
userOne = await users.addUser(
    "lnappi@stevens.edu",
    "Password123!",
    "lilli",
    "nappi",
    21
 );

// Try to add user with existing Email will throw
try {
    await users.addUser(
    "lnappi@stevens.edu",
    "aDifferentP@assw3rd",
    "Lilli",
    "Nappi",
    21
    );
} catch (e) {
    //console.log(e);
}

// Add Second User (valid)
userTwo = await users.addUser(
    "adeshmukh@stevens.edu",
    "cannotB3h@cked!",
    "aditi",
    "deshmukh",
    21
);

// Create household (valid)
ourHousehold = await households.createHousehold(
    "GirlBosses",
    userOne._id.toString()
);

// Login User (valid)
let login = await users.logInUser(
    "lnappi@stevens.edu",
    "Password123!"
)
//console.log(login);

try {
    await users.logInUser(
        "adeshmukh@stevens.edu",
        "cannotB3h@cked!"
    )
} catch (e) {
    //console.log(e);
}

try {
    await users.logInUser(
        "lnappi@stevens.edu",
        "aDifferentP@assw3rd"
    )
} catch (e) {
    //console.log(e);
}

// try to add household Name that already exists will throw error
try {
    await households.createHousehold(
    "GirlBosses",
    userTwo._id.toString()
    )
} catch (e) {
    //console.log(e);
}

// try to join household that does not exist will throw error
try {
    await households.joinHousehold(
    "girlboss",
    userTwo._id.toString()
    )
} catch (e) {
    //console.log(e);
}

// Second user joins household (valid)
ourHousehold = await households.joinHousehold(
    "GirlBosses",
    userTwo._id.toString()
);
//console.log(ourHousehold);

let announcement = await announcements.getAllAnnouncementsByHouseholdName(ourHousehold.householdName);
//console.log(announcement);

console.log()




console.log('Done seeding database');

await closeConnection();