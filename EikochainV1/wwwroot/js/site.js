function GetBaseURL() {
    var baseUrl;
    //baseUrl = '@VirtualPathUtility.ToAbsolute("~/")';
    if (window.location.hostname.includes("localhost")) {
        var portNum = window.location.port;
        return "https://" + window.location.hostname + ":" + portNum + "/";
    }
    return "https://" + window.location.hostname + "/";
    //return baseUrl;
}

$(document).ready(() => {
    var currentUrl = window.location.pathname.toLowerCase();
    console.log("The current page is " + currentUrl)
    //$('.side-menu').removeClass('active');

    $('.side-menu').each(function (i, obj) {
        var linkRef = $(obj).attr('href').toLowerCase();
        console.log("Navlinks " + linkRef)

        if (linkRef == currentUrl){
            $(obj).addClass('active');
        }
        else if (linkRef != "/" && currentUrl.includes(linkRef)) {
            //console.log("MATCH")
            $(obj).addClass('active')
        }
    });


    if ($('#sidemenuLogo').height() > 200) {
        console.log($('#sidemenuLogo').height())
        console.log("Logo is too big, scaling it down")
        $('#sidemenuLogo').css('transform', 'scale(0.5)');
    }
    else {
        console.log($('#sidemenuLogo').height())
        console.log("Logo is fine")
    }
});