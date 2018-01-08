'use strict';

app.controller("ProfileCtrl", function ($rootScope, $scope, AuthService, MountainProjService) {

    // GETS THE USER INFO FROM FIREBASE
    const getUserProfile = () => {
        $scope.userProfile = AuthService.getCurrentUserInfo();    
    };
    getUserProfile();

});