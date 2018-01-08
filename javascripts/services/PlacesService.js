'use strict';

app.service("PlacesService", function ($http, $q, FIREBASE_CONFIG, GOOGLEPLACES_CONFIG) {

    // RETURNS A FORMATTED PLACE OBJECT TO SAVE TO FIREBASE
    const createPlaceObj = (place) => {
        return {
            "google_place_id": place.google_place_id,
            "icon": place.icon,
            "id": place.id,
            "latitude": place.latitude,
            "longitude": place.longitude,
            "name": place.name,
            "trip_id": place.trip_id,
            "type": place.type,
            "vicinity": place.vicinity
        };
    };

    const getGooglePlaces = (type, lat, lng) => {
        return $http.get(`https://weekend-send-train.herokuapp.com/api/google-places/?location=${lat},${lng}&radius=50000&type=${type}&key=${GOOGLEPLACES_CONFIG}`);
    };

    const getPlaces = (tripId) => {
        let places = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/places.json?orderBy="trip_id"&equalTo="${tripId}"`).then((results) => {
                let fbPlaces = results.data;
                if (fbPlaces) {
                    Object.keys(fbPlaces).forEach((key) => {
                        fbPlaces[key].id = key;
                        places.push(fbPlaces[key]);
                    });
                }
                resolve(places);
            }).catch((error) => {
                reject(error);
            });
        });
    };

    const getPlacesForSingleTrip = (tripId) => {
        let places = [];
        let fbPlaces = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/places.json`).then((results) => {
                fbPlaces = results.data;
                if (fbPlaces) {
                    Object.keys(fbPlaces).forEach((key) => {
                        if (fbPlaces[key].trip_id === tripId) {
                            fbPlaces[key].id = key;
                            places.push(fbPlaces[key]);
                        }
                    });
                }
                resolve(places);
            }).catch((error) => {
                reject(error);
            });
        });
    };

    const getSinglePlace = (placeId) => {
        return $http.get(`${FIREBASE_CONFIG.databaseURL}/places/${placeId}.json`);
    };

    const savePlace = (place) => {
        return $http.post(`${FIREBASE_CONFIG.databaseURL}/places.json`, JSON.stringify(place));
    };

    const deletePlace = (placeId) => {
        return $http.delete(`${FIREBASE_CONFIG.databaseURL}/places/${placeId}.json`);
    };

    return { createPlaceObj, deletePlace, getGooglePlaces, getSinglePlace, getPlaces, getPlacesForSingleTrip, savePlace };
});