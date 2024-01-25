$(document).ready(function () {

    $(document).on("click", '.section-check', function () {

        $(this).closest('div.accordion-collapse')
            .find('.form-check-input')
            .prop('checked', $(this).prop('checked'));
    });

})