

$(document).ready(() => {
    $('#btnAddRow').attr('disabled', true);
    function goodbye(e) {
        if (unsavedChanges) {
            if (!e) e = window.event;
            //e.cancelBubble is supported by IE - this will kill the bubbling process.
            e.cancelBubble = true;
            e.returnValue = 'You sure you want to leave?'; //This is displayed on the dialog
            e.title = "Leave page"
            //e.stopPropagation works in Firefox.
            if (e.stopPropagation) {
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }
    window.onbeforeunload = goodbye;


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
    var currentYTVideoUrl = '';
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
    var currTabBtn = ''
    var tabItemStyle = {
        color: '',
        size: '',
        font: ''
    }
    var unsavedChanges = false;
    var eikochainLogoColor = '';

    if (window.location.href.toLowerCase().indexOf("mobileview") > -1
        || window.location.href.toLowerCase().indexOf("preview") > -1)
        isPreview = true;

    if (window.location.href.toLowerCase().indexOf("iframeview") > -1) {
        console.log("we are in the iframeview")
        var previewHtml = $('#SupplyChainData').val()

        previewHtml.find(".editorElement").remove()
        previewHtml.find(".editIcon").remove();
        previewHtml.find(".addToRowBtn").remove();
        previewHtml.find(".arrowBtn").remove();
        previewHtml.find(".rowDeleteBtn").remove();
        previewHtml.find(".resizableCol").removeClass('resizableCol');
        previewHtml.find(".resizableRow").removeClass('resizableRow');
        previewHtml.find(".resizableRow").removeClass('resizableRow');
        previewHtml.find(".draggableYTVideo").removeClass('draggableYTVideo');
        previewHtml.find(".moveStepUpIcon").remove();
        previewHtml.find(".moveStepDownIcon").remove();
        previewHtml.find(".menuStepIcon").remove();
        $('#viewWrapper').html(previewHtml.html())
    }

    if (isPreview) {
        var stepsDataStr = JSON.parse($('#SupplyChainData').val());

        var stepsHtml = stepsDataStr.stepsHtml;

        var jelm = $($.parseHTML(stepsHtml));

        //console.log(jelm)
        jelm.find(".editorElement").remove()
        jelm.find(".editIcon").remove();
        jelm.find(".addToRowBtn").remove();
        jelm.find(".arrowBtn").remove();
        jelm.find(".rowDeleteBtn").remove();
        jelm.find(".resizableRow").removeClass('resizableRow')
        jelm.find(".resizableCol").removeClass('resizableCol')
        jelm.find(".draggableYTVideo").removeClass('draggableYTVideo')
        jelm.find(".moveStepUpIcon").remove();
        jelm.find(".moveStepDownIcon").remove();
        jelm.find(".menuStepIcon").remove();
        $('#mainBodySection').empty();
        for (i = 0; i < jelm.length; i++) {
            //console.log(jelm[i])
            $('#mainBodySection').append(jelm[i]);
        }

        $('#mainBodySection').find('.nav-link').removeClass('active');
        $('.tab-pane').removeClass('active');
        $('.tab-pane *').css('transform', 'none');
        $('.stepContainerRow').css('height', '100%');
        activeTabId = $('.tabItem').first().data('bs-target');

        $('.tabItem:first').addClass("active");
        $(activeTabId).addClass("active");

        console.log("Preview");

        if (window.matchMedia("(max-width: 767px)").matches) {
            var eikochainPoweredByHtml = createPoweredBy("#stepsContainerSide");
            $("#sidebar").append(eikochainPoweredByHtml);

            $("#sidebarCollapse").css('color', eikochainLogoColor);

        }
        else {
            var eikochainPoweredByHtml = createPoweredBy("#stepsContainerSide");
            $("#stepsContainerSide").append(eikochainPoweredByHtml);
        }

        setTimeout(function () {
            $(".stepDropdown").remove();
            $(".tabIcon").remove();
            $(".editorElement").remove();
            $(".editIcon").remove();
            $(".addToRowBtn").remove();
            $(".arrowBtn").remove();
            $(".rowDeleteBtn").remove();
            $(".resizableRow").removeClass('resizableRow')
            $(".resizableCol").removeClass('resizableCol')
            $(".moveStepUpIcon").removeClass('moveStepUpIcon')
            $(".moveStepDownIcon").remove();
            $(".menuStepIcon").remove();
            $(".draggableYTVideo").remove();
        }, 500)

        return;
    }

    //page logic
    if (window.location.href.indexOf("Add") > -1) {
        $('#generateQrBtn').attr('disabled', 'true');
        $('#copyUrlBtn').attr('disabled', 'true');

        var eikochainPoweredByHtml = createPoweredBy("#stepsContainerSide");
        $("#stepsContainerSide").append(eikochainPoweredByHtml);

        $("#colorInput2").val("#000000");
        $("#font1").val("Roboto");
        $("#menuFontSizeSelector").val("12");
    }
    else {
        var stepsDataStr = JSON.parse($('#SupplyChainData').val());

        $('#mainBodySection').html(stepsDataStr.stepsHtml)
        setTimeout(setupInteract, 100)

        console.log(stepsDataStr.menuCss)
        //var mainBody = $('#stepTabs').clone(true);
        //mainBody.find(".editorElement").remove();
        //console.log(mainBody.html())

        var eikochainPoweredByHtml = createPoweredBy("#stepsContainerSide");
        $("#stepsContainerSide").append(eikochainPoweredByHtml);

        let searchParams = new URLSearchParams(window.location.search)

        var rowNums = [];
        $('.stepContainerRow').each(function (i, obj) {
            var idNum = obj.id.split('stepRow')[1];
            rowNums.push(idNum);
        });
        //console.log(rowNums)

        var elemNums = [];
        $('.stepColInner').each(function (i, obj) {
            var idNum = obj.id.split('ele')[1];
            elemNums.push(idNum);
        });

        var tabNums = [];
        $('.tab-pane').each(function (i, obj) {
            var idNum = obj.id.split('tabBody')[1];
            tabNums.push(idNum);
        });

        rowNums = rowNums.sort(function (a, b) { return a - b });
        elemNums = elemNums.sort(function (a, b) { return a - b });
        tabNums = tabNums.sort(function (a, b) { return a - b });

        if (tabNums.length > 0) {
            currentTabNumber = tabNums[tabNums.length - 1];

            tabItemStyle.size = $(".tabItem").first().css('font-size').split('px')[0];
            tabItemStyle.color = $(".tabItem").first().css('color');
            tabItemStyle.font = $(".tabItem").first().css('font-family');

            $("#colorInput1").val(rgbToHex(tabItemStyle.color));
            $("#font1").val(tabItemStyle.font);
            $("#menuFontSizeSelector").val(tabItemStyle.size);
        }

        if (rowNums.length > 0)
            rowCount = rowNums[rowNums.length - 1];

        if (elemNums.length > 0)
            elementNumber = elemNums[elemNums.length - 1];

        console.log(elementNumber)
        console.log(rowCount)

        if (('.stepsContainerSection').length)
            $('#btnAddRow').attr('disabled', false);

        //set active step to first step
        $('#mainBodySection').find('.nav-link').removeClass('active');
        $('.tab-pane').removeClass('active');

        activeTabId = $('.tabItem').first().data('bs-target');

        $('.tabItem:first').addClass("active");
        $(activeTabId).addClass("active");

        var el = document.getElementById('stepTabs');

        if (!isPreview) {
            var sortable = Sortable.create(el);
        }

    }

    var elem = document.querySelector('#colorInput1');
    var elem2 = document.querySelector('#colorInput2');
    try {
        if (Huebee) {
            var hueb = new Huebee(elem, {
                // options
                notation: 'hex'
            });
            hueb.on('change', function (color, hue, sat, lum) {
                UpdateUndoArray()
                $('.tabItem').css('color', color)
                tabItemStyle.color = color;
            })
        }

    }
    catch {

    }
    try {
        if (Huebee) {
            var hueb = new Huebee(elem2, {
                // options
                notation: 'hex'
            });
            hueb.on('change', function (color, hue, sat, lum) {
                UpdateUndoArray()
                $('#stepsContainerSide').css('background', 'none')
                $('#stepsContainerSide').css('background-color', color)

                eikochainLogoColor = (parseInt(color.replace('#', ''), 16) > 0xffffff / 2) ? 'black' : 'white';
                var logoImg = (eikochainLogoColor == "black") ? "/eikochainlogo5cropped.png" : "/eikochainlogo3.png";

                $("#eikochainPoweredByTxt").css("color", eikochainLogoColor);
                $("#eikochainPoweredByImg").attr("src", logoImg);
                $('.tabIcon').css('color', eikochainLogoColor)
            })
        }

    }
    catch {

    }

    var colorPickerTitle = '';
    //var colorPicker = new iro.ColorPicker("#picker", {
    //    // Set the size of the color picker
    //    width: 100,
    //    // Set the initial color to pure red
    //    color: "#f00",
    //    display: 'inline-block'
    //});
    //colorPicker.on('color:change', function (color) {
    //    // log the current color as a HEX string
    //    //console.log(color.hexString);
    //    UpdateUndoArray()
    //    customColor = color.hexString;
    //    $('#stepsContainerSide').css('background', 'none')
    //    $('#stepsContainerSide').css('background-color', color.hexString)
    //});

    //if ($('#pickerTitle').length) {
    //    colorPickerTitle = new iro.ColorPicker("#pickerTitle", {
    //        // Set the size of the color picker
    //        width: 100,
    //        // Set the initial color to pure red
    //        color: "#f00",
    //        display: 'inline-block'
    //    });
    //    colorPickerTitle.on('color:change', function (color) {
    //        UpdateUndoArray()
    //        // log the current color as a HEX string
    //        //console.log(color.hexString);
    //        customColorTitle = color.hexString;
    //        //$('#stepsContainerSide').css('background', 'none')
    //        $('.tabItem').css('color', color.hexString)
    //        tabItemStyle.color = color;
    //        currentMenuTitleColor = color.hexString;
    //    });
    //}
    const gp = new Grapick({ el: '#gp' });

    // Handlers are color stops
    gp.addHandler(0, 'red');
    gp.addHandler(100, 'blue');

    // Do stuff on change of the gradient
    gp.on('change', complete => {
        UpdateUndoArray()
        //console.log(gp)
        $('#stepsContainerSide').css('background', gp.getSafeValue())
    })

    $('#font1').fontpicker({
        parentElement: '#editColorsModal',
        variants: false,
        nrRecents: 0,
        showClear: true,
        googleFonts: [
            'Montserrat', 'Roboto', 'Lato', 'Poppins', 'Oswald', 'Inter', 'Rubik', 'Kanit', 'Anton'
        ],
    })
        .on('change', function () {
            console.log(this.value)
            $('.tabItem').css('font-family', this.value);
            tabItemStyle.font = this.value;
        });

    $('#summernote').summernote({
        fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Montserrat', 'Roboto', 'Lato', 'Poppins', 'Oswald', 'Inter', 'Rubik', 'Kanit', 'Anton'],

        placeholder: 'Hello stand alone ui',
        tabsize: 2,
        height: 120,
        fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36', '48', '64', '82', '150'],
        toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['fontname', ['fontname']]
        ]

    });
    $('#summernoteAdd').summernote({
        fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Montserrat', 'Roboto', 'Lato', 'Poppins', 'Oswald', 'Inter', 'Rubik', 'Kanit', 'Anton'],

        placeholder: 'Hello stand alone ui',
        tabsize: 2,
        height: 120,
        fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36', '48', '64', '82', '150'],
        toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['fontname', ['fontname']]
        ]
    });
    $('#summernoteEditTitle').summernote({
        fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Montserrat', 'Roboto', 'Lato', 'Poppins', 'Oswald', 'Inter', 'Rubik', 'Kanit', 'Anton'],

        value: $('#title').val(),
        tabsize: 2,
        height: 120,
        fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36', '48', '64', '82', '150'],
        toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['fontname', ['fontname']]
        ]
    });

    $('#btnPreviewQR').on('click', function () {
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

                $('#qrPreviewFrame').attr('src', GetBaseURL() + "SupplyChains/View?id=" + supChainId)
                $('#qrPreviewModal').modal('show')
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });

    })

    $('#previewBtn').on('click', function () {
        var previewHtml = $('#mainBodySection').clone(true)

        previewHtml.find(".stepsContainerSection").each(function (i, item) {
            //Reset Attribute id with new value
            $(item).attr("id", $(item).attr("id") + '-preview');
        });

        previewHtml.find(".nav-link").each(function (i, item) {
            //Reset Attribute id with new value
            $(item).attr("data-bs-target", $(item).attr("data-bs-target") + '-preview');
        });

        previewHtml.find(".tab-pane").each(function (i, item) {
            //Reset Attribute id with new value
            $(item).attr("id", $(item).attr("id") + '-preview');
        });
        //setTimeout(function () {
        //    $('#stepsContainerSide-preview').width($('#stepsContainerSide').outerWidth())
        //    $('#stepsContainerMain-preview').width($('#stepsContainerMain').outerWidth())
        //}, 100)

        previewHtml.find(".editorElement").remove();
        previewHtml.find(".stepDropdown").remove();
        previewHtml.find(".tabIcon").remove();
        previewHtml.find(".hiddenTitle").remove();
        previewHtml.find(".editIcon").remove();
        previewHtml.find(".addToRowBtn").remove();
        previewHtml.find(".arrowBtn").remove();
        previewHtml.find(".rowDeleteBtn").remove();
        previewHtml.find(".resizableCol").removeClass('resizableCol');
        previewHtml.find(".resizableRow").removeClass('resizableRow');
        previewHtml.find(".draggableYTVideo").removeClass('draggableYTVideo');
        previewHtml.find(".moveStepUpIcon").removeClass('moveStepUpIcon')
        previewHtml.find(".moveStepDownIcon").removeClass('moveStepDownIcon')
        previewHtml.find(".menuStepIcon").removeClass('menuStepIcon')
        $('#previewModalRow').html(previewHtml.html())
        $('#PreviewDialog').modal('show');
    })

    $('#btnChangeColors').on('click', function () {
        $('#editColorsModal').modal('show');
        $('.modal-backdrop').hide();
    })

    $('#saveBtn').on('click', function () {
        var isEdit = false;
        $('#saveBtnLoadSpinner').show();
        if ($('#title').val() == '') {
            sweetAlert("Please enter a title")
            $('#saveBtnLoadSpinner').hide();

            return;
        }
        if (window.location.href.indexOf("Edit") > -1 || window.location.href.indexOf("edit") > -1) {
            isEdit = true;
        }

        var stepIds = $(".nav-step");
        var stepTitles = $(".hiddenTitle");

        var steps = [];
        for (var i = 0; i < stepTitles.length; i++) {
            var stepInfo = {};
            stepInfo.id = stepIds[i].id;
            stepInfo.title = stepTitles[i].value;
            stepInfo.clicks = 0;

            steps.push(stepInfo);
        }

        console.log(JSON.stringify(steps));

        if (!isEdit) {

            var supplyChain = {
                Title: $('#title').val(),
                Steps: JSON.stringify(steps),
                SupplyChainData: GetSupplyChainData()
            }

            $.ajax({
                method: 'POST',
                url: GetBaseURL() + "SupplyChains/Add",
                data: { sc: supplyChain },
                success: function (response) {
                    unsavedChanges = false;
                    sweetAlert({
                        title: "Success!",
                        text: "Supply Chain added!",
                        icon: "success",
                        button: "Ok"
                    }).then((result) => {

                        if (window.location.href.indexOf("Add") > -1) {
                            window.location.href = '/SupplyChains/Edit?id=' + response.id;
                        }

                    })
                    $('#saveBtnLoadSpinner').hide();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                }
            });
        }
        else {
            var supplyChain = {
                Title: $('#title').val(),
                Steps: JSON.stringify(steps),
                SupplyChainData: GetSupplyChainData(),
                Id: $('#SupplyChainId').val()
            }
            $.ajax({
                method: 'POST',
                url: GetBaseURL() + "SupplyChains/Update",
                data: { sc: supplyChain },
                success: function (response) {
                    if (response.success) {
                        sweetAlert({
                            title: "Success!",
                            text: "Supply Chain saved!",
                            icon: "success",
                            button: "Ok"
                        })
                        unsavedChanges = false;
                    }
                    else
                        sweetAlert("Error updating!");

                    $('#saveBtnLoadSpinner').hide();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    sweetAlert("Error updating!");
                }
            });
        }
    })

    $('.closemodal').on('click', function () {
        $(this).closest('.modal').modal('hide');
    })

    $('#undoBtn').on('click', function () {
        console.log(undoArray);
        redoArray.unshift($('#mainContainer').html());

        $('#mainContainer').html(undoArray[0]);
        undoArray.shift();
    })

    $('#redoBtn').on('click', function () {
        console.log(redoArray)
        $('#mainContainer').html(redoArray[0]);
        redoArray.shift();
    })

    $('#btnAddStep').on('click', function (e) {
        $('#titleInput').val("");
        $('#addSectionModal').modal('show')
    })

    $('#btnAddRow').on('click', function (e) {
        UpdateUndoArray()
        rowCount++;

        if (activeTabId.includes('#'))
            activeTabId = activeTabId.split('#')[1]

        var rowsInActiveTab = $('#' + activeTabId).find('.stepContainerRow')

        var heightOfElements = 0;

        rowsInActiveTab.each(function () {
            heightOfElements += $(this).height();
        })
        heightOfElements = heightOfElements + 120;

        if (heightOfElements < $('#stepsContainerMain').height()) {

            $('#' + activeTabId).append(`
            <div id="stepRow${rowCount}" class="row stepContainerRow resizableRow" data-xheight="">
                <i data-targetrow="stepRow${rowCount}" class="addToRowBtn fa fa-plus-circle editRowBtn"></i>
                <i data-targetrow="stepRow${rowCount}" class="rowDeleteBtn fa-solid fa-trash-can editRowBtn"></i>
                <i data-targetrow="stepRow${rowCount}" class="arrowBtn arrowRowBtnUp fa-solid fa-arrow-up editRowBtn"></i>
                <i data-targetrow="stepRow${rowCount}" class="arrowBtn arrowRowBtnDown fa-solid fa-arrow-down editRowBtn"></i>        
            </div>`)
        }
        else {
            sweetAlert("Maximum space used for this tab")
        }

        targetRow = rowCount

    })

    $('.layout-img').on('click', function (e) {
        $('.layout-img').removeClass('layout-img-selected')
        $(this).addClass('layout-img-selected')

        selectedLayout = $(this).attr('id')

        //if (selectedLayout != 0 && $('#titleInput').val()) {
        //    $('#btnConfirmNewSection').attr('disabled',false)
        //}
        if (selectedLayout != 0 && $('#titleInput').val()) {
            $('#btnConfirmNewSection').attr('disabled', false)
        }
    })

    $('#titleInput').on('change', function () {
        //if (selectedLayout != 0 && $('#titleInput').val()) {
        //    $('#btnConfirmNewSection').attr('disabled', false)
        //}
        if ($('#titleInput').val()) {
            $('#btnConfirmNewSection').attr('disabled', false)
        }

    })

    $('#menuFontSizeSelector').on('change', function () {
        console.log(this.value)
        $('.tabItem').css('font-size', this.value + 'px');
        tabItemStyle.size = this.value;
    })

    $("#titleInput").on("keyup", function search(e) {
        if ($('#titleInput').val()) {
            $('#btnConfirmNewSection').attr('disabled', false)
        }
    });

    $('#title').on('change', function () {
        UpdateUndoArray()
        $('#titleText').html($('#title').val())
    })
    $("#title").on("keyup", function search(e) {
        UpdateUndoArray()
        $('#titleText').html($('#title').val())
    });


    $('#btnConfirmNewSection').on('click', function (e) {
        UpdateUndoArray()
        var stepTitle = $('#titleInput').val();
        LoadNewStep(selectedLayout, stepTitle);

        setupInteract();
        setTimeout(function () {
            $('#btnAddRow').trigger('click')

        }, 100)

    })

    $('#btnAddElementItem').on('click', function (e) {
        UpdateUndoArray()
        elementNumber++;
        $('#' + targetRow).append(`<div class="col-md-3 stepContainerCol resizableCol"><div id=ele${elementNumber} class="stepColInner"></div></div>`)
        //undoArray.unshift($('#mainContainer').html())
        if (currentEditing == 1) {
            var textareaValue = $('#summernoteAdd').summernote('code');
            $(`#ele${elementNumber}`).html(textareaValue + '<i class="fas fa-edit editIcon textItem"></i>')
        }
        else if (currentEditing == 2) {
            $(`#ele${elementNumber}`).html(`<img class="step-img resizableImg" src="${currentImageUrl}" />` + '<i class="fas fa-edit editIcon imageItem"></i>')
            $("#addimageEditorBox").attr("src", "")
            $(".jsfileImage").val('');
        }
        else if (currentEditing == 3) {
            //alert($('.ytvideoEditorView').is(':visible'));
            if ($('.ytvideoEditorView').is(':visible')) {

                //object-fit: contain;
                let videoHtml = `<div class="video-container"><iframe src="` + currentYTVideoUrl + `" title="youtube video player" style="display: block;"
                                          class="loadvideo step-video resizableImg draggableYTVideo" controls frameborder="0" allow="accelerometer; autoplay;
                                        clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`

                //let videoHtml = `<div class="plyr__video-embed video-container j_Y2Gwaj7Gs " id="player"><iframe class="draggableYTVideo" src="` + currentYTVideoUrl + `"
                //allowfullscreen allowtransparency allow = "autoplay"></iframe></div > `;
                $(`#ele${elementNumber}`).html(videoHtml + '<i class="fas fa-edit editIcon videoItem"></i>')
                $('#addytVideoUrl').val('');
            }
            else {
                currentVideoNumber++;
                let videoId = "video" + currentVideoNumber;
                let videoHtml = `<video controls src="${currentVideoUrl}" style="display: block;" id="${videoId}" class="loadvideo step-video resizableImg">
                                                <source type="video/mp4" />
                                            </video>`
                $(`#ele${elementNumber}`).html(videoHtml + '<i class="fas fa-edit editIcon videoItem"></i>')

                setTimeout(function () {

                    Video = $('#' + videoId);
                    //console.log(Video)
                    //Source = Video.find("source");
                    ////console.log(Source)
                    //Source[0].src = currentVideoUrl;
                    Video[0].load();
                }, 500)

                $(".jsfileVideo").val('');
            }
        }

        $('#addItemModal').modal('hide');
    })

    $('#btnUpdateItem').on('click', function (e) {
        //console.log(currentlyEditingItem)
        UpdateUndoArray()
        if (currentEditing == 1) {
            var textareaValue = $('#summernote').summernote('code');
            currentlyEditingItem.parent().html(textareaValue + '<i class="fas fa-edit editIcon textItem"></i>')
        }
        else if (currentEditing == 2) {
            currentlyEditingItem.parent().html(`<img class="step-img" src="${currentImageUrl}" />` + '<i class="fas fa-edit editIcon imageItem"></i>')
            $("#imageEditorBox").attr("src", "")
            $(".jsfileImage").val('');
        }
        else if (currentEditing == 3) {

            if ($('.ytvideoEditorView').is(':visible')) {

                let videoHtml = `<div class="video-container"><iframe src="` + currentYTVideoUrl + `" title="youtube video player" style="display: block;"
                                          class="loadvideo step-video resizableImg draggableYTVideo" controls frameborder="0" allow="accelerometer; autoplay;
                                        clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
                currentlyEditingItem.parent().html(videoHtml + '<i class="fas fa-edit editIcon videoItem"></i>');

                $('#ytVideoUrl').val('');
            }
            else {
                currentVideoNumber++;
                let videoId = "video" + currentVideoNumber;
                let videoHtml = `<video src="${currentVideoUrl}" controls="true" style="display: block;" id="${videoId}" class="loadvideo step-video">
                                            <source type="video/mp4" />
                                        </video>`
                currentlyEditingItem.parent().html(videoHtml + '<i class="fas fa-edit editIcon videoItem"></i>')

                setTimeout(function () {

                    Video = $('#' + videoId);
                    //console.log(Video)
                    //Source = Video.find("source");
                    ////console.log(Source)
                    //Source[0].src = currentVideoUrl;
                    Video[0].load();
                }, 500)

                $(".jsfileVideo").val('');
            }

        }
        if (currentEditing == 4) {
            var newTitle = $('#tabNewTitle').val();
            currTabBtn.siblings("input.hiddenTitle").val(newTitle);
            currTabBtn.find("span.stepTitleValue").text(newTitle)
        }
        if (currentEditing == 5) {
            var textareaValue = $('#summernoteEditTitle').summernote('code');
            $('#titleText').html(textareaValue)
        }
        $('#editItemModal').modal('hide');
    })

    $(document).on('click', '#btnDeleteItem, .deleteStep', function () {

        sweetAlert({
            title: "Are you sure!",
            text: "This will be deleted from your Supply Chain",
            icon: "warning",
            dangerMode: true,
            buttons: true
        }).then((result) => {
            if (result) {

                UpdateUndoArray()
                if (currentEditing == 4) {
                    console.log(currentTabNumber)

                    var tabNumber = tabToDelete.split("tabBody")[1];
                    $('#tab' + tabNumber).remove();
                    $(tabToDelete).remove();

                    if ($('.tabItem').length < 1) {
                        $('#btnAddRow').attr('disabled', true);
                    }
                    else {
                        activeTabId = $('.tabItem').first().data('bs-target');

                        $('.tabItem').first().addClass("active");
                        $(activeTabId).addClass("active");
                    }
                }
                else
                    currentlyEditingItem.closest('.stepContainerCol').remove();

                $('#editItemModal').modal('hide');
            }
        })

    })

    $(document).on('click', '.duplicateStep', function () {
        UpdateUndoArray();
        currentTabNumber++;

        //get tab body
        var currentTabBody = currTabBtn.attr('data-bs-target');

        var newTabLi = currTabBtn.parent().clone(true);
        var newTabBtn = newTabLi.find("button").first()
        var newTabBody = $(currentTabBody).clone(true);

        $(currTabBtn).removeClass('active');
        $(currentTabBody).removeClass('active');

        newTabLi.attr('id', 'tab' + currentTabNumber);
        newTabBtn.attr('data-bs-target', '#tabBody' + currentTabNumber);
        newTabBtn.find(".tabIcon").attr('data-targetstep', '#tab' + currentTabNumber);

        var tabContentPane = newTabBody.first(".tab-pane");
        $(tabContentPane).attr('id', 'tabBody' + currentTabNumber);

        console.log(newTabLi);
        console.log(newTabBody);

        //update each step row & icon targets
        newTabBody.find(".stepContainerRow").each(function (i, item) {
            rowCount++;

            $(item).attr("id", 'stepRow' + rowCount);

            $(item).find(".editRowBtn").each(function (i, icon) {
                $(icon).attr("data-targetrow", 'stepRow' + rowCount)
            });

            $(item).find(".stepColInner").each(function (i, element) {
                elementNumber++;
                $(element).attr("id", 'ele' + elementNumber);
            });
        });

        activeTabId = 'tabBody' + currentTabNumber;

        $('#stepTabs').append(newTabLi);
        $('#tabBodyContainer').append(newTabBody);
    })

    $(document).on("click", '.moveStepUpIcon', function () {
        UpdateUndoArray();
        var targetStep = $(this).data("targetstep");
        console.log("Move step up: " + targetStep);

        var nextRowUp = $(targetStep).prev()
        nextRowUp.insertAfter($(targetStep));

    })

    $(document).on("click", '.moveStepDownIcon', function () {
        UpdateUndoArray();
        var targetStep = $(this).data("targetstep");
        console.log("Move step down: " + targetStep);

        var nextRowDown = $(targetStep).next()
        nextRowDown.insertBefore($(targetStep));
    })

    $('#editItemSelect').on('change', function (e) {
        currentEditing = this.value;
        //console.log("Now editing: " + currentEditing)
        $('.modalEditorView').hide();
        if (currentEditing == 1) {
            $('#textEditorView').show();
        }
        else if (currentEditing == 2) {
            $('#imageEditorView').show();
        }
        else if (currentEditing == 3) {
            $('#videoEditorView').show();
        }
        else if (currentEditing == 4) {
            $('#tabEditorView').show();
        }
    })

    $('#addItemSelect').on('change', function (e) {
        currentEditing = this.value;
        //console.log("Now adding: " + currentEditing)
        $('.modalEditorView').hide();
        if (currentEditing == 1) {
            $('#addtextEditorView').show();
            $('#btnAddElementItem').attr('disabled', false);
        }
        else if (currentEditing == 2) {
            $('#addimageEditorView').show();
        }
        else if (currentEditing == 3) {
            $('#addvideoEditorView').show();
            //$('#btnAddElementItem').attr('disabled', false);
        }
        else if (currentEditing == 4) {
            $('#addtabEditorView').show();
            $('#btnAddElementItem').attr('disabled', false);
        }
    })

    $(document).on("click", '#copyUrlBtn', function () {


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
                var supId = $('#SupplyChainId').val();

                var pageUrl = window.location.origin

                if (pageUrl.includes("localhost")) {
                    var text = "https://localhost:7288/SupplyChains/ViewSupplyChain?id=" + supId;
                } else {
                    var text = window.location.origin + "/SupplyChains/ViewSupplyChain?id=" + supId;
                }

                $('#copyUrlModal').modal('show');
                $('#urlValueInput').val(text);
                $("#btnOpenSCUrl").attr("href", text);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    })

    $('#btnConfirmCopyUrl').on('click', function () {
        navigator.clipboard.writeText($('#urlValueInput').val()).then(function () {
            $('#btnConfirmCopyUrl').html("Copied !")
            console.log('Async: Copying to clipboard was successful!');
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    })

    $(document).on("click", '#generateQrBtn', function () {
        var SupplyChainId = $("#SupplyChainId").val();
        $.ajax({
            url: GetBaseURL() + "SupplyChains/GenerateQR",
            data: { ID: SupplyChainId },
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
    });

    $(document).on('click', '.tabItem', function () {
        //console.log($(this))
        activeTabId = $(this).attr('data-bs-target')
    })

    $(document).on("click", '#btnSetMenuBg', function () {
        $('.jsfileMenuBg').trigger("click");
    });

    $(document).on("click", '#btnAddImageLogo', function () {
        // Imageupdate($(this), );
        LogoElement = $(this);
        $('.jsfileImageLogo').trigger("click");
    });

    $(document).on("click", ".editIcon", function () {
        $('.modalEditorView').hide();
        $('#editItemModal').modal('show')
        currentlyEditingItem = $(this)

        $('#editItemSelect').show();
        $('#editSelectLabel').show();
        LoadItemEditor(currentlyEditingItem);
    });

    $(document).on("click", ".menuStepIcon", function () {
        currentEditing = 4;

        currTabBtn = $(this).siblings(".tabItem");
        tabToDelete = currTabBtn.attr("data-bs-target");
        console.log(tabToDelete)
        console.log(currTabBtn)
    });


    $(document).on("click", "#editTitleStyle", function () {
        $('.modalEditorView').hide();
        $('#editItemModal').modal('show')
        currentlyEditingItem = "title";
        $('#editItemSelect').show();
        $('#editSelectLabel').show();
        LoadItemEditor(currentlyEditingItem);
    });

    $(document).on("click", ".arrowBtn", function () {
        UpdateUndoArray()
        var targetRow = $(this).data("targetrow");
        //console.log(targetRow)
        if ($(this).hasClass('arrowRowBtnUp')) {
            var nextRowUp = $('#' + targetRow).prev()
            nextRowUp.insertAfter($('#' + targetRow));
        }
        else if ($(this).hasClass('arrowRowBtnDown')) {
            var nextRowDown = $('#' + targetRow).next()
            nextRowDown.insertBefore($('#' + targetRow));
        }
    });

    $(document).on("click", ".rowDeleteBtn", function () {

        sweetAlert({
            title: "Are you sure!",
            text: "This row will be deleted",
            icon: "warning",
            dangerMode: true,
            buttons: true
        }).then((result) => {
            if (result) {
                UpdateUndoArray()
                var targetRow = $(this).data("targetrow");
                //console.log(targetRow)
                $('#' + targetRow).remove();
            }
        })



    });


    $(document).on("click", '#btnAddImage', function () {
        // Imageupdate($(this), );

        ImageElement = $(this);
        $('.jsfileImage').trigger("click");
    });

    $(document).on("click", '.btnAddVideo', function () {
        VideoElement = $(this);
        $('#ytvideoEditorView').hide();
        $('.ytvideoEditorBox').hide();
        $('.jsfileVideo').trigger("click");

    });

    $(document).on("click", '.btnAddYTVideo', function () {

        console.log($(this).next().attr("id"))
        $(this).next("#ytvideoEditorView").show();
    });

    $(document).on("click", '.btnPreYTVideo', function () {

        //get val from input beside btn
        var ytvideoInput = $(this).prev().val();
        if (ytvideoInput == "") {
            sweetAlert("Url is empty!");
            return;
        }

        var ytvideoId = ytvideoInput.slice(ytvideoInput.indexOf("v=") + 2, ytvideoInput.indexOf("v=") + 2 + 11)
        //ytvideoUrl.length - 11
        if (ytvideoInput.length == 11) {
            ytvideoId = ytvideoInput
        }

        currentYTVideoUrl = "https://www.youtube.com/embed/" + ytvideoId + "?rel=0&modestbranding=1";

        $(this).parent().parent().find('#ytvideoEditorBox').attr("src", currentYTVideoUrl);
        $(this).parent().parent().find('#ytvideoEditorBox').show();
        $('#btnAddElementItem').attr('disabled', false);
    });

    $(document).on("change", '.jsfileImage', function () {

        var form_Data = new FormData();
        fileUpload = $(this).get(0);
        var files = fileUpload.files;
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var fileName = files[i].name;
                var flExt = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
                if ($.inArray(flExt.toLowerCase(), ['gif', 'png', 'jpg', 'bmp', 'jpeg']) !== -1)
                    form_Data.append("file", files[i]);
                else { alert("Invalid File type!"); return false; }
            }
        }

        $(".spinner-border").css('display', 'inline-block');

        $.ajax({
            type: "POST",
            url: GetBaseURL() + 'Products/FileUpload',
            data: form_Data,
            cache: false,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
                UpdateUndoArray()

                if (data !== "!OK") {

                    // $("#ProductImage").val(data);
                    //ImageElement.css('background-image', 'url("' + GetBaseURL() + "ProductImages/" + data + '")');
                    // ImageElement.attr('src', GetBaseURL() + "ProductImages/" + data + "");
                    currentImageUrl = data;
                    sweetAlert("Image uploaded successfully", "", "success");

                    if ($('#addimageEditorView').is(':visible')) {
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            $("#addimageEditorBox").attr("src", e.target.result);
                        }

                        reader.readAsDataURL(fileUpload.files[0]);

                        $("#addimageEditorBox").show()
                    }
                    else {
                        $("#imageEditorBox").attr("src", data)
                        $("#imageEditorBox").show()
                    }

                }
                $('#btnAddElementItem').attr('disabled', false);
                $(".spinner-border").hide();
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

    $('#closeAddItemModal').on('click', function () {
        $('#btnAddElementItem').attr('disabled', false);
    })

    $(document).on("click", '.addToRowBtn', function () {
        $('#btnAddElementItem').attr('disabled', true);
        targetRow = $(this).data('targetrow');
        $('.modalEditorView').hide();
        $('#addItemModal').modal('show')
        $('#addItemSelect').val(0)
        $('#summernoteAdd').summernote('reset')
    })

    $(document).on("change", '.jsfileVideo', function () {
        sweetAlert("Uploading your Video, please wait!");
        var form_Data = new FormData();
        fileUpload = $(this).get(0);
        var files = fileUpload.files;
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var fileName = files[i].name;
                var flExt = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
                if ($.inArray(flExt.toLowerCase(), ['mp4']) !== -1)
                    form_Data.append("file", files[i]);
                else { alert("Invalid File"); return false; }
            }
        }

        $('#btnUpdateItem').prop("disabled", true);
        $(".spinner-border").css("display", "inline-block");

        $.ajax({

            url: GetBaseURL() + 'Products/VideoFileUpload',
            data: form_Data,
            type: "POST",
            // cache: false,
            contentType: false,
            processData: false,
            // async: false,
            success: function (data) {
                UpdateUndoArray()
                currentVideoUrl = data;
                sweetAlert.close()

                $('#btnAddElementItem').prop("disabled", false);
                $('#btnUpdateItem').prop("disabled", false);
                $(".spinner-border").hide()

                var reader = new FileReader();

                if ($('#addvideoEditorView').is(':visible')) {

                    reader.onload = function (e) { $("#addvideoEditorBox").attr("src", e.target.result) }
                    reader.readAsDataURL(fileUpload.files[0]);

                    //$("#addvideoEditorBox").attr("src", data)
                    $("#addvideoEditorBox").show()

                    setTimeout(function () {

                        //console.log(Video)
                        //Source = Video.find("source");
                        ////console.log(Source)
                        //Source[0].src = currentVideoUrl;
                        //$("#addvideoEditorBox")[0].load();
                    }, 500)

                }
                else {
                    reader.onload = function (e) { $("#videoEditorBox").attr("src", e.target.result); }
                    reader.readAsDataURL(fileUpload.files[0]);

                    //$("#videoEditorBox").attr("src", data)
                    $("#videoEditorBox").show()

                    setTimeout(function () {

                        //console.log(Video)
                        //Source = Video.find("source");
                        ////console.log(Source)
                        //Source[0].src = currentVideoUrl;
                        //$("#videoEditorBox")[0].load();
                    }, 500)
                }
            },
            error: function (jqXHR, exception) {
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
                sweetAlert("Error in Uploading Video!", msg, "error");
            }
        });

    });

    $(document).on("change", '.jsfileImageLogo', function () {

        var form_Data = new FormData();
        fileUpload = $(this).get(0);
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
            url: GetBaseURL() + 'Products/FileUpload',
            data: form_Data,
            cache: false,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
                UpdateUndoArray()
                imageLogoUrl = data;
                $('#stepContainerLogo').attr('src', imageLogoUrl)
                sweetAlert("Image uploaded successfully");
            },
            error: function (jqXHR, exception) {
                //console.log(jqXHR)
                //console.log(exception)
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

    $(document).on("change", '.jsfileMenuBg', function () {

        var form_Data = new FormData();
        fileUpload = $(this).get(0);
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
            url: GetBaseURL() + 'Products/FileUpload',
            data: form_Data,
            cache: false,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
                UpdateUndoArray()
                var bgImgUrl = data;
                $('#stepsContainerSide').css("background-image", "url(" + bgImgUrl + ")");
                $('#stepsContainerSide').css("background", "background:no-repeat");

                sweetAlert("Image uploaded successfully");

                setTimeout(function () {
                    $('#stepsContainerSide').backgroundDraggable();
                }, 500)

            },
            error: function (jqXHR, exception) {
                //console.log(jqXHR)
                //console.log(exception)
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

    function UpdateUndoArray() {
        undoArray.unshift($('#mainContainer').html())
        unsavedChanges = true;
        //const stackTrace = new Error().stack
        //console.log(stackTrace)
    }

    function GetSupplyChainData() {
        var scHtml = $('#mainBodySection').clone(true)
        scHtml.find("#eikochainPoweredBy").remove();
        //scHtml.find(".editorElement").remove();
        console.log(scHtml);

        var stepsData = {
            menuCss: $('#stepsContainerSide').css('background'),
            stepsHtml: scHtml.html()
        }
        return JSON.stringify(stepsData);
    }

    function LoadNewStep(layoutValue, title) {

        $('#btnAddRow').attr('disabled', false);

        UpdateUndoArray()
        currentTabNumber++;
        $('#mainBodySection').find('.nav-link').removeClass('active');

        var newTabHtml = `
        <li id=tab${currentTabNumber} class="nav-item nav-step" role="presentation">
           <i class="fa-solid fa-ellipsis-vertical menuStepIcon tabIcon editorElement" id="dropdownMenuButton" style="color: ${eikochainLogoColor}" data-bs-toggle="dropdown" aria-expanded="false"></i>
              <ul class="dropdown-menu editorElement" aria-labelledby="dropdownMenuButton">
                <li class="dropdown-header">Edit step</li>
                <li><hr class="dropdown-divider"></li>
                <li class="dropdown-item editIcon" style="position: relative; top: 0px;"><i class="fa-solid fa-pen"></i>&nbsp;&nbsp; Rename</li>
                <li class="dropdown-item duplicateStep"><i class="fa-regular fa-copy"></i>&nbsp;&nbsp; Duplicate</li>
                <li class="dropdown-item deleteStep"><i class="fa-solid fa-trash"></i>&nbsp;&nbsp; Delete</li>
              </ul>
            <button class="nav-link active tabItem" data-bs-toggle="tab" data-bs-target="#tabBody${currentTabNumber}"
                type="button" role="tab" aria-controls="home" aria-selected="true"
                 style="color:${tabItemStyle.color}; font-family:${tabItemStyle.font}; font-size:${tabItemStyle.size}px;">
              
                <span class="stepTitleValue">${title}</span>

                <i data-targetstep="#tab${currentTabNumber}" class="fa-solid fa-caret-up fa-2xl moveStepUpIcon tabIcon editorElement" style="color: ${eikochainLogoColor}"></i>
                <i data-targetstep="#tab${currentTabNumber}" class="fa-solid fa-caret-down fa-2xl moveStepDownIcon tabIcon editorElement" style="color: ${eikochainLogoColor}"></i>
            </button>
            <input type="hidden" value="${title}" class="hiddenTitle" />

        </li>`;
        $('#stepTabs').append(newTabHtml)

        var layoutHtml = ''

        $('.tab-pane').removeClass('active');
        if (layoutValue == 'layout1') {
            layoutHtml = `
              <div class="tab-pane active" id="tabBody${currentTabNumber}" role="tabpanel" aria-labelledby="home-tab">
                <div class="row nopadding" style="height:125px">
                    <div class="col-md-12 nopadding" >
                        <div class="topBanner text-center editableItemAbs imageItem">
                            <h1 class="text-center editableItem textItem titleText">${title}</h1>
                        </div>
                    </div>
                </div>
                <div class="row nopadding" style="height:250px">
                    <div class="col-md-1"></div>
                    <div class="col-md-5 layoutBlock editableItem textItem">${sampleText}</div>
                    <div class="col-md-5 layoutBlock editableItem textItem">${sampleText}</div>
                    <div class="col-md-1"></div>
                </div>
                <div class="row nopadding" style="height:125px">
                    <div class="col-md-12 nopadding">
                        <div class="bottomBanner editableItem imageItem"></div>
                    </div>
                </div>
                </div>
            `
        }
        else if (layoutValue == 'layout2') {
            layoutHtml = `
              <div class="tab-pane active" id="tabBody${currentTabNumber}" role="tabpanel" aria-labelledby="home-tab">
                <div class="row" style="height:150px">
                    <div class="col-md-12">
                          <div class="topBanner text-center editableItemAbs imageItem">
                            <h1 class="text-center editableItem textItem titleText">${title}</h1>
                        </div>
                    </div>
                </div>
                <div class="row" style="height:175px">
                    <div class="col-md-1"></div>
                    <div class="col-md-5 layoutBlock editableItem imageItem"><img class="step-img" src="/images/layoutimages/ecohouse.png" /></div>
                    <div class="col-md-5 layoutBlock editableItem textItem">${sampleText}</div>
                    <div class="col-md-1"></div>
                </div>
                  <div class="row" style="height:175px">
                    <div class="col-md-1"></div>
                    <div class="col-md-5 layoutBlock editableItem textItem">${sampleText}</div>
                    <div class="col-md-5 layoutBlock editableItem imageItem"><img class="step-img" src="/images/layoutimages/ecoplating.jpg" /></div>
                    <div class="col-md-1"></div>
                </div>
                </div>
            `
        }
        else if (layoutValue == 'layout3') {
            layoutHtml = `
              <div class="tab-pane active" id="tabBody${currentTabNumber}" role="tabpanel" aria-labelledby="home-tab">tabBody${currentTabNumber}</div>
            `
        }
        else if (layoutValue == 'layout4') {
            layoutHtml = `
              <div class="tab-pane active" id="tabBody${currentTabNumber}" role="tabpanel" aria-labelledby="home-tab">tabBody${currentTabNumber}</div>
            `
        }

        layoutHtml = `
              <div class="tab-pane active" id="tabBody${currentTabNumber}" role="tabpanel" aria-labelledby="home-tab"></div>

`

        $('#tabBodyContainer').append(layoutHtml);

        setTimeout(function () {
            $('.editableItem').each(function (i, e) {
                if ($(this).find('.editIcon').length == 0) {
                    $(this).append(`
                        <i class="fas fa-edit editIcon"></i>
                        `)
                }

            })

            $('.editableItemAbs').each(function (i, e) {
                if ($(this).find('.editIconAbs').length == 0) {
                    $(this).append(`
                        <i class="fas fa-edit editIcon editIconAbs"></i>
                        `)
                }

            })
        }, 100)

        activeTabId = 'tabBody' + currentTabNumber;

        $('#stepsContainerMain').show();
        $('.modal').modal('hide');

    }

    function LoadItemEditor(currentlyEditingItem) {

        if (currentlyEditingItem == "title") {
            currentEditing = 5;
            $('#editItemSelect').hide();
            $('#editSelectLabel').hide();
            $('#titleEditorView').show();
            var editText = $('#titleText').html();
            $('#summernoteEditTitle').summernote('reset')
            $('#summernoteEditTitle').summernote('code', editText);

        } else {
            if (currentlyEditingItem.hasClass('textItem')) {

                $('#btnAddElementItem').attr('disabled', false);
                currentEditing = 1;
                $('#textEditorView').show();
                var innerText = "";

                innerText = currentlyEditingItem.parent().html()
                //console.log(innerText);
                innerText = innerText.replace('<i class="fas fa-edit editIcon textItem"></i>', '')
                $('#summernote').summernote('reset')
                $('#summernote').summernote('code', innerText);
            }
            else if (currentlyEditingItem.hasClass('imageItem')) {
                currentEditing = 2;
                $('#imageEditorView').show();
            }
            else if (currentlyEditingItem.hasClass('videoItem')) {
                //$('#btnAddElementItem').attr('disabled', false);
                currentEditing = 3;
                $('#videoEditorView').show();
            }
            else if (currentlyEditingItem.parent().next().hasClass('tabItem')) {
                $('#editItemSelect').hide();
                $('#editSelectLabel').hide();
                $('#tabEditorView').show();

                $('#tabNewTitle').val(currTabBtn.find(".stepTitleValue").text())
            }
        }

        $('#editItemSelect').val(currentEditing)
    }

    function setupInteract() {
        snapWidth = $('#stepsContainerMain').outerWidth() / 4;
        snapHeight = $('#stepsContainerMain').height();
        snapWidth = snapWidth - 1;
        //console.log("Snapwidth: " + snapWidth)
        setTimeout(function () {

            interact('.resizableCol')
                .draggable({
                    // enable inertial throwing
                    inertia: true,
                    // keep the element within the area of it's parent
                    modifiers: [
                        interact.modifiers.restrictRect({
                            restriction: 'parent',
                        }),
                        //interact.modifiers.snap({
                        //    targets: [
                        //        interact.snappers.grid({ x: 10, y: 10 })
                        //    ],
                        //    //range: Infinity,
                        //    relativePoints: [{ x: 0, y: 0 }]
                        //}),
                    ],
                    // enable autoScroll
                    //autoScroll: true,

                    listeners: {
                        // call this function on every dragmove event
                        move: dragMoveListener,

                        // call this function on every dragend event
                        end(event) {

                        }
                    }
                })
                .resizable({
                    edges: { left: true, right: true, top: true, bottom: true },
                    modifiers: [
                        interact.modifiers.snapSize({
                            targets: [
                                interact.snappers.grid({ width: snapWidth }),
                            ],
                        }),
                    ],
                    listeners: {
                        move: function (event) {
                            //console.log("Resizing")
                            let { x, y } = event.target.dataset

                            x = (parseFloat(x) || 0) + event.deltaRect.left
                            y = (parseFloat(y) || 0) + event.deltaRect.top

                            Object.assign(event.target.style, {
                                width: `${event.rect.width}px`,
                                height: `${event.rect.height}px`,
                                transform: `translate(${x}px, ${y}px)`
                            })

                            Object.assign(event.target.dataset, { x, y })
                        }
                    }
                })
                .on(['resizeend'], updateElementSizingEnd)
                .on(['resizemove'], updateElementSizingMove)

            interact('.resizableRow')
                .resizable({
                    edges: { left: true, right: true, top: true, bottom: true },
                    modifiers: [
                        interact.modifiers.snapSize({
                            targets: [
                                interact.snappers.grid({ width: snapWidth }),
                            ],
                        }),
                    ],
                    listeners: {
                        move: function (event) {
                            //console.log("Resizing")
                            let { x, y } = event.target.dataset

                            x = (parseFloat(x) || 0) + event.deltaRect.left
                            y = (parseFloat(y) || 0) + event.deltaRect.top

                            Object.assign(event.target.style, {
                                width: `${event.rect.width}px`,
                                height: `${event.rect.height}px`,
                                transform: `translate(${x}px, ${y}px)`
                            })

                            Object.assign(event.target.dataset, { x, y })
                        }
                    }
                })
            //.on(['resizeend'], updateElementSizingEnd)
            //.on(['resizemove'], updateElementSizingMove)

            function dragMoveListener(event) {
                //console.log("Dragging")
                var target = event.target
                // keep the dragged position in the data-x/data-y attributes
                var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

                // translate the element
                target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

                // update the posiion attributes
                target.setAttribute('data-x', x)
                target.setAttribute('data-y', y)
            }

            // this function is used later in the resizing and gesture demos
            //window.dragMoveListener = dragMoveListener

            //interact('.resizableImg')
            //    .resizable({
            //        // resize from all edges and corners
            //        edges: { bottom: true, top: true },

            //        listeners: {
            //            move(event) {
            //                var target = event.target
            //                var x = (parseFloat(target.getAttribute('data-x')) || 0)
            //                var y = (parseFloat(target.getAttribute('data-y')) || 0)

            //                // update the element's style
            //                target.style.width = event.rect.width + 'px'
            //                target.style.height = event.rect.height + 'px'

            //                // translate when resizing from top or left edges
            //                x += event.deltaRect.left
            //                y += event.deltaRect.top

            //                target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

            //                target.setAttribute('data-x', x)
            //                target.setAttribute('data-y', y)

            //            }
            //        },
            //        modifiers: [
            //            interact.modifiers.restrictSize({ max: 'parent' })
            //        ],

            //    })
            //    .on(['resizemove'], updateElementSizingMove)
        }, 100)
    }

    function updateElementSizingEnd(event) {
        //console.log(event.target.offsetWidth)
        var target = event.target
        var deltaRectWidth = event.deltaRect.width;

        //console.log($(target).children('.stepColInner').children('.step-img').first())
        $(target).children('.stepColInner').children('.step-img').width($(target).width() - 2)

        if (deltaRectWidth > 0) {
            //    if ($(target).hasClass('col-md-3')) {
            //        $(target).removeClass('col-md-3');
            //        $(target).addClass('col-md-6');
            //    }
            //    else if ($(target).hasClass('col-md-6')) {
            //        $(target).removeClass('col-md-6');
            //        $(target).addClass('col-md-9');
            //    }
            //    else if ($(target).hasClass('col-md-9')) {
            //        $(target).removeClass('col-md-9');
            //        $(target).addClass('col-md-12');
            //    }
            //}
            //else {
            //    if ($(target).hasClass('col-md-12')) {
            //        $(target).removeClass('col-md-12');
            //        $(target).addClass('col-md-9');
            //    }
            //    else if ($(target).hasClass('col-md-9')) {
            //        $(target).removeClass('col-md-9');
            //        $(target).addClass('col-md-6');
            //    }
            //    else if ($(target).hasClass('col-md-6')) {
            //        $(target).removeClass('col-md-6');
            //        $(target).addClass('col-md-3');
            //    }
        }
        //var targetElem = $(target)
    }

    function updateElementSizingMove(event) {
        //console.log(event.target.offsetWidth)
        var target = event.target
        //console.log($(target).children('.stepColInner').children('.step-img').first())
        $(target).children('.stepColInner').children('.step-img').width($(target).width() - 2);
        var targElem = $(target).children('.stepColInner');
        //console.log(targElem.innerHeight())
        //$(target).children('.stepColInner').css('display', 'block');
        //$(target).children('.stepColInner').css('overflow', 'auto');
        //$(target).children('.stepColInner').css('height', 'auto');
        //var newHeight = targElem.height() + 5;
        //var currentHeight = $(target).closest('.stepContainerRow ').data('xheight');

        //if (newHeight > currentHeight) {
        //    $(target).closest('.stepContainerRow ').css('height', newHeight);
        //    $(target).closest('.stepContainerRow ').data('xheight', newHeight);
        //}
        //$(target).closest('.stepContainerRow ')
    }

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
})