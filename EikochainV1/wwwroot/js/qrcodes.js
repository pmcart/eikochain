$(document).ready(function () {
    $('#scDatatable').DataTable();
    var selectedScId = ''

    $(document).on("change", ".custom-control-input", function (e) {
        $('.custom-control-input').not(this).prop('checked', false);

        if (this.checked)
            selectedScId = $(this).attr('id')
        else
            selectedScId = null

        console.log(selectedScId)
    })

    $(document).on("click", "#btnReassignQrCode", function (e) {

        $('#selectedQrCode').val($(this).data('qid'))
        $('#SelectScModal').modal('show');

        $.ajax({
            url: GetBaseURL() + "SupplyChains/GetAll",
            method: "GET",
            success: function (response) {
                $('#supplyChainList').empty();

                var ccCounter = 0;
                for (var i of response) {

                    $('#supplyChainList').append(`
                <li class="list-group-item sc-list-item">                                    
                    <label class="custom-control-label w-100" for="${i.id}">
                        <input type="checkbox" class="custom-control-input form-check-input" id="${i.id}" > 
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


    $(document).on("click", "#selectScBtn", function (e) {

        if (!selectedScId) {
            $('#SelectScModal').modal('hide');
            return;
        }

        var dataQrId = $('#selectedQrCode').val();
        $.ajax({
            url: GetBaseURL() + "QrCodes/AssignSupplyChain?SupplyChainId=" + selectedScId + "&QrCodeId=" + dataQrId,
            method: "GET",
            success: function (response) {
                $('#SelectScModal').modal('hide');
                window.location.reload();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });

    })


    $(document).on("click", "#viewQrCode", function (e) {
        var QrCodeId = $(this).data("qrid")
        $.ajax({
            url: GetBaseURL() + "QrCodes/GetQr",
            data: { ID: QrCodeId },
            success: function (response) {
                //console.log(response)

                $('#imgQrCode').attr("src", response)
                $('#downloadQrCode').attr("href", response)

                var supChainId = $('#SupplyChainId').val()
                var supplyChain = {
                    Id: supChainId,
                    Title: $('#title').val(),
                    SupplyChainData: GetSupplyChainData()
                }
                $.ajax({
                    method: 'POST',
                    url: GetBaseURL() + "SupplyChains/UpdatePreview",
                    data: { sc: supplyChain },
                    success: function (response) {
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {

                    }
                });

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
        $('#qrModal').modal('show')
    })

})