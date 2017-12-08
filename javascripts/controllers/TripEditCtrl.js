'use strict';

app.controller('TripEditCtrl', function ($location, $log, $routeParams, $scope, AuthService, MapsService, MountainProjService, RoutesService, TripsService) {

    //changes h1 txt from "create" to "edit" depending on partial
    $scope.changePageHeading = true;

    // initial map instance on page load
    $scope.map = {
        center: {
            //default nashville coords
            latitude: 34.1626638, longitude: -82.7816016
        },
        zoom: 4,
        options: { scrollwheel: true }
    };

    // initial marker instance on page load
    $scope.marker = {
        id: 0,
        options: { draggable: true },
        events: {
            dragend: function (marker, eventName, args) {
                $log.log('marker drag-end');
                let lat = marker.getPosition().lat();
                let lon = marker.getPosition().lng();
                $log.log(lat);
                $log.log(lon);

                $scope.marker.options = {
                    draggable: true,
                    labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        }
    };

    $scope.trip = {};

    const getSingleTrip = (routeParams) => {
        TripsService.getSingleTrip(routeParams).then((trip) => {
            $scope.trip = trip.data;               
            
            //FOR DATEPICKER
            $scope.tripDate = function () {  
                let date = $scope.trip.date.toString();                      
                $scope.dt = new Date (date);
            };
            $scope.tripDate();                 
            
            updateRoutesList(trip.data.googleMapsAddress);
            getRoutes(AuthService.getCurrentUid(), routeParams);
        }).catch((err) => {
            console.log('err in getSingleTrip:', err);
        });
    };
    getSingleTrip($routeParams.id);

    const getRoutes = (uid, tripId) => {
        RoutesService.getRoutes(AuthService.getCurrentUid()).then((savedRoutes) => {
            savedRoutes.forEach((route) => {
                if (route.trip_id === tripId) {
                    $scope.savedRoutes.push(route);
                }
            });
        }).catch((err) => {
            console.log('err in getRoutes:', err);
        });
    };

    const updateRoutesList = (address) => {
        MapsService.getMapByAddressQuery(address).then((results) => {
            let lat = results.data.results[0].geometry.location.lat;
            let lng = results.data.results[0].geometry.location.lng;

            let climbingHeadings = results.data.results[0].formatted_address.split(',', 1).join();
            $scope.climbingAreaHeading = climbingHeadings;
            getClimbingRoutes(lat, lng);

            $scope.map = {
                center: { latitude: lat, longitude: lng },
                zoom: 11,
                options: { scrollwheel: true }
            };

            $scope.marker = {
                id: 0,
                coords: { latitude: lat, longitude: lng },
                options: { draggable: true },
                events: {
                    dragend: function (marker, eventName, args) {
                        $log.log('marker drag-end');
                        let lat = marker.getPosition().lat();
                        let lon = marker.getPosition().lng();
                        $log.log(lat);
                        $log.log(lon);

                        $scope.marker.options = {
                            draggable: true,
                            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                            labelAnchor: "100 0",
                            labelClass: "marker-labels"
                        };
                    }
                }
            };
        }).catch((err) => {
            console.log("error in getMapByAddressQuery:", err);
        });
    };

    const getClimbingRoutes = (lat, lng, distance, minDiff, maxDiff) => {
        $scope.routes = [];
        MountainProjService.getClimbingRoutesByLatLng(lat, lng).then((climbs) => {
            let areaName = climbs.data.routes[0].location[1] + ', ' + climbs.data.routes[0].location[0];
            $scope.routes = climbs.data.routes;            
        }).catch((err) => {
            console.log('error in getClimbingRoutesByLatLng:', err);
        });
    };

    $scope.savedRoutes = [];

    $scope.removeRouteFromSaveList = (index, route) => {        
        $scope.savedRoutes.splice(index, 1);
        RoutesService.deleteSingleRouteFromFirebase(route.id).then(() => {
        }).catch((err) => {
            console.log('error in deleteSingleRouteFromFirebase:', err);
        });
    };

    //save each climbing route
    $scope.saveToRouteList = (route, tripId) => {
        $scope.savedRoutes.push(route);
    };

    $scope.createTrip = (trip, savedRoutes, dt) => {
        trip.date = dt.toString();          
        postUpdatedTrip(trip);
    };


    const postUpdatedTrip = (updatedTrip) => {
        TripsService.updateTripInFirebase(updatedTrip, $routeParams.id).then((tripId) => {
            saveUpdatedRoutes($scope.savedRoutes, tripId.data.name);
            $location.path("/trips");
        }).catch((err) => {
            console.log('error in updateTripInFirebase:', err);
        });
    };

    const saveUpdatedRoutes = (routes, tripId) => {
        routes.forEach((route) => {
            let newRoute = RoutesService.createRouteObj(route, tripId);
            RoutesService.saveTripRoutesToFirebase(newRoute).then(() => {
            }).catch((err) => {
                console.log('error in saveTripRoutesToFirebase:', err);
            });
        });
    };

});