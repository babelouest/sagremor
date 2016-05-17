angular.module('sagremorApp')
    .controller('ConfirmModalCtrl', [
    '$uibModalInstance',
    'title',
    'message',
    function($uibModalInstance, title, message) {
        var self = this;
        
        this.title = title;
        this.message = message;
        
        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        this.ok = function () {
            $uibModalInstance.close('ok');
        };
        
    }
]);
