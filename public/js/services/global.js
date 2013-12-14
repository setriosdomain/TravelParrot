angular.module('mean.system').factory("Global", [function() {
    var _this = this;
    _this._data = {
        user: window.user,
        authenticated: !! window.user,
        safeApply: function (scope, fn) {
            (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
        },
        getCurrentLocation : function (callback) {
                //currently works on firefox.
                var onError = function() {
                    alert("Could not get the current location. Try using Firefox.");
                };

                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        //position.coords.latitude, position.coords.longitude
                        //callaback ex: function(position) {}
                        callback,
                        onError
                    );
                }else{
                    onError();
                }
        }
    };

    return _this._data;
}]);