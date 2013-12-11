//Users service used for users REST endpoint
angular.module('mean.users').factory("Users", ['$resource', function($resource) {
    return $resource('users/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]).factory('SignoutService', function($http) {
    return {
        signout: function() {
            //not changing the url? ajax request?
            return $http.get('/signout');
        }
    }
}).factory('EncryptPassswordService', function($http) {
        return {
            getEncryptedPassword: function(pass) {
                console.log('sending:' + pass);
                return $http().post('/enc', {inf: pass}).success(
                    function (data, status, headers, config) {
                        return data;
                    }).error(function (data, status, headers, config) {
                        return status + ' ' + headers;
                    });
            }
        }
    });