function carleonMotionController ($translatePartialLoader, $translate, angharadConfig, carleonFactory, carleonMotionFactory, sagremorParams, toaster) {
    var ctrl = this;
    
    this.urlBaseImages = angharadConfig.baseUrl + angharadConfig.prefixCarleon + "service-motion/" + ctrl.element.name + "/image/";
    this.type = "";

    this.images = [];
    this.fileListName = [];
    this.fileList = {};
    this.selectedFileList = "";
    
    this.streamList = [];
    this.selectedStream = false;
    
    this.online = false;
    
    this.profileParams = {};
    
    function init() {
		if (_.has(sagremorParams.currentProfile, "carleon.serviceMotion."+ctrl.element.name)) {
			ctrl.profileParams = sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name];
		} else {
			if (!sagremorParams.currentProfile.carleon) {
				sagremorParams.currentProfile.carleon = {};
			}
			if (!sagremorParams.currentProfile.carleon.serviceMotion) {
				sagremorParams.currentProfile.carleon.serviceMotion = {};
			}
			if (!sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name]) {
				sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name] = {
					type: "file",
					selectedFileList: "",
					selectedStream: ""
				}
			}
		}
		carleonMotionFactory.status(ctrl.element.name).then(function (response) {
			ctrl.online = response.online;
			ctrl.type = sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name].type;
			ctrl.fileList = response.file_list;
			_.forEach(response.file_list, function (fileList, name) {
				ctrl.fileListName.push(name);
			});
			if (!!sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name].selectedFileList) {
				ctrl.selectedFileList = sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name].selectedFileList;
				ctrl.changeSelectedFileList();
			} else if (ctrl.fileListName.length === 1) {
				ctrl.selectedFileList = ctrl.fileListName[0];
				ctrl.changeSelectedFileList();
			}
			
			_.forEach(response.stream_list, function (stream) {
				ctrl.streamList.push(stream);
			});
			if (!!sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name].selectedStream) {
				ctrl.selectedStream = sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name].selectedStream;
			} else if (ctrl.streamList.length === 1) {
				ctrl.selectedStream = ctrl.streamList[0];
			}
		});
    }
    
    this.changeSelectedFileList = function () {
		ctrl.images = [];
		_.forEach(ctrl.fileList[ctrl.selectedFileList], function (file) {
			var image = {
				thumb: ctrl.urlBaseImages + ctrl.selectedFileList + "/" + file + "?thumbnail=true",
				img: ctrl.urlBaseImages + ctrl.selectedFileList + "/" + file,
				title: file
			}
			ctrl.images.push(image);
		});
		sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name].selectedStream = "";
		sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name].selectedFileList = ctrl.selectedFileList;
		carleonFactory.saveCurrentProfile().then(function () {
			//toaster.pop("success", $translate.instant("profile_save"), $translate.instant("profile_save_success"));
		}, function () {
			toaster.pop("error", $translate.instant("profile_save"), $translate.instant("profile_save_error"));
		});
	};
	
	this.snapshot = function () {
		carleonMotionFactory.snapshot(ctrl.element.name, ctrl.selectedStream.name).then(function () {
			toaster.pop("success", $translate.instant("carleon_motion_snapshot"), $translate.instant("carleon_motion_snapshot_success"));
		}, function () {
			toaster.pop("error", $translate.instant("carleon_motion_snapshot"), $translate.instant("carleon_motion_snapshot_error"));
		});
	};
	
	this.changeType = function () {
		sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name].type = ctrl.type;
		carleonFactory.saveCurrentProfile().then(function () {
			//toaster.pop("success", $translate.instant("profile_save"), $translate.instant("profile_save_success"));
		}, function () {
			toaster.pop("error", $translate.instant("profile_save"), $translate.instant("profile_save_error"));
		});
	};
	
	this.changeSelectedStream = function () {
		sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name].selectedStream = ctrl.selectedStream;
		sagremorParams.currentProfile.carleon.serviceMotion[ctrl.element.name].selectedFileList = "";
		carleonFactory.saveCurrentProfile().then(function () {
			//toaster.pop("success", $translate.instant("profile_save"), $translate.instant("profile_save_success"));
		}, function () {
			toaster.pop("error", $translate.instant("profile_save"), $translate.instant("profile_save_error"));
		});
	};
	
    init();
}

