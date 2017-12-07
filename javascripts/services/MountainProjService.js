'use strict';

app.service("MountainProjService", function ($http, MOUNTAINPROJ_CONFIG) {

    const getClimbingRoutesByLatLng = (lat, lng, distance, minDiff, maxDiff) => {
        return $http.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=30&key=${MOUNTAINPROJ_CONFIG}`);
    };

    const getClimbingAreaLatLng = (lat, lng) => {
        return $http.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=30&key=${MOUNTAINPROJ_CONFIG}`);
    };

    return { getClimbingRoutesByLatLng, getClimbingAreaLatLng };
});