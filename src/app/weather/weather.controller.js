angular.module('sagremorApp')
    .controller('weatherCtrl', [
    '$scope',
    '$translate',
    '$uibModal',
    'toaster',
    'sagremorService',
    'carleonFactory',
    'sharedData',
    'sagremorParams',
    function($scope, $translate, $uibModal, toaster, sagremorService, carleonFactory, sharedData, sagremorParams) {
      
        var self = this;
        
        this.messages = {};
        this.sagremorParams = sagremorParams;
        
        this.init = function () {
			$translate(["edit", "remove"]).then(function (results) {
				self.menuMock = [
					{
						name: "edit", 
						display: results.edit, 
						action: function (param) {
							self.editMock(param);
						}
					},
					{
						name: "remove", 
						display: results.remove, 
						action: function (param) {
							self.removeMock(param.name);
						}
					}
				];
				
				self.updateMockList();
			});
		};
		
		/* Mock service */
		this.mockServiceList = [];
		
		this.updateMockList = function () {
			carleonFactory.getMockList().then(function (result) {
				self.mockServiceList = result;
			}, function (error) {
			});
		};
		
		this.addMock = function () {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/carleonMock/carleonMock.modal.html',
				controller: 'CarleonMockModalCtrl',
				controllerAs: 'CarleonMockModalCtrl',
				size: 'sm',
				resolve: {
					mock: function () {
						return {};
					}
				}
			});
		};
		
		this.editMock = function (mock) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'components/carleonMock/carleonMock.modal.html',
				controller: 'CarleonMockModalCtrl',
				controllerAs: 'CarleonMockModalCtrl',
				size: 'sm',
				resolve: {
					mock: function () {
						return mock;
					}
				}
			});
		};
		
		this.removeMock = function (name) {
			carleonFactory.removeMock(name).then(function () {
                $scope.$broadcast('carleonMockChanged');
                toaster.pop("success", self.messages.carleon_mock_remove, self.messages.carleon_mock_remove_success);
			}, function (error) {
                toaster.pop("error", self.messages.carleon_mock_remove, self.messages.carleon_mock_remove_error);
			});
		};
		
		$scope.$on('carleonMockChanged', function () {
			self.updateMockList();
		});
        
        this.init();
        
    }
]);
