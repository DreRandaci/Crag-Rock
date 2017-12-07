'use strict';

app.service("ProfileService", function ($http, $q, FIREBASE_CONFIG) {

    const getProfileInfo = (userUid) => {
        let info = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/profileInfo.json?orderBy="uid"&equalTo="${userUid}"`).then((results) => {
                let fbInfo = results.data;
                Object.keys(fbInfo).forEach((key) => {
                    fbInfo[key].id = key;
                    info.push(fbInfo[key]);
                });
                resolve(info);
            }).catch((error) => {
                reject(error);
            });
        });
    };

    return {getProfileInfo};
});