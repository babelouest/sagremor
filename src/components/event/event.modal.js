angular.module("sagremorApp")
    .controller("EventModalCtrl",
    function($scope, $rootScope, $uibModalInstance, $translate, toaster, sagremorConstant, sagremorService, angharadFactory, sharedData, sagGenericInjectorManager, event) {
        var self = this;
        
        this.event = event;
        this.add = false;
        
        function init() {
        }
        
        this.tr = function (id) {
			return $translate.instant(id);
		};

        this.save = function () {
        };
        
        this.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
        
        init();
    });
