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
            "id": pref.id,
            "uid" : AuthService.getCurrentUid()
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
        if ($rootScope.navbar) {
            ProfileService.getUserPrefs(AuthService.getCurrentUid()).then((res) => {
                $rootScope.user_prefs = res;
            }).catch((err) => {
                console.log('err in getUserPrefs', err);
            });
        }
    };
    // FIRES ONCE USERS ARE AUTHENTICATED
    getUserPrefs();


    $scope.addDisabledToSavedPrefs = () => {
        $scope.preferences.forEach((pref) => {
            $rootScope.user_prefs.forEach((user_pref) => {
                if (pref.type == user_pref.type) {
                    pref.disabled = true;
                }
            });
        });
    };

    $scope.editPref = (index, pref) => {
        $scope.preferences[index].disabled = $scope.preferences[index].disabled ? false : true;
        ProfileService.getUserPrefs(AuthService.getCurrentUid()).then((res) => {
            if (pref.disabled) {
                let newPref = createPrefObj(pref);
                ProfileService.saveUserPrefs(newPref);
            } else {
                ProfileService.getUserPrefs(AuthService.getCurrentUid()).then((res) => {
                    res.forEach((saved_pref) => {
                        if (pref.type == saved_pref.type) {
                            ProfileService.deletePref(saved_pref.id);
                        }
                    });
                });
            }
        }).catch((err) => {
            console.log('err in getUserPrefs', err);
        });
    };    

    $scope.updateDropdown = () => {
        getUserPrefs();
    };

    // DROPDOWN BUTTON
    $scope.status = {
        isopen: false
    };

});