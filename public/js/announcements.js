(function ($) {
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

    $('#announcement-form').submit(function (event) {
        event.preventDefault();

        let comment = $('#acomment').val();

        try {
            comment = checkString(comment, 'Comment');
            $.ajax({
                method: 'POST',
                url: '/users/profile',
                contentType: 'application/json',
                data: JSON.stringify({
                    comment: comment,
                })
            }).done(function (response) {
                window.location.href = '/users/profile';
            }).fail(function (error) {
                $('#error-output').text("Log in failed: " + error.responseJSON.message);
            });
        } catch (error) {
            $('#error-output').text(error);
        }
    });
})(window.jQuery);
