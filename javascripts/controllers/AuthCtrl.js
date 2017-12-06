'use strict';

app.controller("AuthCtrl", function ($location, $rootScope, $scope, AuthService) {
    $scope.authenticate = (userInfo) => {
        console.log("userInfo:", userInfo);
        AuthService.authenticateGoogle().then((result) => {
            $rootScope.uid = result.user.uid;
            $scope.$apply(() => {
                $location.url("/chat");
            });
        }).catch((error) => {
            console.log("error in authenticateGoogle", error);
        });
    };
});