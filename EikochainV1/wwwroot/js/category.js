var screenHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
//$('#UpdateForm, #NewForm').parsley();
var currentCatId = '';
$(document).ready(() => {

    console.log('Bam')
    $('#categoryDatatable').DataTable();
 
});

/*$('form').areYouSure();*/

$(document).on("click", ".editCategory", function (e) {
    var dataCatId = $(this).data("catvalue")
    currentCatId = $(this).data("catid")
    $('#categoryInput').val(dataCatId)
    $("#categoryEditModal").modal('show');
})

$(document).on("click", "#addCatBtn", function (e) {
    $("#categoryAddModal").modal('show');
})

$('#btnConfirmCat').on('click', function () {
    $.ajax({
        url: GetBaseURL() + "Category/Add?categoryName=" + $('#categoryAddInput').val(),
        //url: GetBaseURL() + "Integrations/GetAllProducts?accessToken=" + shopifyAccessToken,
        method: "GET",
        success: function (response) {
            console.log(response)
            location.reload();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //$(".erorLabel").removeClass("invisible");
            //$(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);
        }

    });
})

$('#btnUpdateCat').on('click', function () {
 
    $.ajax({
        url: GetBaseURL() + "Category/Update",
        method: "POST",
        data: {
            categoryName: $('#categoryInput').val(),
            categoryId: currentCatId
        },
        success: function (response) {
            if (response == "OK") {
                $("#categoryEditModal").modal('hide');
                swal("Success!", "Category Updated", "success");
                location.reload();
            }
            else if (response.status === "FAILED") {
                $('.alert').show();
                $("#responseMessage").text(response.msg);

            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('.alert').show();
            $("#responseMessage").text("Status: " + textStatus + "Error: " + errorThrown);

        }
    });
})


$(document).on("click", ".deleteCategoryBtn", function (e) {
    e.preventDefault();
    var dataCatId = $(this).data("catid")

    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this category!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: GetBaseURL() + "Category/Delete?categoryId=" + dataCatId,
                    method: "GET",
                    success: function (response) {
                        if (response == "OK") {
                            swal("Success!", "Category Deleted", "success");
                            window.reload();
                        }
                        else if (response.status === "FAILED") {
                            $('.alert').show();
                            $("#responseMessage").text(response.msg);

                        }

                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $('.alert').show();
                        $("#responseMessage").text("Status: " + textStatus + "Error: " + errorThrown);

                    }
                });
            }
        });

});

//document.getElementById("Cancel").onclick = function () {
//    window.location.replace(GetBaseURL() + "Product");
//};


