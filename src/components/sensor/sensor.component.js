function sagSensorController (benoicFactory, sagremorParams, $translate) {
    var ctrl = this;
    
    ctrl.adminMode = sagremorParams.adminMode;
    ctrl.sensor.newDisplay = ctrl.sensor.display;
    ctrl.messages = {};
    
    function init() {
        ctrl.sensor.type = "sensor";
    }
    
    ctrl.sensorDisplayValue = function() {
		var value = ctrl.sensor.value;
		if (!isNaN(parseFloat(value)) && isFinite(value)) {
			value = (Math.round(value * 100) / 100);
		}
        if (!!ctrl.sensor.options.unit) {
			value += " " + ctrl.sensor.options.unit
		}
		return value;
	};
    
    init();
}

angular.module('sagremorApp').component('sagSensor', {
    templateUrl: 'components/sensor/sensor.template.html',
    controller: sagSensorController,
    bindings: {
        sensor: '='
    }
});
