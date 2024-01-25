$(document).ready(function () {

    $(document).on("change", '.upload', function () {

        var form_Data = new FormData();
        var fileUpload = $(this).get(0);
        var files = fileUpload.files;
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var fileName = files[i].name;
                var flExt = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
                if ($.inArray(flExt.toLowerCase(), ['gif', 'png', 'jpg', 'bmp', 'jpeg']) !== -1)
                    form_Data.append("file", files[i]);
                else { alert("Invalid File"); return false; }
            }
        }

        $.ajax({
            type: "POST",
            url: GetBaseURL() + 'Settings/ImageUpload',
            data: form_Data,
            cache: false,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {

                if (data !== "!OK") {
                    // $("#ProductImage").val(data);
                    //ImageElement.css('background-image', 'url("' + GetBaseURL() + "ProductImages/" + data + '")');
                    // ImageElement.attr('src', GetBaseURL() + "ProductImages/" + data + "");

                    $('#Logo').css('display', '');
                    $('#Logo').attr('src', data);
                    $('#sidemenuLogo').attr('src', data);
                    $('#logoImageUrl').val(data);
                    $('#saveBtn').prop("disabled", false);

                    currentImageUrl = data;
                    sweetAlert("Image uploaded successfully");
                }
            },
            error: function (jqXHR, exception) {
                //console.log(exception)
                //console.log(jqXHR)
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not Connected, Verify Network/Internet.';
                } else if (jqXHR.status === 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status === 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else if (jqXHR.status === 403) {
                    msg = 'Access Denied. Contact Your Administrator.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                sweetAlert("Error in Uploading Image!", msg, "error");
            }
        });

    });

    $(document).on("click", "#saveBtn", function () {

        if ($("#logoImageUrl").val() == "") {
            alert("No image selected!");
            return false;
        }

        $.ajax({
            url: GetBaseURL() + "Settings/UpdateLogoUrl",
            method: "POST",
            data: { filePath : $('#logoImageUrl').val() },
            success: function (response) {

                sweetAlert("Changes saved!");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                sweetAlert("Error updating!");
            }
        });
    });

})
