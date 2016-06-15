/**
 * 
 * action format:
 * 
 * {
 *   "submodule": "submodule_name",   // Required
 *   "element": "element_name"        // Required
 *   "command": "command"             // Required
 *   "parameters": {                  // Required for submodule benoic, depends on the element for submodule carleon
 *     "device": "device_name"        // Required for submodule benoic
 *     "element_type": "element_type" // Required for submodule benoic
 *     "service": "service_uid"       // Required for carleon
 *     "param1": "value1",            // for a string value
 *     "param2": 2,                   // for an integer value
 *     "param3", 3.3                  // for a real value
 *   }
 * 
 */
angular.module('sagremorApp')
    .controller('ScriptModalCtrl', [
    '$scope',
    '$uibModalInstance',
    '$translate',
    'toaster',
    'angharadConstant',
    'benoicFactory',
    'script',
    function($scope, $uibModalInstance, $translate, toaster, angharadConstant, angharadFactory, script) {
        var self = this;
        
        this.script = script;
        this.newAction = false;
        this.scriptActionElements = angharadConstant.scriptActionElements;
        
        function init() {
        }
        
        this.addAction = function () {
			self.newAction = true;
		};
        
        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        this.tr = function (id) {
			return $translate.instant(id);
		};

        this.save = function () {
            self.sensor.display = self.sensor.newDisplay;
            self.sensor.monitor = self.sensor.monitorChecked?1:0;
            benoicFactory.updateElement(self.sensor.device, "sensor", self.sensor.name, self.sensor).then(function (response) {
                $scope.$broadcast('benoicSensorsChanged');
                toaster.pop("success", self.messages.sensor_save, self.messages.sensor_save_success);
            }, function (error) {
                toaster.pop("error", self.messages.sensor_save, self.messages.sensor_save_error);
            })['finally'](function () {
                $uibModalInstance.dismiss('close');
            });
        };
        
        init();
    }
]);
