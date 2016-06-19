angular.module('sagremorApp')
    .controller('serviceCtrl',
    function($scope, $stateParams, $location, $translate, $uibModal, toaster, sagGenericInjectorManager, sagremorService, carleonFactory, sharedData, sagremorParams) {
      
        var self = this;
        
        this.sagremorParams = sagremorParams;
        this.serviceListGroups = [];
        this.currentInjectors = _.filter(sagGenericInjectorManager.components, function (component) {
			return component.leftMenu && component.leftMenu.target === $stateParams.service;
		});
        
        this.init = function () {
			if (!sagremorParams.loggedIn) {
				$location.path("/login");
			}
			
			$translate(["edit", "remove", "add_to_dashboard"]).then(function (results) {
				self.menu = [
					{
						name: "edit", 
						display: results.edit, 
						action: function (param) {
							param.service.editService(param);
						}
					},
					{
						name: "remove", 
						display: results.remove, 
						action: function (param) {
							param.service.removeService(param).then(function () {
								$scope.$broadcast("carleonServicesChanged");
							});
						}
					},
					{
						name: "add_to_dashboard", 
						display: results.add_to_dashboard, 
						action: function (param) {
							if (sagremorService.addToDashboard(param)) {
                                $scope.$broadcast("refreshDashboard");
                            }
						}
					}
				];
			});
			loadServices();
		};
		
		function loadServices () {
			self.serviceListGroups = [];
			_.forEach(self.currentInjectors, function(injector) {
				self.title = injector.leftMenu.title;
				var serviceList = [];
				var service = sharedData.get("carleonServices", injector.type);
				if (!!service && !!service.element) {
					_.forEach(service.element, function (element) {
						var elt = {name: element.name, type: element.type, description: element.description, service: injector.service};
						serviceList.push(elt);
					});
				}
				self.serviceListGroups.push({title: injector.groupTitle, list: serviceList, service: injector.service});
			});
		}
		
		this.addService = function (service) {
			service.addService();
		};
		
		$scope.$on('carleonServicesChanged', function () {
			loadServices();
		});
        
        this.init();
        
    }
);
