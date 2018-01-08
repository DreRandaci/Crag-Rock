'use strict';

app.controller("AuthCtrl", function ($location, $rootScope, $scope, AuthService, MountainProjService) {

    // CREATES OBJECT TO BUILD USER
    $rootScope.user = {};
    $rootScope.user.authenticated = false;

    // BUILDS USER OBJECT
    const createUserObject = (email, name) => {
        $rootScope.user.full_name = name;
        $rootScope.user.email = email;
        $rootScope.user.MPChecked = $scope.MPChecked;
        $rootScope.user.authenticated = true;
    };

    $scope.getChecked = () => {

    };    

    // GOOGLE AUTHETICATION THROUGH FIREBASE
    $scope.authenticate = (email, password) => {
        AuthService.authenticateGoogle().then((result) => {        
            let profile = result.additionalUserInfo.profile;            
            $rootScope.user.first_name = profile.given_name;
            $rootScope.user.last_name = profile.family_name;
            $rootScope.user.full_name = profile.name;
            $rootScope.user.email = profile.email;
            $rootScope.user.picture = profile.picture;
            $rootScope.navbar = true;
            $rootScope.userAutheticatedWithGoogle = true;
            $rootScope.user.authenticated = true;
            $rootScope.user.MPChecked = $scope.MPChecked;
            $scope.$apply(() => {
                $location.url("/trip/create");
            });
        }).catch((error) => {
            console.log("error in authenticateGoogle", error);
        });
    };

    // NEW ACCOUNT CREATION THROUGH FIREBASE 
    $scope.createUserAccount = (email, name) => {
        firebase.auth().createUserWithEmailAndPassword(email, name).then((result) => {
            createUserObject(email, name);
            $rootScope.navbar = true;
            $scope.$apply(() => {
                $location.url("/trip/create");
            });
        }).catch((err) => {
            console.log('error in createUserWithEmailAndPassword:', err);
        });
    };

    // RETURNING USER LOGIN THROUGH FIREBASE
    $scope.loginUserAccount = (email, name) => {
        firebase.auth().signInWithEmailAndPassword(email, name).then((result) => {
            createUserObject(email, name);
            $rootScope.navbar = true;
            $scope.$apply(() => {
                $location.url("/trip/create");
            });
        }).catch((err) => {
            console.log('error in signInWithEmailAndPassword:', err);
        });
    };

});