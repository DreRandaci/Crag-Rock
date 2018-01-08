'use strict';

app.controller("ProfileCtrl", function ($rootScope, $scope, AuthService, MountainProjService) {

    // GRABS USER FROM MOUNTAIN PROJECTS IF THEY HAVE AN ACCOUNT
    const getUserFromMountProj = () => {
        if ($rootScope.user.MPChecked) {
            MountainProjService.getUser($rootScope.user.email).then((res) => {
            // FOR LINKING TO THE USERS PROFILE ON MOUNTAIN PROJECTS
                $scope.MPUrl = res.data.url;
            }).catch((err) => {
                console.log('err in getUserFromMountProj', err);
            });
        }
    };
    // getUserFromMountProj();

    // GETS THE USER INFO FROM FIREBASE
    const getUserProfile = () => {
        $scope.userProfile = AuthService.getCurrentUserInfo();
    };
    getUserProfile();

});