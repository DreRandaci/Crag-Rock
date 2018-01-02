'use strict';

app.controller("ProfileCtrl", function ($rootScope, $scope, AuthService) {
    // console.log($rootScope.user);

    $scope.user = AuthService.getCurrentUserInfo();

    $scope.preferences = [{ type: 'Sport' }, { type: 'Boulder' }, { type: 'Trad' }, { type: 'Alpine' }];
    $scope.selectAll = [{ disabled: false }];
    $scope.togglePreference = (index, pref) => {
        $scope.preferences[index].disabled = $scope.preferences[index].disabled ? false : true;
    };

    $scope.toggleAllPreferences = (all) => {
        $scope.selectAll[0].disabled = all.disabled ? false : true;
        if (all.disabled) {
            $scope.preferences.forEach((pref) => {
                pref.disabled = true;
            });
        } else {
            $scope.preferences.forEach((pref) => {
                pref.disabled = false;
            });
        }
    };
});