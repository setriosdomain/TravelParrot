//Messages service used for articles REST endpoint
angular.module('mean.messages').factory("Messages", ['$resource', function($resource) {
    return $resource('messages/:messageId', {
        messageId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);