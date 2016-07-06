angular.module("sagremorApp")
    .controller("eventsCtrl",
    function($scope, $translate, sagremorService, angharadFactory, sharedData, sagremorParams) {
      
        var self = this;
        
        this.schedulerList = [];
        this.triggerList = [];
        this.sagremorParams = sagremorParams;
        
        this.init = function () {

			$translate(["edit", "remove", "add_to_dashboard"]).then(function (results) {
				self.menuScheduler = [
					{
						name: "edit", 
						display: results.edit, 
						action: function (param) {
							sagremorService.editEvent(param, "scheduler");
						}
					},
					{
						name: "remove", 
						display: results.remove, 
						action: function (param) {
							sagremorService.removeEvent(param).then(function () {
								$scope.$broadcast("angharadEventsChanged");
							});
						}
					},
					{
						name: "add_to_dashboard", 
						display: results.add_to_dashboard, 
						action: function (param) {
							param.type = !!param.next_time?"scheduler":"trigger";
							if (sagremorService.addToDashboard(param)) {
                                $scope.$broadcast("refreshDashboard");
                            }
						}
					}
				];
				
				self.updateSchedulers();
				self.updateTriggers();
			});
		};
        
        $scope.$on("angharadSchedulersChanged", function () {
            self.updateSchedulers();
        });
        
        $scope.$on("angharadTriggersChanged", function () {
            self.updateTriggers();
        });
        
        this.updateSchedulers = function () {
            var events = sharedData.all("angharadSchedulers");
            self.schedulerList = [];
            for (key in events) {
				self.schedulerList.push(events[key]);
            }
        };
        
        this.updateTriggers = function () {
            var events = sharedData.all("angharadTriggers");
            self.triggerList = [];
            for (key in events) {
				self.triggerList.push(events[key]);
            }
        };
        
        this.newEvent = function () {
			sagremorService.editEvent(null);
		};
		
        this.init();
        
    }
);
