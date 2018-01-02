'use strict';

app.controller("ProfileCtrl", function ($rootScope, $scope, AuthService, ProfileService) {

    $scope.user = AuthService.getCurrentUserInfo();

    // MODAL USER PREFS
    $rootScope.savedPrefs = [];
    $scope.preferences = [{ type: 'Sport', id: 'user_sport' }, { type: 'Boulder', id: 'user_boulder' }, { type: 'Trad', id: 'user_trad' }, { type: 'Alpine', id: 'user_alpine' }];
    $scope.allPref = [{ disabled: false }];
    $scope.togglePreference = (index, pref) => {
        $scope.preferences[index].disabled = $scope.preferences[index].disabled ? false : true;
        if (pref.disabled) {
            let newPref = createPrefObj(pref);
            $rootScope.savedPrefs.push(newPref);
        } else {
            $rootScope.savedPrefs.forEach((savedPref, i) => {
                if (savedPref.id == pref.id) {
                    $rootScope.savedPrefs.splice(i, 1);
                }
            });
        }
    };

    const createPrefObj = (pref) => {
        return {
            "type": pref.type,
            "id": pref.id
        };
    };

    $scope.toggleAllPreferences = () => {
        // WHEN THE 'ALL' OPTION IS CLICKED, TOGGLE THE DISABLE CLASS ON/OFF
        $scope.allPref.disabled = $scope.allPref.disabled ? false : true;
        if ($scope.allPref.disabled) {
            $rootScope.savedPrefs = [];
            $scope.preferences.forEach((pref) => {
                pref.disabled = true;
                let newPref = createPrefObj(pref);
                $rootScope.savedPrefs.push(newPref);
            });
        } else {
            $rootScope.savedPrefs = [];
            $scope.preferences.forEach((pref) => {
                pref.disabled = false;
            });
        }
    };

    const getUserPrefs = () => {
        ProfileService.getUserPrefs(AuthService.getCurrentUid()).then((res) => {            
            $rootScope.user_prefs = res;
        }).catch((err) => {
            console.log('err in getUserPrefs', err);
        });
    };

    // FIRES ONCE USERS ARE AUTHENTICATED
    const userPrefsReady = () => {
        if ($rootScope.navbar) {
            getUserPrefs();
        }
    };
    userPrefsReady();

    // DROPDOWN BUTTON
    $scope.status = {
        isopen: false
    };

});