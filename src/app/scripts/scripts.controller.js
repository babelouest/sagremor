angular.module("sagremorApp")
    .controller("scriptsCtrl",
    function($scope, $translate, sagremorService, angharadFactory, sharedData, sagremorParams) {
      
        var self = this;
        
        this.scriptList = [];
        this.sagremorParams = sagremorParams;
        
        this.init = function () {

			$translate(["edit", "monitor", "bind_to_element", "add_to_dashboard"]).then(function (results) {
				self.menuScript = [
					{
						name: "edit", 
						display: $translate.instant("edit"), 
						action: function (param) {
							sagremorService.editScript(param);
						}
					},
					{
						name: "remove", 
						display: $translate.instant("remove"),
						action: function (param) {
							sagremorService.removeScript(param).then(function () {
								$scope.$broadcast("angharadScriptsChanged");
							});
						}
					},
					{
						name: "bind_to_element", 
						display: $translate.instant("bind_to_element"),
						action: function (param) {
							sagremorService.bindToElement(param);
						}
					},
					{
						name: "add_to_dashboard", 
						display: $translate.instant("add_to_dashboard"),
						action: function (param) {
							param.type = "script";
							sagremorService.addToDashboard(param).then(function () {
								$scope.$broadcast("refreshDashboard");
							});
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
