$(document).ready(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
        var sideBarOpen = false;

        //$('#sidebar').copyCSS('#stepsContainerSide', ['background']);  // copy just top and left

        let $original = $('#stepsContainerSide');
        let $target = $('#sidebar');

        $target
            .prop("style", $original.attr("style"))
            .addClass($original.attr("class"));
        // The viewport is less than 768 pixels wide
        //alert("This is a mobile device.");

        $('#stepTabs').hide();
        var stepTabsList = $('#stepTabs').children('li');

        $.each(stepTabsList, function () {
            console.log($(this))
            var tabName = $(this)[0].innerHTML;
            var id = $(this).attr('id');
            $('#sidebarUl').append(` <li id="${id}" class="active">${tabName}</li>`)
        })

        var images = $('img').not("#eikochainPoweredByImg")

        $.each(images, function () {
            $(this).css('width', '100%');
            $(this).css('height','auto');
        })

        setTimeout(function () {
            
            var stepCols = $('.stepContainerCol')

            console.log(stepCols)
            $.each(stepCols, function () {
                $(this).removeAttr("style");
            })
        }, 0)

        $('.tabItem ').on('click', function () {
            if (!sideBarOpen) {


                $('#sidebar').addClass('active');
                // fade in the overlay
                $('.overlay').addClass('active');
                $('.collapse.in').toggleClass('in');
                $('a[aria-expanded=true]').attr('aria-expanded', 'false');
            }
            else {
                $('#sidebar').removeClass('active');
                // hide overlay
                $('.overlay').removeClass('active');
            }

            sideBarOpen = !sideBarOpen;

        })
   

        $('#sidebarCollapse').on('click', function () {
            // open sidebar
            if (!sideBarOpen) {


                $('#sidebar').addClass('active');
                // fade in the overlay
                $('.overlay').addClass('active');
                $('.collapse.in').toggleClass('in');
                $('a[aria-expanded=true]').attr('aria-expanded', 'false');
            }
            else {
                $('#sidebar').removeClass('active');
                // hide overlay
                $('.overlay').removeClass('active');
            }

            sideBarOpen = !sideBarOpen;

        });



    } else {
        // The viewport is at least 768 pixels wide
        //alert("This is a tablet or desktop.");
       
        $('#sidebar').hide();
        $('#sidebarCollapse').hide();

        $('#stepTabs').css('margin', '0 auto');
        $('#stepTabs').css('width', '150px');
        $('#stepsContainerMain').css('max-width', '525px');
    }

    let scId = $('#SupplyChainId').val();

    $('.nav-link').on('click', function () {
        let stepId = $(this).parent().attr("id")  
        console.log("Checking session storage")
        if (sessionStorage.getItem(stepId) == null) {
            sessionStorage.setItem(stepId, "clicked");
            console.log("Step not recorded yet so recording a view now")
            $.ajax({
                method: 'POST',
                url: GetBaseURL() + "SupplyChains/UpdateStepClicks",
                data: {
                    id: scId,
                    source: "Qr",
                    stepId: stepId
                },
                success: function (response) {
                    console.log(response);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        }
    });
    
    if (sessionStorage.getItem(scId) == null) {
        sessionStorage.setItem(scId, "viewed");
        console.log("View not recorded yet so recording a view now")
        $.ajax({
            method: 'POST',
            url: GetBaseURL() + "SupplyChains/UpdateSupplyChainViews",
            data: {
                id: scId,
                source: "Qr"
            },
            success: function (response) {
                console.log(response);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    }
});