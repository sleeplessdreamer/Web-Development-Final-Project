import {users} from '../config/mongoCollections.js'; // import collection
import {checkEmail, checkPassword, checkName, checkAge, checkId} from '../validation.js'

const exportedMethods = {
  async addUser(
    email, 
    password, 
    firstName, 
    lastName, 
    age
    ) {
      // Error Checking
      email = checkEmail(email, 'Email Address');
      password = checkPassword(password, 'Password');
      firstName = checkName(firstName, 'First Name');
      lastName = checkName(lastName, 'Last Name');
      age = checkAge(age, 'Age');
      
      let householdName = "";
      let groceryLists = [];
      let announcements = [];
      let comments = [];
      let shopper = false;
      const newUser = {
        email, 
        password, 
        firstName, 
        lastName, 
        age,
        householdName,
        groceryLists,
        announcements,
        comments,
        shopper
      };
      const userCollection = await users();
      const insertInfo = await userCollection.insertOne(newUser);
      if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Error: Could not add user';
      newUser._id = newUser._id.toString(); // convert to string
      return newUser;
  },

    async getAllUsers () {
    return;
  },
  
  async getUserById(id) {
    id = checkId(id, 'ID');
    

    return;
  },

  async updateUser(
    email, 
    password, 
    firstName, 
    lastName, 
    age
    ) {
      // Error Checking
      email = checkEmail(email, 'Email Address');
      password = checkPassword(password, 'Password');
      firstName = checkName(firstName, 'First Name');
      lastName = checkName(lastName, 'Last Name');
      age = checkAge(age, 'Age');
    return;
  }
  
  };
  export default exportedMethods;