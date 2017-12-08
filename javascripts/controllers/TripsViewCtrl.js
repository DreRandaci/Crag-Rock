'use strict';

app.controller('TripsViewCtrl', function ($location, $scope, AuthService, RoutesService, TripsService) {

    $scope.routeToCreateTrip = () => {
        $location.path("/trip/create");
    };

    const getTrips = () => {
        TripsService.getTrips(AuthService.getCurrentUid()).then((trips) => {
            $scope.trips = trips;
            RoutesService.getRoutes(AuthService.getCurrentUid()).then((routes) => {
                $scope.routes = routes;
            }).catch((err) => {
                console.log('err in getTrips:', err);
            });
        }).catch((err) => {
            console.log('err in getRoutes:', err);
        });
    };
    getTrips();

    $scope.editTrip = (tripId) => {
        $location.path(`/trip/detail/${tripId}`);
    };

    const deleteRoutesFromTrip = (tripId) => {
        RoutesService.getRoutesForSingleTrip(tripId).then((routes) => {
            // console.log(routes);
            routes.forEach((route) => {
                deleteRoutes(route.id);
            });
        }).catch((err) => {
            console.log("err in getRoutes:", err);
        });
    };

    const deleteRoutes = (routeId) => {
        RoutesService.deleteRoutes(routeId).then(() => {
        }).catch((err) => {
            console.log("error in deleteRoute:", err);
        });
    };

    $scope.deleteTrip = (tripId) => {
        deleteRoutesFromTrip(tripId);
        TripsService.deleteTrip(tripId).then((results) => {
            getTrips();
        }).catch((err) => {
            console.log("err in deleteTrip:", err);
        });
    };

});