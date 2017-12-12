'use strict';

app.controller('TripsViewCtrl', function ($location, $scope, AuthService, RoutesService, TripsService, PlacesService) {

    $scope.routeToCreateTrip = () => {
        $location.path("/trip/create");
    };

    $scope.addPlaces = (tripId) => {
        $location.path(`/trip/add-places/${tripId}`);
    };

    const getTrips = () => {
        $scope.places = [];
        TripsService.getTrips(AuthService.getCurrentUid()).then((trips) => {
            $scope.trips = trips;
            RoutesService.getRoutes(AuthService.getCurrentUid()).then((routes) => {
                $scope.routes = routes;
                trips.forEach((trip) => {
                    PlacesService.getPlaces(trip.id).then((results) => {
                        $scope.places.push(results);
                    }).catch((err) => {
                        console.log("error in getPlaces:", err);
                    });
                });                
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