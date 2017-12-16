'use strict';

app.service("MountainProjService", function ($http, MOUNTAINPROJ_CONFIG) {

    const getClimbingRoutesByLatLng = (lat, lng) => {
        return $http.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=0.5&key=${MOUNTAINPROJ_CONFIG}`);
    };

    const getClimbingAreas10 = (lat, lng) => {
        return $http.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=15&key=${MOUNTAINPROJ_CONFIG}`);
    };

    const getClimbingAreas100 = (lat, lng) => {
        return $http.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=100&maxResults=300&key=${MOUNTAINPROJ_CONFIG}`);
    };

    return { getClimbingRoutesByLatLng, getClimbingAreas10, getClimbingAreas100 };
});