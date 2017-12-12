'use strict';

app.service("PlacesService", function ($http, $q, FIREBASE_CONFIG, GOOGLEPLACES_CONFIG) {

    const getGooglePlaces = (type, lat, lng) => {
        return $http.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=${type}&key=${GOOGLEPLACES_CONFIG}`);
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

    const savePlace = (place) => {
        return $http.post(`${FIREBASE_CONFIG.databaseURL}/places.json`, JSON.stringify(place));
    };

    const deletePlace = (placeId) => {
        return $http.delete(`${FIREBASE_CONFIG.databaseURL}/places/${placeId}.json`);
    };

    return { deletePlace, getGooglePlaces, getPlaces, savePlace };
});