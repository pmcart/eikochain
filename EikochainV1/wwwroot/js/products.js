var screenHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
//$('#UpdateForm, #NewForm').parsley();

var selectedScId = ''
var currentQrScId = ''
var currentProdId = ''
$('#btnPreviewQR').on('click', function () {
    //$('#qrPreviewModal').modal('show')
    var supChainId = currentQrScId;
    //var win = window.open(GetBaseURL() + "Preview/Index?id=" + supChainId, '_blank');
    //if (win) {
    //    //Browser has allowed it to be opened
    //    win.focus();
    $('#qrPreviewFrame').attr('src', GetBaseURL() + "SupplyChains/View?id=" + supChainId)
        $('#qrPreviewModal').modal('show')
    //} else {
    //    //Browser has blocked it
    //    alert('Please allow popups for this website');
    //}
})


$(document).ready(() => {

    console.log('Bam')
    $('#productsDatatable').DataTable();
  
    $('#gridViewTab').on('click', function () {
        $('#listLi').removeClass('active')
        $('#gridLi').addClass('active')
        $('#ListView').hide()
        $('#GridView').show()

    })

    $('#listViewTab').on('click', function () {
        $('#gridLi').removeClass('active')
        $('#listLi').addClass('active')
        $('#GridView').hide()
        $('#ListView').show()

    })

});

