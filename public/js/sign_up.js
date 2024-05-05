(function ($) {
const checkEmail = (email, varName) => {
    if (!email) throw `Error: You must supply a ${varName}!`;
    if (typeof email !== 'string') throw `Error: ${varName} must be a string!`;
    email = email.trim();
    if (email.length === 0)
      throw `Error: ${varName} cannot be empty or just spaces`;
    // https://www.npmjs.com/package/email-validator imported npm that checks if valid email address
    /*
    if (!EmailValidator.validate(email))
      throw `Error: ${email} is an invalid ${varName}`;
    */
    return; 
  }
  
  const checkPasswordSignUp = (password, varName) => {
    // Check if password is at least 8 chars, and combo of upper & lower case char, at least 1 digit, at least 1 special char.
    if (!password) throw `Error: ${varName} must be at least 8 chars, has one upper and lower case letter, 1 digit, & contains at least one special character`;
    if (typeof password !== 'string') throw `Error: ${varName} must be a string!`;
    password = password.trim();
    if (password.length === 0)
      throw `Error: ${varName} must be at least 8 chars, has one upper and lower case letter, 1 digit, & contains at least one special character`;
    if (password.length < 8)
      throw `Error: ${varName} must be at least 8 chars, has one upper and lower case letter, 1 digit, & contains at least one special character`;
    if (!isNaN(password)) // only numbers
      throw `Error: ${varName} must be at least 8 chars, has one upper and lower case letter, & contains at least one special character`;
    // https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    let regEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password.match(regEx))
      throw `Error: ${varName} must be at least 8 chars, has one upper and lower case letter, & contains at least one special character`;
    return;
  }
  // check name for first and last
  const checkName = (name, varName) => {
    if (!name) throw `Error: You must supply a ${varName}!`;
    if (typeof name !== 'string') throw `Error: ${varName} must be a string!`;
    name = name.trim();
    if (name.length === 0) throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (name.length < 2 || name.length > 25) throw `Error: ${varName} must be between 2-25 chars`
    if (!isNaN(name)) throw `Error: ${name} is not a valid value for ${varName} as it only contains digits`;
    let regEx = /^[a-zA-Z]+(?:[- ][a-zA-Z]+)*$/; // allows for letters, spaces, and hyphens
    if (!name.match(regEx)) throw `Error: invalid ${varName}`;
    return;
  }
  
  // check age
  const checkAge = (age, varName) => {
    if (!age) throw `Error: You must supply an ${varName}!`;  
    if (typeof age !== 'number') {
      throw `${varName || 'provided variable'} is not a number`;
    }
    if (isNaN(age)) {
      throw `${varName || 'provided variable'} is not a number`;
    }
    if (!Number.isInteger(age)) {  // if a decimal
      throw `${varName || 'provided variable'} is a decimal`;
    }
    return;
  }
  
  $('#signup-form').submit(function (event) {
    event.preventDefault();

    let firstname = $('#firstName').val();
    let lastname = $('#lastName').val();
    let age = $('#age').val();
    let email = $('#email').val();
    let password = $('#password').val();

    try {
        checkName(firstname, 'First Name');
        checkName(lastname, 'Last Name');
        checkEmail(email, 'Email Address');
        checkAge(Number(age), 'Age');
        checkPasswordSignUp(password, 'Password');

        
        $.ajax({
            method: 'POST',
            url: '/users/signup',
            contentType: 'application/json',
            data: JSON.stringify({
                firstName: firstname,
                lastName: lastname,
                age: age,
                email: email,
                password: password
            })
        }).done(function (response) {
            
            window.location.href = '/users/profile';
        }).fail(function (error) {
             
            $('#signup-error').text("Sign up failed: " + error.responseJSON.message);
        });
    } catch (error) {
        
        $('#signup-error').text(error);
    }
    });
  })(window.jQuery);
