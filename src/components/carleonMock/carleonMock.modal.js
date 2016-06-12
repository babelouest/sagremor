angular.module('sagremorApp')
    .controller('CarleonMockModalCtrl', [
    '$rootScope',
    '$uibModalInstance',
    '$translate',
    'sharedData',
    'toaster',
    'carleonFactory',
    'mock',
    function($rootScope, $uibModalInstance, $translate, sharedData, toaster, carleonFactory, mock) {
        var self = this;

        this.messages = {};
        this.add = true;

        function init() {
			if (!!mock) {
				self.mock = mock;
				self.add = false;
			} else {
				self.mock = {};
			}
        }
        
        this.cancel = function () {
			$uibModalInstance.dismiss('close');
		};

        this.save = function () {
			if (self.add) {
				carleonFactory.addMock(self.mock).then(function () {
					sharedData.get('carleonServices', "mock-service").element.push(self.mock);
					$rootScope.$broadcast('carleonServicesChanged');
					toaster.pop("success", $translate.instant('carleon_mock_save'), $translate.instant('carleon_mock_save_success'));
				}, function (error) {
					toaster.pop("error", $translate.instant('carleon_mock_save'), $translate.instant('carleon_mock_save_error'));
				})['finally'](function () {
					$uibModalInstance.dismiss('close');
				});
			} else {
				carleonFactory.setMock(self.mock.name, self.mock).then(function () {
					var mocks = sharedData.get('carleonServices', "mock-service").element;
					_.forEach(mocks, function (mock) {
						if (mock.name === self.mock.name) {
							mock.description = self.mock.description;
						}
					});
					$rootScope.$broadcast('carleonServicesChanged');
					toaster.pop("success", $translate.instant('carleon_mock_save'), $translate.instant('carleon_mock_save_success'));
				}, function (error) {
					toaster.pop("error", $translate.instant('carleon_mock_save'), $translate.instant('carleon_mock_save_error'));
				})['finally'](function () {
					$uibModalInstance.dismiss('close');
				});
			}
		};

        init();
    }
]);
