'use strict';

app.controller("ProfileCtrl", function ($rootScope, $scope, AuthService, MountainProjService) {

    const getUserFromMountProj = () => {
        if ($rootScope.userAutheticatedWithGoogle) {
            MountainProjService.getUser($rootScope.user.email).then((res) => {
                $scope.location = res.data.location;
                $scope.MPUrl = res.data.url;
            }).catch((err) => {
                console.log('err in getUserFromMountProj', err);
            });
        }
    };
    getUserFromMountProj();

    const getUserProfile = () => {
        $scope.userProfile = AuthService.getCurrentUserInfo();
    };
    getUserProfile();

});