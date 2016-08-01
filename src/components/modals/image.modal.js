angular.module("sagremorApp")
    .controller("ImageModalCtrl",
    function($scope, $uibModalInstance, $translate, element) {
        var self = this;
        
        this.element = element;
        
        function init() {
        }
        
        this.tr = function (value) {
			return $translate.instant(value);
		};
        
        this.close = function () {
            $uibModalInstance.dismiss("close");
        };
        
        this.displayTitle = function () {
			return $translate.instant("image_title") + element.name;
		};
		
        init();
    }
);
