'use strict';

app.controller('TripsViewCtrl', function (moment, $location, $scope, AuthService, RoutesService, TripsService, PlacesService) {
    
    $scope.addPlaces = (tripId) => {
        $location.path(`/trip/add-places/${tripId}`);
    };

    $scope.editTrip = (tripId) => {
        $location.path(`/trip/detail/${tripId}`);
    };

    const getTrips = () => {
        TripsService.getTrips(AuthService.getCurrentUid()).then((trips) => {
            $scope.trips = trips.map((trip) => {
                let date = trip.date;
                trip.date = moment(date).format("dddd, MMMM Do YYYY");
                return trip;
            });
            RoutesService.getRoutes(AuthService.getCurrentUid()).then((routes) => {
                $scope.routes = routes;
                getPlaces();
            });
        }).catch((err) => {
            console.log('err in getRoutes:', err);
        });
    };
    getTrips();

    const getPlaces = () => {
        $scope.places = [];
        $scope.trips.forEach((trip) => {
            PlacesService.getPlaces(trip.id).then((results) => {
                results.forEach((place) => {
                    $scope.places.push(place);
                });
            });
        }).catch((err) => {
            console.log("error in getPlaces:", err);
        });
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
        deletePlacesFromTrip(tripId);
        TripsService.deleteTrip(tripId).then((results) => {
            getTrips();
        }).catch((err) => {
            console.log("err in deleteTrip:", err);
        });
    };

    const deletePlacesFromTrip = (tripId) => {
        PlacesService.getPlacesForSingleTrip(tripId).then((places) => {
            places.forEach((place) => {
                PlacesService.deletePlace(place.id).then(() => {
                }).catch((err) => {
                    console.log("error in deletePlace:", err);
                });
            });
        }).catch((err) => {
            console.log("error in getPlacesForSingelTrip:", err);
        });
    };

    $scope.deletePlace = (index, placeId) => {
        PlacesService.deletePlace(placeId).then((results) => {
            $scope.places.splice(index, 1);
        }).catch((err) => {
            console.log("err in deletePlace, TripsViewCtrl:", err);
        });
    };

});