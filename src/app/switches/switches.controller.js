angular.module('angharadApp')
  .controller('switchesCtrl', [
  '$scope',
  'benoicFactory',
  function($scope, benoicFactory) {
    
    this.switches = [];
    this.dimmers = [];
    
    var self = this;
    
    function init() {
    };
    
    init();
  }
]);
