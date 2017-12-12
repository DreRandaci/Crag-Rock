'use strict';

app.service("PlacesService", function ($http, FIREBASE_CONFIG, GOOGLEPLACES_CONFIG) {

    const getGooglePlaces = (type, lat, lng) => {
        return $http.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=${type}&key=${GOOGLEPLACES_CONFIG}`);
    };

    const savePlace = (place) => {
        return $http.post(`${FIREBASE_CONFIG.databaseURL}/places.json`, JSON.stringify(place));
    };

    return { getGooglePlaces, savePlace };
});