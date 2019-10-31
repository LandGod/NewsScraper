$(document).ready(function () {

    $(".dateLine").each(function (i, element) {
        let isoDate = $(this).attr('isodate');
        let momentDate = moment(isoDate);
        let prettyDate = momentDate.format('LLLL');
        $(this).children('.displayDate').text(prettyDate);
    });

});