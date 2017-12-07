'use strict';

app.service("RoutesService", function ($http, $q, $rootScope, FIREBASE_CONFIG) {
    
    const createRouteObj = (route, tripId) => {
        return {
            "routeId": route.id,
            "name": route.name,
            "difficulty": route.rating,
            "stars": route.stars,
            "wall": route.location[2],
            "trip_id": tripId
        };
    };

    const saveTripRoutesToFirebase = (newRoute) => {
        return $http.post(`${FIREBASE_CONFIG.databaseURL}/savedRoutesForTrips.json`, JSON.stringify(newRoute));
    };

    return {saveTripRoutesToFirebase, createRouteObj};
});