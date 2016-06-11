angular.module('sagremorApp', [
    'ui.bootstrap',
    'ui.router', 
    'ngCookies', 
    'frapontillo.bootstrap-switch', 
    'toaster', 
    'ui.bootstrap.contextMenu', 
    'pascalprecht.translate',
    'chart.js'
    ])
    .constant('_', window._)
    .config(['$translateProvider', '$translatePartialLoaderProvider', function ($translateProvider, $translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('core');
        $translatePartialLoaderProvider.addPart('home');
        $translatePartialLoaderProvider.addPart('parameters');
        $translatePartialLoaderProvider.addPart('switches');
        $translatePartialLoaderProvider.addPart('sensors');
        $translatePartialLoaderProvider.addPart('heaters');
        $translatePartialLoaderProvider.addPart('scripts');
        $translatePartialLoaderProvider.addPart('components/topRightMenu');
        $translatePartialLoaderProvider.addPart('components/monitor');
        $translatePartialLoaderProvider.addPart('components/switch');
        $translatePartialLoaderProvider.addPart('components/dimmer');
        $translatePartialLoaderProvider.addPart('components/sensor');
        $translatePartialLoaderProvider.addPart('components/heater');
        $translatePartialLoaderProvider.addPart('components/carleonMock');
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '/i18n/{part}/{lang}.json'
        });
        $translateProvider.determinePreferredLanguage();
        $translateProvider.useCookieStorage();
        $translateProvider.useSanitizeValueStrategy('escape');
    }])
    .factory('sharedData', function() {
        var sharedData = {};
        
        var add = function(share, name, data) {
            if (!sharedData[share]) {
                sharedData[share] = {};
            }
            sharedData[share][name] = data;
        };
        
        var get = function(share, name) {
            return sharedData[share][name];
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
    .factory('sagremorParams', function () {
        var params = {};
        
        return params;
    })
    .factory('sagremorConfirm', function ($uibModal) {
        
        var open = function (title, message) {
            return modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'components/confirm/confirm.modal.html',
                controller: 'ConfirmModalCtrl',
                controllerAs: 'ConfirmModalCtrl',
                size: 'sm',
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
    });
