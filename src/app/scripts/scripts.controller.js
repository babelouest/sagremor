angular.module("sagremorApp")
    .controller("scriptsCtrl",
    function($scope, $translate, sagremorService, angharadFactory, sharedData, sagremorParams) {
      
        var self = this;
        
        this.scriptList = [];
        this.sagremorParams = sagremorParams;
        
        this.init = function () {

			$translate(["edit", "remove", "add_to_dashboard"]).then(function (results) {
				self.menuScript = [
					{
						name: "edit", 
						display: results.edit, 
						action: function (param) {
							sagremorService.editScript(param);
						}
					},
					{
						name: "remove", 
						display: results.remove, 
						action: function (param) {
							sagremorService.removeScript(param).then(function () {
								$scope.$broadcast("angharadScriptsChanged");
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
				
				self.updateScripts();
			});
		};
        
        $scope.$on("angharadScriptsChanged", function () {
            self.updateScripts();
        });
        
        this.updateScripts = function () {
            var scripts = sharedData.all("angharadScripts");
            self.scriptList = [];
            for (key in scripts) {
				self.scriptList.push(scripts[key]);
            }
        };
        
        this.newScript = function () {
			sagremorService.editScript(null);
		};
		
        this.init();
        
    }
);
