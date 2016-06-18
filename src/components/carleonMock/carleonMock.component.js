function carleonMockController (carleonFactory, sagremorParams, $translate, toaster) {
    var ctrl = this;
    
    ctrl.adminMode = sagremorParams.adminMode;
    ctrl.param = {command: "command1", param1: "test", param2: 42, param3: 7.3};
    ctrl.commandList = ['command1', 'command2', 'command3'];
    ctrl.messages = {};
    
    function init() {
    }
    
    ctrl.command = function () {
		carleonFactory.commandMock(ctrl.element.name, ctrl.param.command, ctrl.param.param1, ctrl.param.param2, ctrl.param.param3).then(function (result) {
			toaster.pop("success", $translate.instant('carleon_mock_command'), $translate.instant('carleon_mock_command_success'));
		}, function (error) {
			toaster.pop("error", $translate.instant('carleon_mock_command'), $translate.instant('carleon_mock_command_error'));
		});
	};
    
    init();
}

angular.module('sagremorApp').component('carleonMock', {
    templateUrl: 'components/carleonMock/carleonMock.template.html',
    controller: carleonMockController,
    bindings: {
        element: '='
    }
})
.run(function(sagGenericInjectorManager) {
    sagGenericInjectorManager.add({
        title: "Chauffages",
        type: "mock-service",
        directive: "carleon-mock"
    });
});
