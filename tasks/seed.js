import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import users from '../data/users.js';
import households from '../data/household.js';
import announcements from '../data/announcementPost.js';
import items from '../data/groceryListItems.js';
import lists from '../data/groceryList.js';
import comments from '../data/comments.js';

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
    "Test123!",
    "aditi",
    "deshmukh",
    21
);

let userThree;
// Add another user with same name with append number to their name
userThree = await users.addUser(
    "adeshmukh@gmail.com",
    "cannotB3h@cked!",
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
// invalid login
try {
    await users.logInUser(
        "adeshmukh@stevens.edu",
        "cannotB3h@cked!"
    )
} catch (e) {
    //console.log(e);
}
// invalid login
try {
    await users.logInUser(
        "lnappi@stevens.edu",
        "aDifferentP@assw3rd"
    )
} catch (e) {
    //console.log(e);
}
// valid create house
let house = await households.createHousehold(
    "Nappi",
    userOne._id.toString()
);
// valid join household
await households.joinHousehold(
    "Nappi",
    dad._id.toString()
)
// valid join household
await households.joinHousehold(
    "Nappi",
    mom._id.toString()
)

// Create household (valid)
ourHousehold = await households.createHousehold(
    "GirlBosses",
    userTwo._id.toString()
);
// create household that already exists (invalid)
try {
    await households.createHousehold(
        "GirlBosses",
        userThree._id.toString()
    )
} catch (e) {
    //console.log(e);
}
// join household that does not exist
try {
    await households.joinHousehold(
        "Girlboss",
        userThree._id.toString()
    )
} catch (e) {
    //console.log(e);
}
// join household valid
ourHousehold = await households.joinHousehold(
    "GirlBosses",
    userThree._id.toString()
);
//console.log(ourHousehold);

// join household valid
ourHousehold = await households.joinHousehold(
    "GirlBosses",
    userFour._id.toString()
);

// join household valid
ourHousehold = await households.joinHousehold(
    "GirlBosses",
    userFive._id.toString()
);

// join household valid
ourHousehold = await households.joinHousehold(
    "GirlBosses",
    userSix._id.toString()
);

// get all households
await households.getAllHouseholds();

// get all announcements by household name
let announcement = await announcements.getAllAnnouncementsByHouseholdName(ourHousehold.householdName);
//console.log(announcement);


let listOne;
//console.log(userTwo._id);
// make a grocery list valid
try {
    listOne = await lists.newGroceryList(
        userTwo._id,
        "GirlBosses",
        "Apartment Groceries",
        "community"
    );
} catch (e) {
    console.log(e)
}
//console.log(listOne); // before
let newitem;
// add an item to grocery list (valid)
try {
    newitem = await items.newItem(
        userTwo._id.toString(),
        listOne._id.toString(),
        "Bananas",
        2,
        "Medium",
        "produce"
    );
    //console.log(newitem); // new item
} catch (e) {
    console.log(e);
}
//console.log(listOne); // after item is after
// adds item that already exists to a list will increase quantity instead of adding new item
try {
    let dupeItem = await items.newItem(
        userFive._id.toString(),
        listOne._id.toString(),
        "Bananas",
        3,
        "Medium",
        "produce"
    );
    //console.log(dupeItem); // test if it adds to item that already exists in list
} catch (e) {
    console.log(e);
}
// new item (valid)
try {
    await items.newItem(
        userFour._id.toString(),
        listOne._id.toString(),
        "Apples",
        2,
        "Low",
        "produce"
    );
    //console.log(dupeItem); // test if it adds to item that already exists in list
} catch (e) {
    console.log(e);
}
// new item (valid)
try {
    await items.newItem(
        userTwo._id.toString(),
        listOne._id.toString(),
        "Oranges",
        5,
        "High",
        "produce"
    );
    //console.log(dupeItem); // test if it adds to item that already exists in list
} catch (e) {
    console.log(e);
}
// get all items by list (valid)
try {
    await items.getAllItems(listOne._id.toString());
} catch (e) {
    console.log(e);
}
let item;
// get item by id
try {
    item = await items.getItemById(newitem.items[0]._id.toString());
} catch (e) {
    console.log(e);
}

let update;
// update an item in a list (valid)
try {
    update = await items.updateItem(item._id.toString(),
        {
            itemName: "Banana",
            quantity: 5,
            priority: "High",
            category: "Fruits"
        }, userFour._id
    );
} catch (e) {
    console.log(e);
}
//console.log(update);
let thingy;
// get grocery list by id (valid)
try {
    thingy = await lists.getGroceryList(listOne._id.toString());
    //console.log(thingy);
} catch (e) {
    console.log(e);
}
let del2
// delete item in a grocery list (valid)
try {
    del2 = await items.deleteLItem(listOne._id.toString(), item._id.toString(), userFive._id);
    //console.log(del2);
} catch (e) {
    console.log(e);
}
// putting item back (valid)
try {
    await items.newItem(
        userSix._id.toString(),
        listOne._id.toString(),
        "Banana",
        5,
        "High",
        "Fruits"
    );
} catch (e) {
    console.log(e);
}
// creating another list (valid)
let list2;
try {
    list2 = await lists.newGroceryList(
        userThree._id,
        "GirlBosses",
        "Stuff I Need",
        "personal"
    );
} catch (e) {
    console.log(e)
}
let item3;
try {
    item3 = await items.newItem(
        userSix._id.toString(),
        list2._id.toString(),
        "Apples",
        3,
        "Low",
        "Fruits"
    );
} catch (e) {
    console.log(e);
}

await comments.newComment(
    userSix._id.toString(),
    list2._id.toString(),
    item3.items[0]._id.toString(),
    "I need more apples!"
)

// creating another list (valid)
try {
    await lists.newGroceryList(
        userFour._id,
        "GirlBosses",
        "Crochet Thingies",
        "personal"
    );
} catch (e) {
    console.log(e)
}
// user has to belong to household to make grocery lists or it will throw
try {
    await lists.newGroceryList(
        userOne._id,
        "GirlBosses",
        "Crochet Thingies",
        "personal"
    );
} catch (e) {
    //console.log(e)
}
// make new list (valid)
try {
    await lists.newGroceryList(
        userFour._id,
        "GirlBosses",
        "Ester Bday",
        "special occasion"
    );
} catch (e) {
    console.log(e)
}
// get all lists by household name (valid)
try {
    await households.getAllGroceryListsByHousehold("Girlbosses");
} catch (e) {
    console.log(e);
}
let newList = undefined;
// make new list (valid)
try {
    newList = await lists.newGroceryList(
        userFour._id,
        "GirlBosses",
        "A List of Things",
        "special occasion"
    );
} catch (e) {
    console.log(e)
}
// update the list (valid)
try {
    newList = await lists.updateGroceryList(
        newList._id.toString(),
        "A List of Things",
        "personal",
        userSix._id
    );
} catch (e) {
    console.log(e)
}
let del = undefined;
// delete the list (valid)
try {
    del = await lists.deleteGroceryList(newList._id.toString(), "GirlBosses", userThree._id.toString());
} catch (e) {
    console.log(e)
}
//console.log(del);
let a;
// get user by id (valid)
try {
    a = await users.getUserById(userFive._id);
} catch (e) {
    console.log(e);
}
//console.log(a); // no comment for announcement
// update announcement i.e. leave a comment on their announcement (this announcement is from when they join the household)
try {
    a = await announcements.updateAnnouncement(a.announcements[0]._id.toString(), "Hey everyone!");
} catch (e) {
    console.log(e);
}
//console.log(a); // comment for announcement
// get all announcements by household name (valid)
let announcement2 = await announcements.getAllAnnouncementsByHouseholdName(ourHousehold.householdName);
//console.log(announcement2);

// additional seeding
// Add user (valid)
// user forgot their password will keep adding number to their name
let newUser;
newUser = await users.addUser(
    "kbloomer@stevens.edu",
    "Password123!",
    "Katie",
    "BlooMEr",
    21
);
// password cannot contain spaces
await households.createHousehold(
    "iHeartNoahKahan",
    newUser._id.toString()
);
newUser = await users.addUser(
    "kbloomer@gmail.com",
    "Password123!",
    "Katie",
    "BlooMEr",
    21
);
await households.joinHousehold(
    "iHeartNoahKahan",
    newUser._id.toString()
);
newUser = await users.addUser(
    "kbloomer@yahoo.edu",
    "Password123!",
    "Katie",
    "BlooMEr",
    21
);
await households.joinHousehold(
    "iHeartNoahKahan",
    newUser._id.toString()
);
try {
    listOne = await lists.newGroceryList(
        newUser._id,
        "iHeartNoahKahan",
        "School Supplies",
        "personal"
    );
} catch (e) {
    console.log(e)
}
try {
    newitem = await items.newItem(
        newUser._id.toString(),
        listOne._id.toString(),
        "Pack of pens",
        2,
        "Low",
        "School"
    );
    //console.log(newitem); // new item
} catch (e) {
    console.log(e);
}
try {
    newitem = await items.newItem(
        newUser._id.toString(),
        listOne._id.toString(),
        "HASS Book",
        1,
        "Medium",
        "School"
    );
    //console.log(newitem); // new item
} catch (e) {
    console.log(e);
}
newUser = await users.addUser(
    "kbloomer@outlook.com",
    "Password123!",
    "Katie",
    "BlooMEr",
    21
);
await households.joinHousehold(
    "iHeartNoahKahan",
    newUser._id.toString()
);
try {
    listOne = await lists.newGroceryList(
        newUser._id,
        "iHeartNoahKahan",
        "My Birthday",
        "special occasion"
    );
} catch (e) {
    console.log(e)
}
try {
    newitem = await items.newItem(
        newUser._id.toString(),
        listOne._id.toString(),
        "Cake",
        1,
        "High",
        "Dessert"
    );
    //console.log(newitem); // new item
} catch (e) {
    console.log(e);
}
try {
    newitem = await items.newItem(
        newUser._id.toString(),
        listOne._id.toString(),
        "Noah Kahan Tickets",
        2,
        "High",
        "Gift"
    );
    //console.log(newitem); // new item
} catch (e) {
    console.log(e);
}

console.log()




console.log('Done seeding database');

await closeConnection();