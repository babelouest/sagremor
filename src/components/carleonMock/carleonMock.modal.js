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
        
        this.cancel = function () {
			$uibModalInstance.dismiss('close');
		};

        this.save = function () {
			carleonFactory.addMock(self.mock).then(function () {
                $rootScope.$broadcast('carleonMockChanged');
                toaster.pop("success", $translate.instant('carleon_mock_save'), $translate.instant('carleon_mock_save_success'));
            }, function (error) {
                toaster.pop("error", $translate.instant('carleon_mock_save'), $translate.instant('carleon_mock_save_error'));
            })['finally'](function () {
                $uibModalInstance.dismiss('close');
            });
		};

        init();
    }
]);
