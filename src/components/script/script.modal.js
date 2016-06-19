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
angular.module("sagremorApp")
    .controller("ScriptModalCtrl",
    function($scope, $uibModalInstance, $translate, toaster, sagremorConstant, sagremorService, angharadFactory, sharedData, script) {
        var self = this;
        
        this.script = script;
        this.add = false;
        this.newAction = false;
        this.scriptActionElements = sagremorConstant.scriptActionElements;
        this.benoicElements = {
			switches: [],
			dimmers: [],
			heaters: []
		}
        
        function init() {
			if (!self.script) {
				self.add = true;
				self.script = {
					actions: []
				};
			}
			_.forEach(sharedData.all("benoicDevices"), function (device) {
				_.forEach(device.element.switches, function(element, name) {
					var elt = {
						device: device.name,
						type: "switch",
						name: name,
						display: element.display,
						value: true
					}
					self.benoicElements.switches.push(elt);
				});
			});
        }
        
        this.trackBenoicElement = function(element, type) {
			return element.device + "$" + type + "$" + element.name;
		};
        
        this.addAction = function () {
			self.newAction = {
				switcher : {
					value: true
				}
			};
		};
		
        this.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
        
        this.tr = function (id) {
			return $translate.instant(id);
		};

        this.save = function () {
			if (self.add) {
			} else {
			}
        };
        
        this.getBenoicElementDisplay = function (action) {
			var element = sagremorService.getBenoicElement(action.parameters.device, action.parameters.type, action.element);
			if (!!element) {
				return element.display;
			} else {
				return $translate.instant("not_found");
			}
		};
		
		this.getBenoicElementValue = function (action) {
			switch (action.parameters.type) {
				case "switch":
					return action.command==="1"?$translate.instant("switch_on"):$translate.instant("switch_off");
					break;
			}
		};
        
        this.cancelAddAction = function () {
			self.newAction = false;
		};
		
		this.saveNewAction = function () {
			switch (self.newAction.element.name) {
				case "switch":
					self.script.actions.push({
						submodule: "benoic",
						element: self.newAction.switcher.name,
						command: self.newAction.switcher.value?"1":"0",
						parameters: {
							device: self.newAction.switcher.device,
							type: "switch"
						}
					});
					self.newAction = false;
					break;
			}
		};
        
        init();
    }
);
