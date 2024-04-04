import {ObjectId} from 'mongodb';

  const checkId = (id, varName) => {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  }

  const checkString = (strVal, varName) => {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  }

  const checkStringArray = (arr, varName) => {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }
    return arr;
  }

  const checkEmail = (email, varName) => {
    if (!email) throw `Error: You must supply a ${varName}!`;
    if (typeof email !== 'string') throw `Error: ${varName} must be a string!`;
    email = email.trim();
    if (email.length === 0)
      throw `Error: ${varName} cannot be empty or just spaces`;
    // TODO: import npm that checks if valid email address
    
    
    return email;
  }

  const checkPassword = (password, varName) => {
    if (!password) throw `Error: You must supply a ${varName} that is at least 8 chars, has one upper and lower case letter, 1 digit, & contains at least one special character '!,?,#,$,%,&,*,@'`;
    if (typeof password !== 'string') throw `Error: ${varName} must be a string!`;
    if (password.length === 0)
      throw `Error: ${varName} must be at least 8 chars, has one upper and lower case letter, 1 digit, & contains at least one special character '!,?,#,$,%,&,*,@'`;
    if (password.length < 8)
      throw `Error: ${varName} must be at least 8 chars, has one upper and lower case letter, 1 digit, & contains at least one special character '!,?,#,$,%,&,*,@'`;
    if (!isNaN(password)) // only numbers
      throw `Error: ${varName} must be at least 8 chars, has one upper and lower case letter, & contains at least one special character '@,!,$'`;
    //TODO: check if contains upper & lowercase letter, 1 digit, & special char
    const upper = ['A', 'E', 'I', 'O', 'U', 'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'],
    lower = ['a', 'e', 'i', 'o', 'u', 'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'],
    numbers = ['0','1','2','3','4','5','6','7','8','9'],
    spaces = [' '],
    special = ['!', '?', '#,', '$', '%', '&', '*', '@'];


    return password;
  }

  const checkName = (name, varName) => {
    if (!name) throw `Error: You must supply a ${name}!`;
    if (typeof name !== 'string') throw `Error: ${name} must be a string!`;
    name = name.trim();
    if (name.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(name))
      throw `Error: ${name} is not a valid value for ${varName} as it only contains digits`;
    name = name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
    return name;
  }

  const checkAge = (age, varName) => {
    if (typeof age !== 'number') {
      throw `${varName || 'provided variable'} is not a number`;
    }
    if (isNaN(age)) {
      throw `${varName || 'provided variable'} is NaN`;
    }
    if (!Number.isInteger(age)) {  // if a decimal
      throw `${varName || 'provided variable'} is a decimal`;
    }
    return age;
  }

export {checkId, checkEmail, checkPassword, checkName, checkAge};

