$(document).ready(function () {
    $('#scDatatable').DataTable();


    $(document).on("click", "#loadSupplyChainEditor", function (e) {
        var dataProdId = $(this).data("productid")
        window.location.href = '/supplychains/edit?id=' + dataProdId;
    })

    $(document).on("click", ".btnDeleteProduct", function (e) {


        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this supply chain!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    var dataProdId = $(this).data("productid")
                  
                    $.ajax({
                        url: GetBaseURL() + "supplychains/Delete?SupplyChainId=" + dataProdId,
                        method: "GET",
                        success: function (response) {
                            swal("Supply Chain deleted!", {
                                icon: "success",
                            });
                            window.location.reload();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {

                        }
                    });
                }
            });
    })

})