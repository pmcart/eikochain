$(document).ready(() => {

    var sampleText = `This is a regular paragraph block. 
                        Professionally productize highly efficient results with world-class core competencies. 
                        Objectively matrix leveraged architectures vis-a-vis error-free applications. 
                        `
    var ImageElement = "";
    var LogoElement = '';
    var VideoElement = "";
    var Video = "";
    var currentImageUrl = '';
    var currentVideoUrl = '';
    var currentVideoNumber = 0;
    var currentYTVideoId = '';
    var selectedLayout = '0';
    var currentlyEditingItem = null;
    var currentEditing = '';
    var undoArray = [];
    var redoArray = [];
    var snapWidth = '';
    var isPreview = false;
    var currentTabNumber = 1;
    var activeTabId = 'tabBody' + currentTabNumber;
    var rowCount = 1;
    var targetRow = '';
    var elementNumber = 1;
    var tabToDelete = '';
    var tabItemStyle = {
        color: '',
        size: '',
        font: ''
    }

    if (window.location.href.indexOf("SupplyChains/View") > -1)
        isPreview = true;

    if (window.location.href.toLowerCase().indexOf("iframeview") > -1 ) {
        if ($('#SupplyChainData').val() != undefined) {
            var stepsHtml = JSON.parse($('#SupplyChainData').val()).stepsHtml
            $('#previewModalContent').html(stepsHtml)
        }
        $('#previewModalContent').find(".editIcon").remove();
        $('#previewModalContent').find(".addToRowBtn").remove();
        $('#previewModalContent').find(".arrowBtn").remove();
        $('#previewModalContent').find(".rowDeleteBtn").remove();
        $('#previewModalContent').find(".resizableCol").removeClass('resizableCol');
        $('#previewModalContent').find(".resizableRow").remove('resizableRow');
        $('#previewModalContent').find(".draggableYTVideo").removeClass('draggableYTVideo');
        $('#previewModalContent').find(".moveStepUpIcon").remove();
        $('#previewModalContent').find(".moveStepDownIcon").remove();
        $('#previewModalContent').find(".menuStepIcon").remove();
     
        var eikochainPoweredByHtml = createPoweredBy("#stepsContainerSide");
        $("#stepsContainerSide").append(eikochainPoweredByHtml);
    }

    $(document).on('click', '.tabItem', function () {
        //console.log($(this))
        activeTabId = $(this).attr('data-bs-target')
    })

    function rgbToHex(rgbColor) {
        /*rgba = color.match(/\d+/g);
        if ((rgba[0] * 0.299) + (rgba[1] * 0.587) + (rgba[2] * 0.114) > 186) {
            console.log("black")
        } else {
            console.log("white")
        }*/

        var rgb = rgbColor.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
        var hex = (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : rgbColor;

        return hex.toUpperCase();
    }

    function createPoweredBy(target) {
        console.log(target)
        var menuRGBColor = $(target).css('background-color');
        var menuHexColor = rgbToHex(menuRGBColor);

        console.log("RGB " + menuRGBColor + " Hex " + menuHexColor);

        if (!isPreview) {
            $("#colorInput2").val(menuHexColor);
        }

        eikochainLogoColor = (parseInt(menuHexColor.replace('#', ''), 16) > 0xffffff / 2) ? 'black' : 'white';
        var logoImg = (eikochainLogoColor == "black") ? "/eikochainlogo5cropped.png" : "/eikochainlogo3.png";
        console.log(eikochainLogoColor);

        return `
            <a href = "https://eikochain.com" id="eikochainPoweredBy" target="_blank" style="width: 100%; text-align: center; left:0; padding: 7.5px; bottom: 0px; position: absolute;" >
                <span id="eikochainPoweredByTxt" style="font-size: 10px; color: ${eikochainLogoColor}; letter-spacing: 0.5px; padding-top: 5px; padding-right: 5px">Powered By</span>
                <img id="eikochainPoweredByImg" style="width: 90px; height: 16px;" src="${logoImg}" alt="Eikochain">
            </a>`
    }

    let scId = $('#SupplyChainId').val();

    $(document).on('click', '.nav-link', function () {
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
                    source: "Website",
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

    $(document).on("click", "#open-modal", function() {
        if (sessionStorage.getItem(scId) == null) {
            sessionStorage.setItem(scId, "viewed");
            console.log("View not recorded yet so recording a view now")
            $.ajax({
                method: 'POST',
                url: GetBaseURL() + "SupplyChains/UpdateSupplyChainViews",
                data: {
                    id: scId,
                    source: "Website"
                },
                success: function (response) {
                    console.log(response);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        }
    })
})
