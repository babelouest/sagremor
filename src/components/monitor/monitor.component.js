function sagMonitorController ($scope, $q, $translate, toaster, angharadFactory, benoicFactory, carleonFactory, sagremorParams, sagremorConstant, sharedData) {
    var ctrl = this;
    
    this.elementList = [];
    this.elementListDisplayed = [];
    this.colorList = [];
    this.newElement = false;
    this.newElementColor = false;
    this.durationList = sagremorConstant.durationList;
    this.duration = {value: 4};
    
    this.data = [];
    this.labels = [];
    this.series = [];
    this.colors = [];
    
    this.datasetOverride = [{
		fill: false
	}];
	
	this.options = {
		responsive: true,
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					return tooltipItem.yLabel;
				}
			}
		},
		scales: {
			xAxes: [{
				type: "time",
				display: true,
				time: {
					tooltipFormat: "YYYY/MM/DD hh:mm"
				}
			}],
			yAxes: [{
				scaleLabel: {
					display: true,
				}
			}]
		},
		elements: {
			line: {
				lineTension: 0.4,
				fill: false
			},
			point: {
				radius: 3
			}
		}
	};
    
    function init() {
		updateDevices();
		ctrl.displayMonitor();
    }
    
    this.tr = function (value) {
		return $translate.instant(value);
	};
	
    $scope.$on("updateMonitor-"+ctrl.element.name, function () {
		ctrl.displayMonitor();
	});
	
	function updateDevices() {
		var devices = sharedData.all("benoicDevices");
		
		_.forEach(devices, function (device, deviceName) {
			if (!!device.element) {
				_.forEach(device.element.switches, function (element, name) {
					if (element.monitored && element.enabled) {
						var elt = {
							name: name,
							display: element.display,
							device: deviceName,
							type: "switch"
						};
						ctrl.elementList.push(elt);
					}
				});
			}
		});
			
		_.forEach(devices, function (device, deviceName) {
			if (!!device.element) {
				_.forEach(device.element.dimmers, function (element, name) {
					if (element.monitored && element.enabled) {
						var elt = {
							name: name,
							display: element.display,
							device: deviceName,
							type: "dimmer"
						};
						ctrl.elementList.push(elt);
					}
				});
			}
		});
			
		_.forEach(devices, function (device, deviceName) {
			if (!!device.element) {
				_.forEach(device.element.heaters, function (element, name) {
					if (element.monitored && element.enabled) {
						var elt = {
							name: name,
							display: element.display,
							device: deviceName,
							type: "heater"
						};
						ctrl.elementList.push(elt);
					}
				});
			}
		});
			
		_.forEach(devices, function (device, deviceName) {
			if (!!device.element) {
				_.forEach(device.element.sensors, function (element, name) {
					if (element.monitored && element.enabled) {
						var elt = {
							name: name,
							display: element.display,
							device: deviceName,
							type: "sensor"
						};
						ctrl.elementList.push(elt);
					}
				});
			}
		});
	}
	
    this.addElement = function () {
		ctrl.newElement.color = ctrl.newElementColor;
		ctrl.element.elements.push(ctrl.newElement);
		carleonFactory.saveCurrentProfile().then(function () {
			displayMonitor();
		}, function () {
			toaster.pop("error", $translate.instant("profile_save"), $translate.instant("profile_save_error"));
		})["finally"](function () {
		});
	};
	
	this.displayMonitor = function() {
		var from = new Date();
		
		switch (ctrl.duration.value) {
			case 0:
				from.setTime(from.getTime() - 1*60*60*1000);
				break;
			case 1:
				from.setTime(from.getTime() - 2*60*60*1000);
				break;
			case 2:
				from.setTime(from.getTime() - 6*60*60*1000);
				break;
			case 3:
				from.setTime(from.getTime() - 12*60*60*1000);
				break;
			case 4:
				from.setTime(from.getTime() - 24*60*60*1000);
				break;
			case 5:
				from.setTime(from.getTime() - 48*60*60*1000);
				break;
			case 6:
				from.setTime(from.getTime() - 72*60*60*1000);
				break;
			case 7:
				from.setTime(from.getTime() - 168*60*60*1000);
				break;
			case 8:
				from.setMonth(from.getMonth() - 1);
				break;
		}
		ctrl.colorList = angular.copy(sagremorConstant.colorList);
		ctrl.elementListDisplayed = angular.copy(ctrl.elementList);
		var httpMonitor = [];
		
		_.forEach(ctrl.element.elements, function (element) {
			httpMonitor.push(benoicFactory.getMonitor(element.device, element.type, element.name, Math.round(from.getTime() / 1000)));
		});
		
		ctrl.data = [];
		ctrl.labels = [];
		ctrl.series = [];
		ctrl.colors = [];
		$q.all(httpMonitor).then(function (results) {
			for (key in results) {
				ctrl.colors.push(ctrl.element.elements[key].color);
				_.remove(ctrl.colorList, function (curColor) {
					return curColor.value === ctrl.element.elements[key].color;
				});
				_.remove(ctrl.elementListDisplayed, function (curElement) {
					return curElement.device === ctrl.element.elements[key].device &&
							curElement.type === ctrl.element.elements[key].type &&
							curElement.name === ctrl.element.elements[key].name;
				});
				ctrl.series.push(ctrl.element.elements[key].display);
                var myData = [];
                if (!!results[key] && results[key].length > 0) {
					_.forEach(results[key], function (monitor) {
						ctrl.labels.push(new Date(monitor.timestamp * 1000));
						myData.push(monitor.value);
					});
					ctrl.data.push(myData);
				}
			}
		}, function (error) {
		});
	}
	
	this.newElementValid = function () {
		return !!ctrl.newElement && !!ctrl.newElementColor;
	};
	
	this.removeSerie = function (serie) {
		if (ctrl.element.elements.indexOf(serie) >= 0) {
			ctrl.element.elements.splice(ctrl.element.elements.indexOf(serie), 1);
			carleonFactory.saveCurrentProfile().then(function () {
				displayMonitor();
			}, function () {
				toaster.pop("error", $translate.instant("profile_save"), $translate.instant("profile_save_error"));
			})["finally"](function () {
				ctrl.newElementColor = false;
				ctrl.newElement = false;
			});
		}
	};
    
    init();
}

angular.module("sagremorApp").component("sagMonitor", {
    templateUrl: "components/monitor/monitor.template.html",
    controller: sagMonitorController,
    bindings: {
        element: "="
    }
})
.run(function(sagGenericInjectorManager) {
    sagGenericInjectorManager.add({
        type: "monitor",
        directive: "sag-monitor",
        carleonService: false
    });
});