angular.module("sagremorApp").component("serviceMotion", {
    templateUrl: "components/carleonMotion/carleonMotion.template.html",
    controller: carleonMotionController,
    bindings: {
        element: "="
    }
})
.factory("carleonMotionFactory", function($http, $uibModal, $translate, toaster, angharadConfig, angharadBackendService, sagremorConfirm, sharedData) {
    var urlBase = angharadConfig.baseUrl + angharadConfig.prefixCarleon;
    var carleonMotionFactory = {};

	/* Motion service */
    carleonMotionFactory.getMotionServiceList = function () {
        return angharadBackendService.httpRequest("GET", urlBase + "service-motion/");
    };

    carleonMotionFactory.getMotionService = function (name) {
        return angharadBackendService.httpRequest("GET", urlBase + "service-motion/" + name);
    };

    carleonMotionFactory.addMotionService = function (motionService) {
        return angharadBackendService.httpRequest("POST", urlBase + "service-motion/", motionService);
    };

    carleonMotionFactory.setMotionService = function (name, motionService) {
        return angharadBackendService.httpRequest("PUT", urlBase + "service-motion/" + name, motionService);
    };

    carleonMotionFactory.removeMotionService = function (name) {
        return angharadBackendService.httpRequest("DELETE", urlBase + "service-motion/" + name);
    };

    carleonMotionFactory.status = function (name) {
        return angharadBackendService.httpRequest("GET", urlBase + "service-motion/" + name + "/status");
    };

    carleonMotionFactory.image = function (name, file_list, file_name, thumbnail) {
		var urlParam = {};
		if (thumbnail) {
			urlParam.thumbnail = "";
		}
        return angharadBackendService.httpRequest("GET", urlBase + "service-motion/" + name + "/image/" + file_list + "/" + file_name, null, urlParam);
    };

    carleonMotionFactory.stream = function (name, stream_name) {
        return angharadBackendService.httpRequest("GET", urlBase + "service-motion/" + name + "/stream/" + stream_name);
    };

    carleonMotionFactory.snapshot = function (name, stream_name) {
        return angharadBackendService.httpRequest("PUT", urlBase + "service-motion/" + name + "/stream/" + stream_name + "/snapshot");
    };

	carleonMotionFactory.addService = function () {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: "components/carleonMotion/carleonMotion.modal.html",
			controller: "carleonMotionModalCtrl",
			controllerAs: "carleonMotionModalCtrl",
			size: "md",
			resolve: {
				motion: function () {
					return null;
				}
			}
		});
	};
	
	carleonMotionFactory.editService = function (service) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: "components/carleonMotion/carleonMotion.modal.html",
			controller: "carleonMotionModalCtrl",
			controllerAs: "carleonMotionModalCtrl",
			size: "md",
			resolve: {
				motion: function () {
					return service;
				}
			}
		});
	};
	
	carleonMotionFactory.removeService = function (service) {
		return sagremorConfirm.open($translate.instant("carleon_motion_remove"), $translate.instant("carleon_motion_confirm")).then(function () {
		});
	};
	
    return carleonMotionFactory;

})
.config(function run($translatePartialLoaderProvider) {
	$translatePartialLoaderProvider.addPart("carleonMotion");
})
.run(function(sagGenericInjectorManager, carleonMotionFactory) {
    sagGenericInjectorManager.add({
        type: "service-motion",
        directive: "service-motion",
        groupTitle: "carleon_motion_title",
        service: carleonMotionFactory,
        carleonService: true,
        size: 3,
        leftMenu: {
			title: "carleon_motion_title",
			icon: "<i class=\"fa fa-camera\"></i>",
			target: "carleonMotion"
		},
		widgetHeight: 5,
		widgetWidth: 6,
		commands: {
			exec1: {
				title: "carleon_motion_command_exec1_title",
				parameters: {
					param1: "carleon_mock_command_exec1_parameter_param1_title",
					param2: "carleon_mock_command_exec1_parameter_param2_title",
					param3: "carleon_mock_command_exec1_parameter_param3_title"
				},
				result: {
					value1: {
						type: "integer",
						title: "carleon_mock_command_exec1_result_value1_title"
					},
					value2: {
						type: "boolean",
						title: "carleon_mock_command_exec1_result_value2_title"
					}
				}
			}
		}
    });
});
