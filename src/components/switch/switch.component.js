function sagSwitchController (benoicFactory, sagremorParams, $uibModal) {
    var ctrl = this;
    
    ctrl.switcher.valueChecked = (ctrl.switcher.value === 1);
    ctrl.adminMode = sagremorParams.adminMode;
    ctrl.switcher.newDisplay = ctrl.switcher.display;
    
    ctrl.toggleSwitcher = function () {
        ctrl.switcher.value = ctrl.switcher.valueChecked?1:0;
        benoicFactory.setElement(ctrl.switcher.device, ctrl.switcher.name, 'switch', ctrl.switcher.value);
    };
    
    ctrl.menu = [
        ['Edit', function ($itemScope) {
            ctrl.editSwitcher();
        }],
        null,
        ['Monitor', function ($itemScope) {
            console.log($itemScope);
        }]
    ];
    
    ctrl.editSwitcher = function () {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'components/switch/switch.modal.html',
          controller: 'SwitchesModalCtrl',
          controllerAs: 'SwitchesModalCtrl',
          size: 'sm',
          resolve: {
            switcher: function () {
              return ctrl.switcher;
            }
          }
        });
    };
}

angular.module('sagremorApp').component('sagSwitch', {
    templateUrl: 'components/switch/switch.template.html',
    controller: sagSwitchController,
    bindings: {
        switcher: '='
    }
});
