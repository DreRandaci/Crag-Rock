'use strict';

app.service("AttendeesService", function ($http, $q, $rootScope, FIREBASE_CONFIG) {

    const getAttendees = (userUid) => {
        let attendees = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/attendees.json?orderBy="uid"&equalTo="${userUid}"`).then((results) => {
                let fbAttendees = results.data;
                Object.keys(fbAttendees).forEach((key) => {
                    fbAttendees[key].id = key;
                    attendees.push(fbAttendees[key]);
                });
                resolve(attendees);
            }).catch((error) => {
                reject(error);
            });
        });
    };

    return {getAttendees};
});