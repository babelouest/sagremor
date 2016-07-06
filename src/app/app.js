angular.module("sagremorApp", [
"ui.bootstrap",
"ui.router", 
"ngCookies", 
"frapontillo.bootstrap-switch", 
"toaster", 
"ui.bootstrap.contextMenu", 
"pascalprecht.translate",
"chart.js",
"ngSanitize",
"ui.bootstrap.datetimepicker"
])
.constant("_", window._)
.constant("sagremorConstant", {
    scriptActionElements: [
        {name: "switch", label: "script_action_benoic_switch", submodule: "benoic"},
        {name: "dimmer", label: "script_action_benoic_dimmer", submodule: "benoic"},
        {name: "heater", label: "script_action_benoic_heater", submodule: "benoic"}
    ],
    conditionList: [
        {name: "switch", label: "event_condition_benoic_switch", submodule: "benoic"},
        {name: "dimmer", label: "event_condition_benoic_dimmer", submodule: "benoic"},
        {name: "heater", label: "event_condition_benoic_heater", submodule: "benoic"},
        {name: "sensor", label: "event_condition_benoic_sensor", submodule: "benoic"}
    ],
    monitoredEveryEnum: [
        {value: 60, label: "monitor_1_minute"},
        {value: 120, label: "monitor_2_minutes"},
        {value: 300, label: "monitor_5_minutes"},
        {value: 600, label: "monitor_10_minutes"},
        {value: 900, label: "monitor_15_minutes"},
        {value: 1200, label: "monitor_20_minutes"},
        {value: 1800, label: "monitor_30_minutes"},
        {value: 3600, label: "monitor_1_hour"},
        {value: 7200, label: "monitor_2_hours"},
        {value: 10800, label: "monitor_3_hours"},
        {value: 14400, label: "monitor_4_hours"},
        {value: 18000, label: "monitor_5_hours"},
        {value: 21600, label: "monitor_6_hours"},
        {value: 43200, label: "monitor_12_hours"},
        {value: 86400, label: "monitor_1_day"}
    ],
    schedulerRepeatEveryEnum: [
        {value: 0, label: "event_scheduler_repeat_every_minutes"},
        {value: 1, label: "event_scheduler_repeat_every_hours"},
        {value: 2, label: "event_scheduler_repeat_every_days"},
        {value: 3, label: "event_scheduler_repeat_every_days_of_week"},
        {value: 4, label: "event_scheduler_repeat_every_months"},
        {value: 5, label: "event_scheduler_repeat_every_year"},
    ],
    langList: [
        {name: "fr", display: "Fr"},
        {name: "en", display: "En"}
    ]

})
.config(function ($translateProvider, $translatePartialLoaderProvider) {
    $translateProvider.useLoader("$translatePartialLoader", {
        urlTemplate: "components/{part}/i18n/{lang}.json"
    });
    $translatePartialLoaderProvider.addPart("core");
    $translateProvider.determinePreferredLanguage();
    $translateProvider.useCookieStorage();
    $translateProvider.useSanitizeValueStrategy("escape");
})
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
            templateUrl: "components/modals/confirm.modal.html",
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
.factory("sagremorEdit", function ($uibModal) {
    
    var open = function (title, message) {
        return modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "components/modals/edit.modal.html",
            controller: "EditModalCtrl",
            controllerAs: "EditModalCtrl",
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
