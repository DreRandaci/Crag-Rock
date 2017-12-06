'use strict';

app.service("FirebaseService", function ($http, $q, $rootScope, FIREBASE_CONFIG) {

    const getTrips = (userUid) => {
        let trips = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/trips.json?orderBy="uid"&equalTo="${userUid}"`).then((results) => {
                let fbTrips = results.data;
                Object.keys(fbTrips).forEach((key) => {
                    fbTrips[key].id = key;
                    trips.push(fbTrips[key]);
                });
                resolve(trips);
            }).catch((error) => {
                reject(error);
            });
        });
    };

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

    const createRouteObj = (route, tripId) => {
        return {
            "routeId": route.id,
            "name": route.name,
            "difficulty": route.rating,
            "stars": route.stars,
            "wall": route.location[2],
            "trip_id": tripId
        };
    };

    const saveRoute = (newRoute) => {
        console.log(newRoute);
    };


    return { getTrips, getRelationships, getAttendees, getProfileInfo, createRouteObj };

});
