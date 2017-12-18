'use strict';

app.controller('TripsViewCtrl', function (moment, $location, $scope, $timeout, AuthService, RoutesService, TripsService, PlacesService) {

    $scope.toggle_container = false;

    $scope.showSave = false;

    $scope.routeToCreateTrip = () => {
        $location.path("/trip/create");
    };

    $scope.addPlaces = (tripId) => {
        $timeout(function () {
            $location.path(`/trip/add-places/${tripId}`);
        }, 500);
    };

    $scope.editTrip = (tripId) => {
        $timeout(function () {
            $location.path(`/trip/detail/${tripId}`);
        }, 500);
    };

    $scope.currentTrip = {};

    $scope.seeTrip = (trip) => {
        $scope.tripId = trip.id;
        $scope.currentTrip = trip;
    };

    const getTrips = () => {
        TripsService.getTrips(AuthService.getCurrentUid()).then((trips) => {
            let dateFormat = "dddd, MMMM Do YYYY";
            $scope.trips = trips.map((trip) => {
                let date = trip.date;
                trip.orderByDate = moment(date, dateFormat).unix();
                trip.date = moment(date, dateFormat).format(dateFormat);
                return trip;
            });
            getRoutes();
        }).catch((err) => {
            console.log('err in getRoutes:', err);
        });
    };
    getTrips();

    const getRoutes = () => {
        RoutesService.getRoutes(AuthService.getCurrentUid()).then((routes) => {
            $scope.routes = routes;
            getPlaces();
        });
    };

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

    const deletePlacesFromTrip = (tripId) => {
        PlacesService.getPlacesForSingleTrip(tripId).then((places) => {
            places.forEach((place) => {
                PlacesService.deletePlace(place.id).then(() => {
                }).catch((err) => {
                    console.log("error in deletePlacesFromTrip:", err);
                });
            });
        });
    };

    $scope.updateTripNote = (trip) => {        
        // FOR DATE PICKER
        trip.date = moment(trip.date, "ddd, MMM, DD, YYYY, hh:mm:ss").format("ddd MMM DD YYYY hh:mm:ss");
        let updatedTrip = TripsService.createTripObj(trip);
        TripsService.updateTripInFirebase(updatedTrip, trip.id).then(() => {            
        }).catch((err) => {
            console.log("error in updateTripNote:", err);
        });
    };

    $scope.deleteRoute = (index, routeId) => {
        $scope.routes.splice(index, 1);
        deleteRoutes(routeId);
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

    $scope.deletePlace = (index, placeId) => {
        PlacesService.deletePlace(placeId).then((results) => {
            $scope.places.splice(index, 1);
        }).catch((err) => {
            console.log("err in deletePlace, TripsViewCtrl:", err);
        });
    };

});