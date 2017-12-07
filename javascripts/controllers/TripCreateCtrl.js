'use strict';

app.controller('TripCreateCtrl', function ($log, $scope, $window, GOOGLEMAPS_CONFIG, MapsService, MountainProjService, RoutesService, TripsService) {
    //inject google maps script
    $scope.googleUrl = `http://maps.google.com/maps/api/js?key=${GOOGLEMAPS_CONFIG}`;

    $window.navigator.geolocation.getCurrentPosition(function (position) {
        //get climbing routes near you for dropdown menu
        getClimbingRoutes(position.coords.latitude, position.coords.longitude);

        //update map instance with geolcation
        $scope.map.center.latitude = position.coords.latitude;
        $scope.map.center.longitude = position.coords.longitude;
        $scope.map.zoom = 8;
        $scope.marker.id = 0;
        $scope.marker.coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        $scope.marker.options = { draggable: true };
        $scope.marker.events = {
            dragend: function (marker, eventName, args) {
                $log.log('marker drag-end');
                let lat = marker.getPosition().lat();
                let lng = marker.getPosition().lng();
                $log.log(lat);
                $log.log(lng);

                $scope.marker.options = {
                    draggable: true,
                    labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        };
        $scope.$apply();
    });

    //initial map instance on page load
    $scope.map = {
        center: {
            //default nashville coords
            latitude: 34.1626638, longitude: -82.7816016
        },
        zoom: 4,
        bounds: {
            northeast: {
                latitude: 45.1451,
                longitude: -80.6680
            },
            southwest: {
                latitude: 30.000,
                longitude: -120.6680
            }
        },
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

    //grab search query and update map marker
    $scope.geocode = (address) => {
        $scope.routesToSave = [];
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

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function (open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));

    $scope.routesToSave = [];

    $scope.removeRouteFromSaveList = (index) => {
        $scope.routesToSave.splice(index, 1);
    };

    //save each climbing route
    $scope.saveToRouteList = (route, tripId) => {
        $scope.routesToSave.push(route);
    };

    $scope.createTrip = (trip) => {
        let heading = angular.element(document.querySelector('.areaHeading'));
        let address = heading[0].innerHTML;
        MapsService.getMapByAddressQuery(address).then((results) => {
            let lat = results.data.results[0].geometry.location.lat;
            let lng = results.data.results[0].geometry.location.lng;
            let newTrip = TripsService.createTripObj(trip, address, lat, lng);
            saveTrip(newTrip);
        });
    };

    const saveTrip = (newTrip) => {
        TripsService.saveTripToFirebase(newTrip).then((tripId) => {
            saveRoutes($scope.routesToSave, tripId.data.name);
            //then get trips
        }).catch((err) => {
            console.log('error in saveTripToFirebase:', err);
        });
    };

    const saveRoutes = (routes, tripId) => {
        routes.forEach((route) => {
            let newRoute = RoutesService.createRouteObj(route, tripId);
            RoutesService.saveTripRoutesToFirebase(newRoute).then(() => {
            }).catch((err) => {
                console.log('error in saveTripRoutesToFirebase:', err);
            });
        });
    };

});
