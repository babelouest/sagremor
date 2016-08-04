angular.module("sagremorApp")
    .controller("carleonMpdModalCtrl", 
    function($rootScope, $uibModalInstance, $translate, sharedData, toaster, carleonMpdFactory, mpd) {
        var self = this;

        this.messages = {};
        this.add = true;
        this.mpd = {
			name: "",
			description: "",
			host: "",
			port: 0,
			password: ""
		}

        function init() {
			if (!!mpd) {
				self.mpd = _.find(sharedData.get("carleonServices", "service-mpd").element, function (elt) {
					return elt.name === mpd.name;
				});
				self.add = false;
			} else {
				self.mpd = {
					file_list: [],
					stream_list: []
				};
			}
        }
        
        this.isMpdValid = function () {
			var found = _.find(sharedData.get("carleonServices", "service-mpd").element, function (element) {
				return element.name === self.mpd.name;
			});
			return (!found || !self.add) && !!self.mpd.name && !!self.mpd.host;
		};
        
        this.save = function () {
			if (self.add) {
				carleonMpdFactory.addMpdService(self.mpd).then(function () {
					self.mpd.type = "service-mpd";
					self.mpd.service = carleonMpdFactory;
					sharedData.get("carleonServices", "service-mpd").element.push(self.mpd);
					$rootScope.$broadcast("carleonServicesChanged");
					toaster.pop("success", $translate.instant("carleon_mpd_save"), $translate.instant("carleon_mpd_save_success"));
				}, function () {
					toaster.pop("error", $translate.instant("carleon_mpd_save"), $translate.instant("carleon_mpd_save_error"));
				})["finally"](function () {
					$uibModalInstance.dismiss("close");
				});
			} else {
				carleonMpdFactory.setMpdService(self.mpd.name, self.mpd).then(function () {
					self.mpd.type = "service-mpd";
					self.mpd.service = carleonMpdFactory;
					$rootScope.$broadcast("carleonServicesChanged");
					toaster.pop("success", $translate.instant("carleon_mpd_save"), $translate.instant("carleon_mpd_save_success"));
				}, function () {
					toaster.pop("error", $translate.instant("carleon_mpd_save"), $translate.instant("carleon_mpd_save_error"));
				})["finally"](function () {
					$uibModalInstance.dismiss("close");
				});
			}
		};
		
        this.cancel = function () {
			$uibModalInstance.dismiss("close");
		};

        init();
    }
);
