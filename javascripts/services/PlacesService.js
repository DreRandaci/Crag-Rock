'use strict';

app.service("PlacesService", function ($http, GOOGLEPLACES_CONFIG) {

    const getGooglePlaces = (lat, lng, type) => {
        return $http.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${GOOGLEPLACES_CONFIG}`);
    };

    return { getGooglePlaces };
});