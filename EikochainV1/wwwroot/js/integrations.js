


$(document).ready(function () {

    $('#btnIntegrationAdd').on('click', function () {
        $('#AddIntModal').modal('show')
    })

    $('.btnGenerateEmbedCode').on('click', function () {
        console.log("bam")
        window.location = GetBaseURL() + "Embed?integrationId=" + $(this).data("intid")
    })

   
    let urlParams = new URLSearchParams(window.location.search)
    let codeValue = '@@@';
    let authJsonRes = {}
    let shop = 'eikostoretest'
    let api_key = '70b727cbef24b32df0806af2a0813bc2'
    let shopifyAccessToken = '';
    let scopes = 'read_products'
    let redirect_uri = 'http://localhost:55951/Integrations'
    let shopifyProducts = ''
    let shopifyURL = ''
    let wooUrl = '';

    //if (urlParams.has('code')) {
    //    codeValue = urlParams.get('code');
    //    console.log(codeValue);
    //}

    //GetIntegration();

    //if (codeValue != '@@@') {
    //    $('#btnAuthShopify').prop("disabled", true);

    //    let shopifyURL = 'https://eikostoretest.myshopify.com/'

    //    $.ajax({
    //        url: GetBaseURL() + 'Integrations/Authorize?code=' + codeValue,
    //        method: "GET",
    //        success: function (response) {
    //            authJsonRes = JSON.parse(response)
    //            SaveIntegration('shopify', shopifyURL, authJsonRes.access_token, api_key)
    //        },
    //        error: function (XMLHttpRequest, textStatus, errorThrown) {
    //            //$(".erorLabel").removeClass("invisible");
    //            //$(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);
    //        }

    //    });

    //}

    let allChecked = false;
    $('#chkAll').on('change', function () {
        allChecked = !allChecked;
        $('.prodChkBox:visible').prop('checked', allChecked);
    })

    $('#btnAuthShopify').on('click', function () {
        console.log('Clicked here')
        let url = $('#shopifyURL').val();
        var newUrl = `${url}/admin/oauth/authorize?client_id=${api_key}&scope=${scopes}&redirect_uri=${redirect_uri}`
        window.location.href = newUrl;
    })

    $('#btnImportShopifyProducts').on('click', function () {
        if ($('#shopifyURL').val() == "") {
            sweetAlert("No url entered!");
            return;
        }

        $(".spinner-border").show();
        $("#btnImportShopifyProducts").prop("disabled", true);
        shopifyURL = $('#shopifyURL').val()

        if (shopifyURL.toLowerCase().indexOf("https://") === -1 && shopifyURL.toLowerCase().indexOf("http://") === -1) { shopifyURL = "https://" + shopifyURL; }

        $.ajax({
            url: GetBaseURL() + "Integrations/GetAllProducts?url=" + shopifyURL,
            //url: GetBaseURL() + "Integrations/GetAllProducts?accessToken=" + shopifyAccessToken,
            method: "GET",
            success: function (response) {              
                if (response.success) {
                    console.log(response.results)
                    shopifyProducts = JSON.parse(response.results)
                    console.log(shopifyProducts)
                    ShowProductsModal(shopifyProducts.products)
                    $(".spinner-border").hide();
                    $("#btnImportShopifyProducts").prop("disabled", false);
                }
                else {
                    sweetAlert(response.message);
                    $(".spinner-border").hide();
                    $("#btnImportShopifyProducts").prop("disabled", false);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //$(".erorLabel").removeClass("invisible");
                //$(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);  
                sweetAlert("Error fetching products! Please check url.");
                $(".spinner-border").hide();
                $("#btnImportShopifyProducts").prop("disabled", false);
            }

        });
        
    })

    $('#btnConfirmShopify').on('click', function () {
        //let shopifyURL = $('#shopifyURL').val()
        let importedProducts = []
        $('.prodChkBox').each(function (i, obj) {
            if ($(obj).is(':checked')) {
                let prodId = $(obj).val();
                let productObj = shopifyProducts.products.find((o) => {
                    if (o.id == prodId) {
                        return o
                    }

                })
                console.log(productObj)
                var prodImg = '';
                if (productObj.images && productObj.images.length) {
                    prodImg = productObj.images[0].src;
                }
                else if (productObj.image) {
                    prodImg = productObj.image.src;
                }
                importedProducts.push({
                    ExternalId: productObj.id,
                    ProductImage: prodImg,
                    ProductDescription: productObj.body_html,
                    ProductName: productObj.title,
                    Type: productObj.product_type,
                    Weight: productObj.variants[0].grams,
                    Tags: productObj.tags.join(','),
                    OrgId: $('#hiddenOrgId').val(),
                    Url: shopifyURL + "/products/" + productObj.handle
                })
            }
        })
        console.log(importedProducts)

        if (importedProducts.length === 0) {
            sweetAlert("No products selected.");
            return;
        }

        $.ajax({
            url: GetBaseURL() + "Integrations/CompleteImport",
            method: "POST",
            data: { products: JSON.stringify(importedProducts), url: shopifyURL, type: "shopify" },
            success: function (response) {
                //sweetAlert("Integration Completed. Please see products page.");
                sweetAlert({
                    title: "Integration Completed",
                    text: "Please see products page.",
                    icon: "success",
                    buttons: true
                }).then((result) => {
                    if (result) {
                        window.location.reload();
                    }
                })
                $('.modal').modal('hide')
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                sweetAlert("Integration Failed.");
                $('.modal').modal('hide')
            }

        });



    })

    $('#searchInput').on('input', function () {

        var searchVal = $('#searchInput').val().toLowerCase();

        console.log('searchVal ' + searchVal);

        $('.productTitle').each(function (i, title) {

            console.log('title ' + $(this).text());
            var productTitle = $(this).text().toLowerCase()

            if (productTitle.indexOf(searchVal) == -1) {
                console.log("not found")
                $(this).closest('.productRow').hide();
            }
            else {
                $(this).closest('.productRow').show();
            }
        });

    })

    $('#btnImportWooProducts').on('click', function () {
        if ($('#wooURL').val() == "") {
            sweetAlert("No url entered!");
            return;
        }

        $(".spinner-border").show();
        $("#btnImportWooProducts").prop("disabled", true);
        wooUrl = $('#wooURL').val()

        if (wooUrl.toLowerCase().indexOf("https://") === -1 && wooUrl.toLowerCase().indexOf("http://") === -1) { wooUrl = "https://" + wooUrl; }

        $.ajax({
            url: GetBaseURL() + "Integrations/GetAllWooProducts?url=" + wooUrl,
            //url: GetBaseURL() + "Integrations/GetAllProducts?accessToken=" + shopifyAccessToken,
            method: "GET",
            success: function (response) {
                if (response.success) {
                    console.log(response.results)
                    $(".spinner-border").hide();
                    $("#btnImportWooProducts").prop("disabled", false);
                }
                else {
                    sweetAlert(response.message);
                    $(".spinner-border").hide();
                    $("#btnImportWooProducts").prop("disabled", false);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //$(".erorLabel").removeClass("invisible");
                //$(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);  
                sweetAlert("Error fetching products! Please check url.");
                $(".spinner-border").hide();
                $("#btnImportWooProducts").prop("disabled", false);
            }

        });

    })
    function SaveIntegration(typeStr, urlStr, tokenStr, keyStr) {
        let integrationData = {
            Type: typeStr,
            Url: urlStr,
            Token: tokenStr,
            ApiKey: keyStr
        }
        $.ajax({
            url: GetBaseURL() + 'Integrations/SaveIntegration',
            method: "Post",
            data: integrationData,
            success: function (response) {
                sweetAlert("Integration Completed. Please see products page.");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //$(".erorLabel").removeClass("invisible");
                //$(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);
            }

        });
    }

    function GetIntegration() {
        $.ajax({
            url: GetBaseURL() + 'Integrations/GetIntegration',
            method: "GET",
            success: function (response) {
                shopifyAccessToken = response.Token

                if (shopifyAccessToken)
                    $('#btnAuthShopify').prop("disabled", true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                //$(".erorLabel").removeClass("invisible");
                //$(".errorMessage").text("Status: " + textStatus + "Error: " + errorThrown);
            }

        });
    }

    function ShowProductsModal(products) {
        $('#shopifyModalBody').empty();

        for (var product of products) {
            var imgSrc = '';
            if (product.images[0])
            imgSrc = product.images[0].src;

            $('#shopifyModalBody').append(`
            <div class='row productRow'>
                <div class="col-md-5 align-items-center d-flex">
                    <h6 class='productTitle mb-0'>${product.title}</h6>
                </div>
                <div class="col-md-3 align-items-center d-flex">
                    <h6 class='productTitle mb-0'>${product.product_type}</h6>
                </div>
                <div class="col-md-2 justify-content-center align-items-center d-flex">
                    <img style="max-height: 60px;" src="${imgSrc}"/>
                </div>
                <div class="col-md-2 justify-content-center align-items-center d-flex">
                    <input type="checkbox" class="prodChkBox text-center" value=${product.id}  />
                </div>
            </div>
            `)
        }
        $('#shopifyModal').modal('show')
    }

});
