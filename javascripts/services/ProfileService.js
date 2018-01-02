'use strict';

app.service("ProfileService", function ($http, $q, FIREBASE_CONFIG, AuthService) {

    const getUserPrefs = (userUid) => {
        let prefs = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/userPreferences.json?orderBy="uid"&equalTo="${userUid}"`).then((results) => {
                let fbPrefs = results.data;
                if (fbPrefs) {
                    Object.keys(fbPrefs).forEach((key) => {
                        fbPrefs[key].id = key;
                        prefs.push(fbPrefs[key]);
                    });
                }
                resolve(prefs);
            }).catch((error) => {
                reject(error);
            });
        });
    };

    const saveUserPrefs = (pref) => {
        return $http.post(`${FIREBASE_CONFIG.databaseURL}/userPreferences.json`, JSON.stringify(pref));
    };

    const deletePref = (prefId) => {
        return $http.delete(`${FIREBASE_CONFIG.databaseURL}/userPreferences/${prefId}.json`);
    };

    return { deletePref, getUserPrefs, saveUserPrefs };
});