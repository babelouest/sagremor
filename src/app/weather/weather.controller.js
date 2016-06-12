angular.module('sagremorApp')
    .controller('weatherCtrl', [
    '$scope',
    '$location',
    '$translate',
    '$uibModal',
    'toaster',
    'sagremorService',
    'carleonFactory',
    'sharedData',
    'sagremorParams',
    function($scope, $location, $translate, $uibModal, toaster, sagremorService, carleonFactory, sharedData, sagremorParams) {
      
        var self = this;
        
        this.messages = {};
        this.sagremorParams = sagremorParams;
        
        this.init = function () {
			if (!sagremorParams.loggedIn) {
				$location.path("/login");
			}
			$translate(["edit", "remove", "add_to_dashboard"]).then(function (results) {
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
					},
					{
						name: "add_dashboard", 
						display: results.add_to_dashboard, 
						action: function (param) {
							if (sagremorService.addToDashboard(param)) {
                                $scope.$broadcast("refreshDashboard");
                            }
						}
					}
				];
				
				self.initMockList();
			});
		};
		
		/* Mock service */
		
		this.mockServiceList = [];
		
		this.initMockList = function () {
			self.mockServiceList = [];
			var mockService = sharedData.get('carleonServices', "mock-service");
			if (!!mockService) {
				_.forEach(mockService.element, function (mock) {
					mock.type = "mock-service";
					self.mockServiceList.push(mock);
				});
			}
		};
		
		this.updateMockList = function () {
			var mockService = sharedData.get('carleonServices', "mock-service");
			mockService.element = self.mockServiceList;
			sharedData.set('carleonServices', "mock-service", self.mockServiceList);
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
						return false;
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
                toaster.pop("success", $translate.instant('carleon_mock_remove'), $translate.instant('carleon_mock_remove_success'));
                var mockService = sharedData.get('carleonServices', "mock-service");
                _.remove(mockService.element, function (mock) {
					return mock.name === name;
				});
				self.initMockList();
			}, function (error) {
                toaster.pop("error", $translate.instant('carleon_mock_remove'), $translate.instant('carleon_mock_remove_error'));
			});
		};
		
		$scope.$on('carleonServicesChanged', function () {
			self.initMockList();
		});
        
        this.init();
        
    }
]);
