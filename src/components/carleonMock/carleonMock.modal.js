angular.module('sagremorApp')
    .controller('CarleonMockModalCtrl', [
    '$rootScope',
    '$uibModalInstance',
    'toaster',
    'carleonFactory',
    function($rootScope, $uibModalInstance, toaster, carleonFactory) {
        var self = this;

        this.messages = {};

        function init() {
        }

        this.save = function () {
			carleonFactory.addMock(self.mock).then(function () {
                $rootScope.$broadcast('carleonMockChanged');
                toaster.pop("success", self.messages.carleon_mock_save, self.messages.carleon_mock_save_success);
            }, function (error) {
                toaster.pop("error", self.messages.carleon_mock_save, self.messages.carleon_mock_save_error);
            })['finally'](function () {
                $uibModalInstance.dismiss('close');
            });
		};

        init();
    }
]);
