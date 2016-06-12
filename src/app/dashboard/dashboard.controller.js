angular.module('sagremorApp')
    .controller('DashboardCtrl', [
    '$scope',
    '$location',
    '$translate',
    'sagremorService',
    'sagremorParams',
    function($scope, $location, $translate, sagremorService, sagremorParams) {
      
        var self = this;
        
        this.dashboardWidgets = sagremorParams.dashboardWidgets;
        
        this.init = function () {
			if (!sagremorParams.loggedIn) {
				$location.path("/login");
			}
            if (!self.dashboardWidgets) {
                self.dashboardWidgets = [];
                sagremorParams.dashboardWidgets = [];
            }
			$translate(["remove_from_dashboard"]).then(function (results) {
				self.menu = [
					{
						name: "remove_from_dashboard", 
						display: results.remove_from_dashboard, 
						action: function (param) {
							if (sagremorService.removeFromDashboard(param)) {
                                $scope.$broadcast("refreshDashboard");
                            }
						}
					}
				];
            });
		};
        
        $scope.options = {
            cellHeight: 100,
            verticalHargin: 10
        };

        $scope.removeWidget = function(w) {
            var index = $scope.widgets.indexOf(w);
            $scope.widgets.splice(index, 1);
        };

        $scope.onChange = function(event, items) {
            console.log("onChange event: ",event," items:",items);
        };

        $scope.onItemAdded = function(item) {
            console.log("onItemAdded item: ",item);
        };

        $scope.onItemRemoved = function(item) {
            console.log("onItemRemoved item: ",item);
        };
            
        this.init();
        
}]);
