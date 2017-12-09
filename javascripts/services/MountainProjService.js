'use strict';

app.service("MountainProjService", function ($http, MOUNTAINPROJ_CONFIG) {

    const getClimbingRoutesByLatLng = (lat, lng) => {
        return $http.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=0.5&key=${MOUNTAINPROJ_CONFIG}`);
    };

    const getClimbingAreas30 = (lat, lng) => {
        return $http.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=30&key=${MOUNTAINPROJ_CONFIG}`);
    };

    const getClimbingAreas50 = (lat, lng) => {
        return $http.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=50&maxResults=500&key=${MOUNTAINPROJ_CONFIG}`);
    };

    const getClimbingAreas100 = (lat, lng) => {
        return $http.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=100&maxResults=300&key=${MOUNTAINPROJ_CONFIG}`);
    };

    const getClimbingAreas200 = (lat, lng) => {
        return $http.get(`https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=200&maxResults=500&key=${MOUNTAINPROJ_CONFIG}`);
    };

    return { getClimbingRoutesByLatLng, getClimbingAreas30, getClimbingAreas50, getClimbingAreas100, getClimbingAreas200 };
});