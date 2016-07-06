angular.module("sagremorApp")
    .controller("EditModalCtrl",
    function($uibModalInstance, title, message) {
        var self = this;
        
        this.title = title;
        this.message = message;
        this.value = "";
        
        this.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
        
        this.ok = function () {
            $uibModalInstance.close({reason: "close", value: self.value});
        };
        
    }
);
