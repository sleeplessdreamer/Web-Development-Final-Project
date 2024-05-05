(function ($) {

    $('#editList').submit(function (event) {
        event.preventDefault();

        let groceryName = $('#groceryName').val();
        let listType = $('#listType').val();

        try {
            groceryName = checkString(groceryName, 'Grocery Name');
            if (listType) {
            if (listType.trim().toLowerCase() !== 'community')
                if (listType.trim().toLowerCase() !== 'special occasion')
                  if (listType.trim().toLowerCase() !== 'personal') {
                    throw 'Not a valid list type';
                  }
                }
            $.ajax({
                method: 'POST',
                url: '/edit/:id',
                data: JSON.stringify({
                    groceryName: groceryName,
                    listType: listType
                })
            }).done(function (response) {
                window.location.href = '/users/profile';
            }).fail(function (error) {
                $('#error').text("Edit List Failed: " + error.responseJSON.message);
            });
        } catch (error) {
            $('#error').text(error);
        }
    });
})(window.jQuery);
