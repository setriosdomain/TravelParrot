/* Filters */
//splice function used in pagination filters.
//angular.module('mean.articles', []).filter('slice', function() {
window.app.filter('slice', function() {
    return function(arr, start, end) {
        if(!arr){return;}
        return arr.slice(start, end);
    };
}).filter('truncate', function () {
        return function (text, length, end) {

            if (text == null || text.length == 0)
                return null;

            text = $.trim(text);

            if (isNaN(length))
                length = 10;




            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
});