angular.module('sagremorApp')
    .controller('scriptsCtrl', [
    '$scope',
    '$translate',
    'sagremorService',
    'angharadFactory',
    'sharedData',
    'sagremorParams',
    function($scope, $translate, sagremorService, angharadFactory, sharedData, sagremorParams) {
      
        var self = this;
        
        this.scriptList = [];
        this.sagremorParams = sagremorParams;
        
        this.init = function () {
			self.updateScripts();
		};
        
        $scope.$on('angharadScriptsChanged', function () {
            self.updateScripts();
        });
        
        this.updateScripts = function () {
            var scripts = sharedData.all('angharadScripts');
            for (key in scripts) {
				self.scriptList.push(scripts[key]);
            }
        };
        
        this.init();
        
    }
]);
