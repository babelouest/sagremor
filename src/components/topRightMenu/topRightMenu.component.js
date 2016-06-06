function topRightMenuCtrl ($translate, sagremorParams) {
    var self = this;

    self.sagremorParams = sagremorParams;

    self.selectedLang = $translate.use();

    self.langList = [
        {name: "fr", display: "Fr"},
        {name: "en", display: "En"}
    ];

    self.changeLang = function () {
        $translate.use(self.selectedLang);
    };

}

angular.module('sagremorApp').component('topRightMenu', {
    templateUrl: 'components/topRightMenu/topRightMenu.template.html',
    controller: topRightMenuCtrl,
    controllerAs: 'topRightMenuCtrl'
});
