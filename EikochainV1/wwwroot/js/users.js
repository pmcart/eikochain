$(document).ready(function () {
    var currentTargetEmail = '';

    $('#usersDatatable').DataTable();

    $('#addUserDialog').on('click', function () {
        $('#AddDialog').modal('show');
    })

    $('.btnCloseModal').on('click', function () {
        $('.modal').modal('hide');
    })

    $('.close').on('click', function () {
        $('.modal').modal('hide');
    })

    $('#btnResetPassword').on('click', function () {
        currentTargetEmail = $(this).data('user');
        $('#targetEmailString').html(currentTargetEmail);

        $('#ResetPasswordDialog').modal('show');
    })

    $('#resetPasswordConfirm').on('click', function () {
        $.ajax({
            url: "/Users/ResetPassword?email=" + encodeURIComponent(currentTargetEmail),
            method: "GET",
            dataType: 'json',
            success: function (data) {
                console.log(data)
                $('#ResetPasswordDialog').modal('hide');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    })

    $('#btnDeleteUser').on('click', function () {
        var targetEmail = $(this).data('user');
        $('#targetUserDelete').html(targetEmail);

        $('#DeleteUserDialog').modal('show');
    })

    $('#btnAddNewUser').on('click', function () {
        $.ajax({
            url: "/Users/Add",
            method: "POST",
            data: {
                firstName: $('#firstNameInput').val(),
                lastName: $('#lastNameInput').val(),
                email: $('#emailInput').val(),
                roleId: $('#RoleID').val()
            },
            dataType: 'json',
            success: function (data) {
                $('.modal').modal('hide');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $(".erorLabel").removeClass("invisible");
                $(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);
            }
        });
    })

    $.ajax({
        url: "/Users/GetAllRoles",
        method: "GET",
        dataType: 'json',
        success: function (data) {
            console.log(data)
            var listItems = "";
            var json = JSON.parse(JSON.stringify(data))
            for (var i = 0; i < json.length; i++) {
                listItems += "<option value='" + json[i].id + "'>" + json[i].name + "</option>";
            }
            $("#RoleID").append(listItems);
            $("#EditRoleID").append(listItems);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $(".erorLabel").removeClass("invisible");
            $(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);
        }
    });
})