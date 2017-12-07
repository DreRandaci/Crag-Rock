'use strict';

app.service("RoutesService", function ($http, $q, $rootScope, FIREBASE_CONFIG) {

    const createRouteObj = (route, tripId) => {
        return {
            "routeId": route.id,
            "name": route.name,
            "difficulty": route.rating,
            "stars": route.stars,
            "wall": route.location[2],
            "trip_id": tripId,
            "uid": $rootScope.uid
        };
    };

    const getRoutes = (userUid) => {
        let routes = [];
        return $q((resolve, reject) => {
            $http.get(`${FIREBASE_CONFIG.databaseURL}/savedRoutesForTrips.json?orderBy="uid"&equalTo="${userUid}"`).then((results) => {
                let fbRoutes = results.data;
                Object.keys(fbRoutes).forEach((key) => {
                    fbRoutes[key].id = key;
                    routes.push(fbRoutes[key]);
                });
                resolve(routes);
            }).catch((error) => {
                reject(error);
            });
        });
    };

    const saveTripRoutesToFirebase = (newRoute) => {
        return $http.post(`${FIREBASE_CONFIG.databaseURL}/savedRoutesForTrips.json`, JSON.stringify(newRoute));
    };

    return { saveTripRoutesToFirebase, createRouteObj, getRoutes };
});