angular.module("sagremorApp")
    .controller("monitorsCtrl",
    function($scope, $translate, sagremorService, angharadFactory, sagremorParams) {
      
        var self = this;
        
        this.monitorList = [];
        this.sagremorParams = sagremorParams;
        
        this.init = function () {

			$translate(["edit", "remove", "add_to_dashboard"]).then(function (results) {
				self.menu = [
					{
						name: "edit", 
						display: results.edit, 
						action: function (param) {
							sagremorService.editEvent(param, "monitor");
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
				
			});
		};
        
        $scope.$on("angharadMonitorsChanged", function () {
            self.updateMonitors();
        });
        
        this.updateMonitors = function () {
        };
        
        this.init();
        
    }
);
