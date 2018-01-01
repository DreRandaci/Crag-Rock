'use strict';

app.controller("AuthCtrl", function ($location, $rootScope, $scope, AuthService) {
    $scope.authenticate = (email, password) => {
        AuthService.authenticateGoogle().then((result) => {
            $rootScope.userAutheticatedWithGoogle = true;
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

    $scope.createUserAccount = (email, name) => {
        firebase.auth().createUserWithEmailAndPassword(email, name).then((result) => {
            $rootScope.navbar = true;
            $scope.$apply(() => {
                $location.url("/trip/create");
            });
        }).catch(function(error) {
            console.log('error code in createUserWithEmailAndPassword:', error.code);
            console.log('error message in createUserWithEmailAndPassword:', error.message);
          });
    };

});