'use strict';

app.service("TripsService", function ($http, $q, FIREBASE_CONFIG, AuthService) {

    const getTrips = (userUid) => {
        let trips = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/trips.json?orderBy="uid"&equalTo="${userUid}"`).then((results) => {
                let fbTrips = results.data;
                if (fbTrips) {
                    Object.keys(fbTrips).forEach((key) => {
                        fbTrips[key].id = key;
                        trips.push(fbTrips[key]);
                    });
                }
                resolve(trips);
            }).catch((error) => {
                reject(error);
            });
        });
    };

    const getSingleTrip = (id) => {
        return $http.get(`${FIREBASE_CONFIG.databaseURL}/trips/${id}.json`);
    };

    const createTripObj = (trip, mapAddress, lat, lng, date, area) => {
        return {
            "name": trip.name,
            "area": area,
            "description": trip.description,
            "date": date,
            "googleMapsAddress": mapAddress,
            "lat": lat,
            "lng": lng,
            "uid": AuthService.getCurrentUid()
        };
    };

    const saveTripToFirebase = (newTrip) => {
        return $http.post(`${FIREBASE_CONFIG.databaseURL}/trips.json`, JSON.stringify(newTrip));
    };

    const updateTripInFirebase = (updatedTrip, tripId) => {
        return $http.put(`${FIREBASE_CONFIG.databaseURL}/trips/${tripId}.json`, JSON.stringify(updatedTrip));
    };

    const deleteTrip = (tripId) => {
        return $http.delete(`${FIREBASE_CONFIG.databaseURL}/trips/${tripId}.json`);
    };

    return { createTripObj, deleteTrip, getTrips, getSingleTrip, saveTripToFirebase, updateTripInFirebase };

});
