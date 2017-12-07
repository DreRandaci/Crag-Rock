'use strict';

app.service("RelationshipsService", function ($http, $q, $rootScope, FIREBASE_CONFIG) {
    
    const getRelationships = (userUid) => {
        let relationships = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/relationships.json?orderBy="uid"&equalTo="${userUid}"`).then((results) => {
                let fbRelationships = results.data;
                Object.keys(fbRelationships).forEach((key) => {
                    fbRelationships[key].id = key;
                    relationships.push(fbRelationships[key]);
                });
                resolve(relationships);
            }).catch((error) => {
                reject(error);
            });
        });
    };

    return {getRelationships};
});