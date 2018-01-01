'use strict';

app.controller("AuthCtrl", function ($location, $rootScope, $scope, AuthService) {
    $scope.authenticate = (userInfo) => {
        AuthService.authenticateGoogle().then((result) => {
            let profile = result.additionalUserInfo.profile;
            let formatUser = {};
            formatUser.first_name = profile.given_name;
            formatUser.last_name = profile.family_name;
            formatUser.full_name = profile.name;
            formatUser.email = profile.email;
            formatUser.picture = profile.picture;
            $scope.user = formatUser;
            
            $rootScope.navbar = true;
            $scope.$apply(() => {
                $location.url("/trip/create");
            });
        }).catch((error) => {
            console.log("error in authenticateGoogle", error);
        });
    };

    $scope.createUserAccount = (userInfo) => {
        
    };

});