$(document).on("click", "#showScListBtn", function (e) {
    var dataProdId = $(this).data("productid")
    selectedScId = $(this).data("scid")
    var checkedState = '';

    $('#selectedProdId').val(dataProdId);
    $('#SelectScModal').modal('show');

    $.ajax({
        url: GetBaseURL() + "SupplyChains/GetAll",
        method: "GET",
        success: function (response) {
            $('#supplyChainList').empty();

            var ccCounter = 0;
            for (var i of response) {
                
                checkedState = ''
                //ccCounter == 0
                if (i.id == selectedScId) {
                    checkedState = 'checked'
                    //selectedScId = i.id;
                }
               //else
                 //  checkedState = ''

                //ccCounter++;

                $('#supplyChainList').append(`
                <li class="list-group-item sc-list-item">                                    
                    <label class="custom-control-label w-100" for="${i.id}">
                        <input type="checkbox" ${checkedState} class="custom-control-input form-check-input" id="${i.id}" > 
                        ${i.title}
                    </label>
                  
                </li>
            `)
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });

})

$(document).on("change", ".custom-control-input", function (e) {
    $('.custom-control-input').not(this).prop('checked', false);

    if (this.checked)
        selectedScId = $(this).attr('id')
    else 
        selectedScId = null

    console.log(selectedScId)
})

$(document).on("click", ".editProductBtn", function (e) {
    var dataProdId = $(this).data("productid")
    window.location.href = '/products/edit?ProductId=' + dataProdId;
})

$(document).on("click", ".btnDeleteSupplyChainLink", function (e) {
    var scId = $(this).data("scid")
    var prodId = $(this).data("prodid")

    $.ajax({
        url: GetBaseURL() + "Products/RemoveSupplyChain?SupplyChainId=" + scId + "&ProductId=" + prodId,
        data: { ID: currentQrScId },
        success: function (response) {
            window.location.reload();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });

})

$(document).on("click", ".closeModal", function (e) {
    $('.modal').modal('hide');
    $('#btnConfirmCopyEmbed').html("Copy");
    $("#embedElementIdInput").val("")
    $('#embedTxtInput').val(`<script data-target="{ID_OF_ELEMENT_TO_ADD_INTO}" id="eikochainjs" data-productid="${currentProdId}"  data-styles="" src="https://eikochaincdn.blob.core.windows.net/scripts/eikochainweb.js"></script>`)
})

$(document).on("click", "#showQrModalBtn", function (e) {
    var dataProdId = $(this).data("productid")
    currentQrScId = $(this).data("scid")
    $('#qrModal').modal('show');

        $.ajax({
            url: GetBaseURL() + "Products/GenerateQR",
            data: { ID: currentQrScId },
            success: function (response) {
                console.log(response)

                $('#imgQrCode').attr("src", response)

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
       
})

$(document).on("click", ".btnGenerateEmbedCode", function (e) {
    currentProdId = $(this).data("prodid")
    currentQrScId = $(this).data("scid")
    $('#embedCodeModal').modal('show');

    $('#embedTxtInput').val(`<script data-target="{ID_OF_ELEMENT_TO_ADD_INTO}" id="eikochainjs" data-productid="${currentProdId}"  data-styles="" src="https://eikochaincdn.blob.core.windows.net/scripts/eikochainweb.js"></script>`)
})

$(document).on("click", "#selectScBtn", function (e) {

    if (!selectedScId) {
        $('#SelectScModal').modal('hide');
        return;
    }

    var dataProdId = $('#selectedProdId').val();
    $.ajax({
        url: GetBaseURL() + "Products/AssignSupplyChain?SupplyChainId=" + selectedScId + "&ProductId=" + dataProdId + "&AssignToAll=" + $('#flexCheckDefault').is(":checked"),
        method: "GET",
        success: function (response) {
            $('#SelectScModal').modal('hide');
            window.location.reload();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
       
})

$(document).on("click", "#btnConfirmCopyEmbed", function (e) {
    navigator.clipboard.writeText($('#embedTxtInput').val()).then(function () {
        $('#btnConfirmCopyEmbed').html("Copied !")
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
})


$("#embedElementIdInput").on("input", function (e) {
    var elementId = $("#embedElementIdInput").val()

    if (elementId == "") {
        $('#embedTxtInput').val(`<script data-target="{ID_OF_ELEMENT_TO_ADD_INTO}" id="eikochainjs" data-productid="${currentProdId}"  data-styles="" src="https://eikochaincdn.blob.core.windows.net/scripts/eikochainweb.js"></script>`)
    } else {
        $('#embedTxtInput').val(`<script data-target="${elementId}" id="eikochainjs" data-productid="${currentProdId}"  data-styles="" src="https://eikochaincdn.blob.core.windows.net/scripts/eikochainweb.js"></script>`)
    }        
})

$(document).on("click", ".deleteProductBtn", function (e) {
    var dataProdId = $(this).data("productid")
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this product!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                
                $.ajax({
                    url: GetBaseURL() + "Products/Delete?productid=" + dataProdId,
                    method: "GET",
                    success: function (response) {
                        swal("File deleted!", {
                            icon: "success",
                        });
                        $('#' + dataProdId).remove();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {

                    }
                });      
            } 
        });
 
})
/*$('form').areYouSure();*/

$(document).on("click", ".jssaveProduct", function (e) {

    if ($('#ProductName').val() == "") {
        sweetAlert("No product name entered!");
        return;
    }

    console.log(e.target.id);

    var redirect = "Products";
    if (e.target.id == "saveAddBtn") {
        redirect = "Products/Add";
    }

    $(this).children(".spinner-border").show();
    $(".btn").prop("disabled", true);
    
    var fileUpload = $("#ImageUpload").get(0);
    var files = fileUpload.files;

    var product = {};
    var formData = new FormData();
   
    product.ProductName = $('#ProductName').val();
    product.ProductDescription = $('#ProductDescription').val();
    product.ProductSize = $('#ProductSize').val();
    product.CategoryId = $('#categoriesDropDown').val();
    product.Url = $('#ProductUrl').val();

    var productJSON = JSON.stringify(product);

    Object.keys(product).forEach(key => {
        formData.append("product." + key, product[key]);
    });

    // Looping over all files and add it to FormData object  
    for (var i = 0; i < files.length; i++) {
        console.log('(files[i].name:' + files[i].name);
        formData.append('imgFile', files[i]);
    }

    var catList = []
    $('.categoryBadge').each(function () {
        catList.push($(this).attr('id'));
    });

    formData.append('categoryList', catList);

    $.ajax({
        type: 'POST',
        url: '/Products/Add',
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (data) {
            console.log(data)
            swal("Success!", "Product created successfully!", "success");
            $(".spinner-border").hide();
            $(".btn").prop("disabled", false);

            setTimeout(function () {
                window.location = GetBaseURL() + redirect
            }, 500);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            
        }
    });
});

$(document).on("click", "#jsupdateProduct", function (e) {

    if ($('#ProductName').val() == "") {
        sweetAlert("No product name entered!");
        return;
    }

    $(this).children(".spinner-border").show();
    $(".btn").prop("disabled", true);

    var fileUpload = $("#ImageUpload").get(0);
    var files = fileUpload.files;

    var product = {};
    var formData = new FormData();
    product.Id = $('#ProductID').val();
    product.OrgId = $('#ProductOrgID').val();
    product.ProductName = $('#ProductName').val();
    product.ProductDescription = $('#ProductDescription').val();
    product.ProductSize = $('#ProductSize').val();
    product.CategoryId = $('#categoriesDropDown').val();
    product.Url = $('#ProductUrl').val();

    var productJSON = JSON.stringify(product);

    Object.keys(product).forEach(key => {
        formData.append("product." + key, product[key]);
    });

    // Looping over all files and add it to FormData object  
    for (var i = 0; i < files.length; i++) {
        console.log('(files[i].name:' + files[i].name);
        formData.append('imgFile', files[i]);
    }
    var catList = []
    $('.categoryBadge').each(function () {
        catList.push($(this).attr('id'));
    });
    formData.append('categoryList', catList);
    $.ajax({
        type: 'POST',
        url: '/Products/Edit',
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (data) {
            console.log(data)
            $(".spinner-border").hide();
            $(".btn").prop("disabled", false);
            swal("Success!", "Product updated successfully!", "success");
            setTimeout(function () {
                window.location = GetBaseURL() + "Products"
            }, 500);
        }
    });
});

//$(document).on("click", "#jsupdateProduct", function (e) {
//    e.preventDefault();
//    $.ajax({
//        url: GetBaseURL() + "Product/Update",
//        method: "POST",
//        data: $('#NewForm').serialize(),
//        success: function (response) {
//            if (response == "OK") {
//                swal("Success!", "Product Updated Successfully", "success");
//                setTimeout(function () { window.location.replace(GetBaseURL() + "Product") }, 2000);

//            }
//            else if (response.status === "FAILED") {
//                $('.alert').show();
//                $("#responseMessage").text(response.msg);

//            }

//        },
//        error: function (XMLHttpRequest, textStatus, errorThrown) {
//            $('.alert').show();
//            $("#responseMessage").text("Status: " + textStatus + "Error: " + errorThrown);

//        }
//    });
//});

$(document).on("click", "#btnAddCategory", function (e) {
    e.preventDefault(); 
    var catText = $('#categoriesDropDown option:selected').text();
    var catVal = $('#categoriesDropDown').val();
    if ($("#" + catVal).length == 0) {
        $('#categoryDiv').append(`<span id=${catVal} class="badge bg-secondary categoryBadge">${catText} <i style="margin-left:5px; cursor:pointer;" class="fa fa-times remove-badge" aria-hidden="true"></i></span>`)
    }
   
});
$(document).on("click", ".remove-badge", function (e) {
    $(this).parent().remove();

});
//document.getElementById("Cancel").onclick = function () {
//    window.location.replace(GetBaseURL() + "Product");
//};

$("#UpdateForm").submit(function (e) {
    e.preventDefault();
    $.ajax({
        url: GetBaseURL() + "Product/Update",
        method: "POST",
        data: $('#UpdateForm').serialize(),
        success: function (response) {
            if (response === "OK") {
                $('#UpdateForm')[0].reset();
                $('#UpdateModel').modal('toggle');
                swal("Success!", "Product Updated Successfully", "success");
                $('#Grid').data('kendoGrid').dataSource.read()


            }
            else {
                swal("Error!", response, "error");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $(".erorLabel").removeClass("invisible");
            $(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);
        }
    });
});

$("#frmProductUrl").submit(function (e) {
    e.preventDefault();
    $.ajax({
        url: GetBaseURL() + "Product/UpdateUrl",
        method: "POST",
        data: $('#frmProductUrl').serialize(),
        success: function (response) {
            if (response === "OK") {
                $('#frmProductUrl')[0].reset();
                $('#ProductUrlDialog').modal('toggle');
                swal("Success!", "Product url updated Successfully", "success");
                $('#Grid').data('kendoGrid').dataSource.read()


            }
            else {
                swal("Error!", response, "error");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $(".erorLabel").removeClass("invisible");
            $(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);
        }
    });
});

$("#NewForm").submit(function (e) {
    e.preventDefault();
    var fileUpload = $("#ImageUpload").get(0);
    var files = fileUpload.files;

    var product = {};
    var formData = new FormData();
    product.ProductName = $('#ProductName').val();
    product.ProductDescription = $('#ProductDescription').val();
    product.ProductSize = $('#ProductSize').val();
    product.CategoryId = $('#CategoryId').val();
    
    var productJSON = JSON.stringify(product);

    Object.keys(product).forEach(key => {
        formData.append("product." + key, product[key]);
    });
   
    // Looping over all files and add it to FormData object  
    for (var i = 0; i < files.length; i++) {
        console.log('(files[i].name:' + files[i].name);
        formData.append('imgFile', files[i]);
    }

    $.ajax({
        type: 'POST',
        url: 'Products/Add',
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (data) {
            console.log(data)
        }
    });
    //$.ajax({
    //    url: GetBaseURL() + "Product/Add",
    //    method: "POST",
    //    data: $('#NewForm').serialize(),
    //    success: function (response) {

    //        if (response === "OK") {
    //            $('#NewForm')[0].reset();
    //            $('#NewModel').modal('toggle');
    //            swal("Success!", "Product Added Successfully", "success");

    //        }
    //        else {
    //            swal("Error!", response, "error");
    //        }
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        $(".erorLabel").removeClass("invisible");
    //        $(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);
    //    }
    //});
});

$('#addProdImageBtn').on('click', function () {
    $("#ImageUpload").trigger('click')
})

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#Image').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#ImageUpload").on('change', function () {
    readURL(this);
    /*var form_Data = new FormData();*/
    //fileUpload = $("#ImageUpload").get(0);
    //var files = fileUpload.files;
    //if (files.length > 0) {
    //    for (var i = 0; i < files.length; i++) {
    //        var fileName = files[i].name;
    //        var flExt = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
    //        if ($.inArray(flExt.toLowerCase(), ['gif', 'png', 'jpg', 'bmp', 'jpeg']) !== -1)
    //            form_Data.append("file", files[i]);
    //        else { alert("Invalid File"); return false; }
    //    }
    //}

    //$.ajax({
    //    type: "POST",
    //    url: GetBaseURLs() + 'Products/FileUpload',
    //    data: form_Data,
    //    cache: false,
    //    contentType: false,
    //    processData: false,
    //    async: false,
    //    success: function (data) {
    //        if (data !== "!OK") {
    //            $("#ProductImage").val(data);
    //            $("#Image").attr('src', GetBaseURL() + "ProductImages/" + data + "");
    //        }

    //    },
    //    error: function (jqXHR, exception) {
    //        var msg = '';
    //        if (jqXHR.status === 0) {
    //            msg = 'Not Connected, Verify Network/Internet.';
    //        } else if (jqXHR.status === 404) {
    //            msg = 'Requested page not found. [404]';
    //        } else if (jqXHR.status === 500) {
    //            msg = 'Internal Server Error [500].';
    //        } else if (exception === 'parsererror') {
    //            msg = 'Requested JSON parse failed.';
    //        } else if (exception === 'timeout') {
    //            msg = 'Time out error.';
    //        } else if (exception === 'abort') {
    //            msg = 'Ajax request aborted.';
    //        } else if (jqXHR.status === 403) {
    //            msg = 'Access Denied. Contact Your Administrator.';
    //        } else {
    //            msg = 'Uncaught Error.\n' + jqXHR.responseText;
    //        }
    //        sweetAlert("Error in Uploading Image!", msg, "error");
    //    }
    //});

});

$(document).on('click', '.jsDeleteProduct', function () {
    var Value = $(this).data('id');
    var element = $(this).closest('div.jsContainer');
    $.confirm({
        title: 'Confirmation?',
        content: 'Delete  Request Will Automatically  \'cancel\' in 6 seconds if you don\'t respond.',
        autoClose: 'cancelAction|8000',
        escapeKey: true,
        backgroundDismiss: false,
        typeAnimated: true,
        buttons: {
            deleteUser: {
                text: 'Delete',
                btnClass: 'btn-red',
                action: function () {
                    var option = {
                        action: "Delete",
                        controller: "Product",
                        dataType: "text",
                        data: { ID: Value }
                    };
                    $.fn.ajaxCall(option).done(function (response) {

                        if (response === "OK") {
                            $.fn.successMsg("Product deleted successfully");
                            element.addClass('hidden');
                            $('#Grid').data('kendoGrid').dataSource.read();
                        }
                        else
                            $.fn.successMsg(response);
                    });
                }
            },
            cancelAction: {
                text: 'Cancel',
                action: function () { $.alert('Delete Request is Canceled') }
            }
        }
    });

});

$(document).on('click', '.jsUpdateUrl', function () {
    var Value = $(this).data('id');

    $.ajax({
        url: GetBaseURL() + "Product/Get",
        data: { ID: Value },
        success: function (response) {

            $('#UrlProductID').val(response.ProductID);
            $('#Url').val(response.Url);
            $('#ProductUrlDialog').modal('toggle');


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $(".erorLabel").removeClass("invisible");
            $(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);
        }
    });

});

$(document).on('click', '.jsEditSupplyChain', function () {
    var Value = $(this).data('id');
    window.location.replace(GetBaseURL() + "Product/SupplyChain/" + Value);
});

function Edit(Value) {
    window.location.replace(GetBaseURL() + "Product/Edit/" + Value);
}

function Delete(Value) {

    $.confirm({
        title: 'Confirmation?',
        content: 'Delete  Request Will Automatically  \'cancel\' in 6 seconds if you don\'t respond.',
        autoClose: 'cancelAction|8000',
        escapeKey: true,
        backgroundDismiss: false,
        typeAnimated: true,
        buttons: {
            deleteUser: {
                text: 'Delete',
                btnClass: 'btn-red',
                action: function () {
                    var option = {
                        action: "Delete",
                        controller: "Product",
                        dataType: "text",
                        data: { ID: Value }
                    };
                    $.fn.ajaxCall(option).done(function (response) {

                        if (response === "OK") {
                            $.fn.successMsg("Product deleted successfully");
                            $('#Grid').data('kendoGrid').dataSource.read();
                        }
                        else
                            $.fn.successMsg(response);
                    });
                }
            },
            cancelAction: {
                text: 'Cancel',
                action: function () { $.alert('Delete Request is Canceled') }
            }
        }
    });




}

function GetAllProduct() {
    $("#Grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: "/Product/GetAll",

                },
            },
            serverPaging: true,
            schema: {
                type: 'json',
                data: 'msg',
                total: "total",
                model: {
                    id: "ProductID",
                    fields: {
                        ProductID: { type: "guid" },
                        ProductName: { type: "string" },
                        Url: { type: "string" },
                        CategoryName: { type: "string" },
                        CreatedDateTime: { type: "date" },
                        ModifiedDateTime: { type: "date" },
                        CreatedName: { type: "string" },
                        ModifiedName: { type: "string" }

                    }
                }
            },
            pageSize: 100
        },
        height: (screenHeight > 768) ? screenHeight - 310 : 440,
        sortable: false, groupable: false, filterable: true, reorderable: false, resizable: true, noRecords: true,
        selectable: "row",
        messages: {
            noRecords: "No Product Found."
        },
        pageable: { refresh: true, pageSizes: ['All', 20, 35, 50, 100], buttonCount: 5 },
        dataBound: function () {
            if ($("#Grid").length && $("#Grid").columns)
                for (var i = 0; i < $("#Grid").columns.length; i++) {
                    if (i !== 0) {
                        $("#Grid").autoFitColumn(i);
                    }
                }
        },

        columns: [{
            template: '<button class="btn btn-primary btn-product" title="Supply Chain" onclick=EditSupplyChain("#: ProductID #")><i class="icon-layers"></i></button>\
                      <button class= "btn btn-success btn-product" title="Update Url" onclick=UpdateUrl("#: ProductID #") > <i class="icon-link"></i></button>\
                      <button class= "btn btn-info btn-product" title="Edit Product" onclick=Edit("#: ProductID #") > <i class="icon-pencil"></i></button>\
                      <button class= "btn btn-info btn-product" title="Generate QR" onclick=GenerateQR("#: ProductID #") > <i class="fa fa-qrcode"></i></button>\
                      <button class= "btn btn-danger btn-product" title="Delete Product" onclick=Delete("#: ProductID #") > <i class="fa fa-trash"></i></button> '
            ,
            width: 220
        },
        {
            width: 120,
            template: '<img src="#: ProductImage #" title=\"image\" height=\"64\" alt=\"image\"/>'
        },
        //columns.Bound(u => u.Image).ClientTemplate("#=GetImage(data.Image)#").HtmlAttributes(new { style = "text-align: center; width: 30%; min-width: 60px;" }),
        { field: "ProductName", title: "Product", width: 180, filterable: false },
        { field: "CategoryName", title: "Category", width: 180, filterable: false },
        { field: "Url", title: "Url", width: 140, filterable: false },
        { field: "CreatedName", title: "Created By", width: 120, filterable: false },
        { field: "CreatedDateTime", title: "Created Date", format: "{0:dd-MMM-yyyy}", parseFormats: ["MM/dd/yyyy"], width: 120, filterable: false },
        { field: "ModifiedName", title: "Modified By", width: 120, template: '#if(data.ModifiedName === null){#<span class="badge badge-danger"> No Modifications </span>#}else {##: ModifiedName ##  }#', filterable: false },
        { field: "ModifiedDateTime", title: "Modified Date", width: 120, template: '#if(data.ModifiedDateTime === null){#<span class="badge badge-danger"> No Modifications </span>#}else {##: kendo.toString(kendo.parseDate(ModifiedDateTime), "dd-MMM-yyyy") ##  }#', filterable: false }
        ]
    });
}

function EditSupplyChain(Value) {
    window.location.replace(GetBaseURL() + "Product/SupplyChain/" + Value);

}

function UpdateUrl(Value) {
    $.ajax({
        url: GetBaseURL() + "Product/Get",
        data: { ID: Value },
        success: function (response) {

            $('#UrlProductID').val(response.ProductID);
            $('#Url').val(response.Url);
            $('#ProductUrlDialog').modal('toggle');


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $(".erorLabel").removeClass("invisible");
            $(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);
        }
    });
}

function GenerateQR(Value) {
    $.ajax({
        url: GetBaseURL() + "Product/GenerateQR",
        data: { ID: Value },
        success: function (response) {
            console.log(response)

            $('#imgQrCode').attr("src", response)

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
    $('#qrModal').modal('show')
}
