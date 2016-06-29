angular.module("sagremorApp")
    .controller("eventsCtrl",
    function($scope, $translate, sagremorService, angharadFactory, sharedData, sagremorParams) {
      
        var self = this;
        
        this.eventList = [];
        this.sagremorParams = sagremorParams;
        
        this.init = function () {
			// TODO Remove when event is done
			self.sagremorParams.adminMode = true;
			// /TODO

			$translate(["edit", "remove", "add_to_dashboard"]).then(function (results) {
				self.menuEvent = [
					{
						name: "edit", 
						display: results.edit, 
						action: function (param) {
							sagremorService.editEvent(param);
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
							if (sagremorService.addToDashboard(param)) {
                                $scope.$broadcast("refreshDashboard");
                            }
						}
					}
				];
				
				self.updateEvents();
			});
		};
        
        $scope.$on("angharadEventsChanged", function () {
            self.updateEvents();
        });
        
        this.updateEvents = function () {
            var events = sharedData.all("angharadEvents");
            self.eventList = [];
            for (key in events) {
				self.eventList.push(events[key]);
            }
        };
        
        this.newEvent = function () {
			sagremorService.editEvent(null);
		};
		
        this.init();
        
    }
);
