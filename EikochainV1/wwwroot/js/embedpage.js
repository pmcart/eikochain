$(document).ready(function () {

        $('#EmbedPageModal').modal('show');
    $('#EmbedPageModal').css('opacity', '100');
    $('#EmbedPageModal').css('background-color', 'transparent');
    $('#modalOkBtn').on('click', function () {
        $('#EmbedPageModal').modal('hide');
    })

    $('#extContainer main div').each(function (elem, ind) {
        $(this).hover(function () {
            $('#extContainer main div').css("border", "none");
            $(this).css("border", "2px solid blue");
        }, function () {
            $(this).css("border", "none");
        })
    })

    $('#extContainer main div').on('click', function (e) {
        var targetLoc = $(this).attr('id')

        if (targetLoc == null || targetLoc == undefined) {
            targetLoc = $(this).attr('class');
        }

        $('#open-modal').remove();

        e.stopPropagation();
        $(this).append(`<div id="eikochainContainer"><button class="eikochainEmbedBtn" id="open-modal" >
        Our Sustainability Story
        <div>
            <span class="eikochainTextLine">
                Powered By
                <img id="eikochainEmbedBtnLogo" src="https://app.eikochain.com/eikochainlogo5.png" alt="Eikochain">
            </span>
        </div>
    </button></div>
<script id="eikochainjs" data-target="${targetLoc}" data-styles="" src="https://eikochaincdn.blob.core.windows.net/scripts/eikochainweb.js"></script>
`)
      
        $('#embedCodeInput').val(`<script id="eikochainjs" data-target="${targetLoc}" data-styles="" src="https://eikochaincdn.blob.core.windows.net/scripts/eikochainweb.js"></script>`)

    })
})