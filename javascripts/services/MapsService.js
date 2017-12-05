'use strict';

app.service("MapsService", function( $http, GOOGLEMAPS_CONFIG ){

    const getMapByAddressQuery = (address) => {
        return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLEMAPS_CONFIG}`);
    };
    return { getMapByAddressQuery };
});