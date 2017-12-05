'use strict';

app.service("MountainProjService", function( $http, MOUNTAINPROJ_CONFIG ){

    const getClimbingRoutesByLatLng = (lat, lng, distance, minDiff, maxDiff) => {
        return $http.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=50&minDiff=5.6&maxDiff=5.12&key=${MOUNTAINPROJ_CONFIG}`);
    };

    return { getClimbingRoutesByLatLng };
});