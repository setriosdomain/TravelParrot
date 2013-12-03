angular.module('mean.system').factory("Global", [function() {
    var _this = this;
    _this._data = {
        user: window.user,
        authenticated: !! window.user //!! Converts it to boolean to true. ! inverted boolean false.
    };

    return _this._data;
}]);