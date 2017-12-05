'use strict';

app.controller('TripCtrl', function ($http, $q, $log, $scope, MapsService, MountainProjService) {

    //initial map instance on page load
    $scope.map = {
        center: {
            //Nashville coords
            latitude: 36.1626638, longitude: -86.7816016
        },
        zoom: 8,
        options: {
            scrollwheel: true
        }
    };

    // initial marker instance on page load
    $scope.marker = {
        id: 0,
        coords: {
            //Nashville coords
            latitude: 36.1626638, longitude: -86.7816016
        },
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
        MapsService.getMapByAddressQuery(address).then((results) => {
            
            let lat = results.data.results[0].geometry.location.lat;
            let lng = results.data.results[0].geometry.location.lng;

            getClimbingRoutes(lat, lng);

            $scope.map = {
                center: {
                    latitude: lat,
                    longitude: lng
                },
                zoom: 11,
                options: {
                    scrollwheel: true
                }
            };

            $scope.marker = {
                id: 0,
                coords: {
                    latitude: lat,
                    longitude: lng
                },
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
        MountainProjService.getClimbingRoutesByLatLng(lat, lng).then((climbs) => {
            let climbingRoutes = climbs.data.routes;
            climbingRoutes.forEach((route) => {
                $scope.routes.push(route);
            });
        }).catch((err) => {
            console.log('error in getClimbingRoutesByLatLng:', err);
        });
    };

    $scope.routes = [];

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

    $scope.saveRoute = (route) => {
        //save each climb
    };

});
