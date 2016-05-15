function sagSwitchController (benoicFactory) {
    var ctrl = this;
    
    ctrl.toggleSwitcher = function (switcher) {
      switcher.value = switcher.value==0?1:0;
      benoicFactory.setElement(switcher.device, switcher.name, 'switch', switcher.value);
    };
}

angular.module('sagremorApp').component('sagSwitch', {
  templateUrl: 'components/switch/switch.template.html',
  controller: sagSwitchController,
  bindings: {
    switcher: '=',
    onChange: '='
  }
});
