import { dbConnection, closeConnection } from '../config/mongoConnection.js';
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

let userThree;
// Add another user with same name
userThree = await users.addUser(
    "adeshmukh@gmail.com",
    "Test123!",
    "aditi",
    "deshmukh",
    21
);

let userFour;
userFour = await users.addUser(
    "smcgratty@stevens.edu",
    "Test123!",
    "ShannON",
    "McGratty",
    20
)

let mom = await users.addUser(
    "mbnappi@gmail.com",
    "Test123!",
    "Mary Beth",
    "Nappi",
    62
);

let dad = await users.addUser(
    "mpanike@msn.com",
    "Test123!",
    "Mike",
    "Nappi",
    62
);

let userFive;
userFive = await users.addUser(
    "eear@stevens.edu",
    "Test123!",
    "ESTER",
    "EAR",
    21
)
let userSix;
userSix = await users.addUser(
    "agupta4@stevens.edu",
    "Test123!",
    "Ayushi",
    "Gupta",
    20
)

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

await households.createHousehold(
    "Nappi",
    userOne._id.toString()
);

await households.joinHousehold(
    "Nappi",
    dad._id.toString()
)

await households.joinHousehold(
    "Nappi",
    mom._id.toString()
)

// Create household (valid)
ourHousehold = await households.createHousehold(
    "GirlBosses",
    userTwo._id.toString()
);

try {
    await households.createHousehold(
        "GirlBosses",
        userThree._id.toString()
    )
} catch (e) {
    //console.log(e);
}

try {
    await households.joinHousehold(
        "girlboss",
        userThree._id.toString()
    )
} catch (e) {
    //console.log(e);
}

ourHousehold = await households.joinHousehold(
    "GirlBosses",
    userThree._id.toString()
);
//console.log(ourHousehold);

ourHousehold = await households.joinHousehold(
    "GirlBosses",
    userFour._id.toString()
);

ourHousehold = await households.joinHousehold(
    "GirlBosses",
    userFive._id.toString()
);

ourHousehold = await households.joinHousehold(
    "GirlBosses",
    userSix._id.toString()
);

let announcement = await announcements.getAllAnnouncementsByHouseholdName(ourHousehold.householdName);
//console.log(announcement);

console.log()




console.log('Done seeding database');

await closeConnection();