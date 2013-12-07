/* Filters */
//splice function used in pagination filters.
//angular.module('mean.articles', []).filter('slice', function() {
window.app.filter('slice', function() {
    return function(arr, start, end) {
        if(!arr){return;}
        return arr.slice(start, end);
    };
});