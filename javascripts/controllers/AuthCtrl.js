'use strict';

app.controller("AuthCtrl", function ($location, $rootScope, $scope, AuthService) {
    $scope.authenticate = (userInfo) => {
        AuthService.authenticateGoogle().then((result) => {
            console.log(result);
            $rootScope.navbar = true;
            $scope.$apply(() => {
                $location.url("/trips");
            });
        }).catch((error) => {
            console.log("error in authenticateGoogle", error);
        });
    };
});