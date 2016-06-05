function sagHeaterController (benoicFactory, sagremorParams, $translate) {
    var ctrl = this;
    
    ctrl.heater.valueChecked = (ctrl.heater.value === 1);
    ctrl.adminMode = sagremorParams.adminMode;
    ctrl.heater.newDisplay = ctrl.heater.display;
    ctrl.messages = {};
    
    function init() {
        ctrl.heater.type = "heater";
    }
    
    ctrl.setHeater = function (value) {
		if (value == null) {
			value = ctrl.heater.value.command;
		} else {
			value = ctrl.heater.value.command + value;
		}
        benoicFactory.setElement(ctrl.heater.device, 'heater', ctrl.heater.name, value, {mode: ctrl.heater.value.mode}).then(function () {
            ctrl.heater.value.command = value;
        });
    };
    
    ctrl.displayCommandValue = function () {
		var command = (Math.round(ctrl.heater.value.command * 100) / 100);
        if (!!ctrl.heater.options.unit) {
			command += " " + ctrl.heater.options.unit
		}
		return command;
	};
	
	ctrl.displayCommand = function (command) {
		var value = "";
		if (command < 0) {
			value = command;
		} else {
			value = "+" + command;
		}
        if (!!ctrl.heater.options.unit) {
			value += " " + ctrl.heater.options.unit
		}
		return value
	};
    
    init();
}

angular.module('sagremorApp').component('sagHeater', {
    templateUrl: 'components/heater/heater.template.html',
    controller: sagHeaterController,
    bindings: {
        heater: '='
    }
});
