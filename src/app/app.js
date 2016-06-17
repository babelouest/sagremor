angular.module("sagremorApp", [
"ui.bootstrap",
"ui.router", 
"ngCookies", 
"frapontillo.bootstrap-switch", 
"toaster", 
"ui.bootstrap.contextMenu", 
"pascalprecht.translate",
"chart.js"
])
.constant("_", window._)
.constant("angharadConstant", {
    "scriptActionElements": [
        {name: "switch", label: "script_action_benoic_switch"},
        {name: "dimmer", label: "script_action_benoic_dimmer"},
        {name: "heater", label: "script_action_benoic_heater"},
        {name: "sag-mock", label: "script_action_sagremor_mock"}
    ],
    "monitoredEveryEnum": [
        {value: 60, label: "1_minute"},
        {value: 120, label: "2_minutes"},
        {value: 300, label: "5_minutes"},
        {value: 600, label: "10_minutes"},
        {value: 900, label: "15_minutes"},
        {value: 1200, label: "20_minutes"},
        {value: 1800, label: "30_minutes"},
        {value: 3600, label: "1_hour"},
        {value: 7200, label: "2_hours"},
        {value: 10800, label: "3_hours"},
        {value: 14400, label: "4_hours"},
        {value: 18000, label: "5_hours"},
        {value: 21600, label: "6_hours"},
        {value: 43200, label: "12_hours"},
        {value: 86400, label: "1_day"}
    ]
})
.config(["$translateProvider", "$translatePartialLoaderProvider", function ($translateProvider, $translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart("app");
    $translatePartialLoaderProvider.addPart("components");
    $translateProvider.useLoader("$translatePartialLoader", {
        urlTemplate: "/i18n/{part}/{lang}.json"
    });
    $translateProvider.determinePreferredLanguage();
    $translateProvider.useCookieStorage();
    $translateProvider.useSanitizeValueStrategy("escape");
}])
.factory("sharedData", function() {
    var sharedData = {};
    
    var add = function(share, name, data) {
        if (!sharedData[share]) {
            sharedData[share] = {};
        }
        sharedData[share][name] = data;
    };
    
    var get = function(share, name) {
        if (!!sharedData[share] && !!sharedData[share][name]) {
            return sharedData[share][name];
        } else {
            return undefined;
        }
    };
    
    var remove = function(share, name) {
        return delete sharedData[share][name];
    };
    
    var all = function(share) {
        return sharedData[share];
    };
    
    return {
        all: all,
        get: get,
        add: add,
        remove: remove
    };
})
.factory("sagremorParams", function () {
    var params = {};
    
    return params;
})
.factory("sagremorConfirm", function ($uibModal) {
    
    var open = function (title, message) {
        return modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "components/confirm/confirm.modal.html",
            controller: "ConfirmModalCtrl",
            controllerAs: "ConfirmModalCtrl",
            size: "sm",
            resolve: {
                title: function () {
                    return title;
                },
                message: function () {
                    return message;
                }
            }
        }).result;
    };
    
    return {open: open};
})
.service("sagGenericInjectorManager", function () {
    var self = this;
    self.components = [];
    
    this.add = function (config) {
        self.components.push(config);
    }
});
