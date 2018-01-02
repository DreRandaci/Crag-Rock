'use strict';

app.controller("NavCtrl", function( $location, $rootScope, $scope, $window, AuthService, ProfileService ) {
    $scope.logoutUser = () => {
        ProfileService.getUserPrefs(AuthService.getCurrentUid()).then((res) => {
            res.forEach((pref) => {
                ProfileService.deletePref(pref.id);
            });
        }).catch((err) => {
            console.log('error in getUserPrefs:', err);
        });
        $window.localStorage.clear();
        AuthService.logout();
        $rootScope.navbar = false;
        $location.path('/auth');
    };
});