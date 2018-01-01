'use strict';

app.controller("ProfileCtrl", function( $rootScope, $scope, AuthService ) {
    // console.log($rootScope.user);

    $scope.user = AuthService.getCurrentUserInfo();
    
});