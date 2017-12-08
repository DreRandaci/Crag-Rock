'use strict';

app.controller('TripCreateCtrl', function ($location, $log, $scope, $window, GOOGLEMAPS_CONFIG, MapsService, MountainProjService, RoutesService, TripsService) {

    //inject google maps script
    $scope.googleUrl = `http://maps.google.com/maps/api/js?key=${GOOGLEMAPS_CONFIG}`;

    $scope.removeHeading = () => {return false;};

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

    //geolocation to update marker on map
    $window.navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        //get climbing routes near you for dropdown menu
        MountainProjService.getClimbingRoutesByLatLng(lat, lng).then((climbs) => {
            let nearestAreaLat = climbs.data.routes[0].latitude;
            let nearestAreaLng = climbs.data.routes[0].longitude;
            getClimbingRoutes(position.coords.latitude, position.coords.longitude);

            //update map instance with geolcation
            $scope.map.center.latitude = lat;
            $scope.map.center.longitude = lng;
            $scope.map.zoom = 10;
            $scope.marker.id = 0;
            $scope.marker.coords = { latitude: nearestAreaLat, longitude: nearestAreaLng };
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
        });
    });

    //grab search query and update map marker
    $scope.geocode = (address) => {
        $scope.routesToSave = [];
        MapsService.getMapByAddressQuery(address).then((results) => {
            let lat = results.data.results[0].geometry.location.lat;
            let lng = results.data.results[0].geometry.location.lng;

            $scope.removeHeading = () => {return true;};

            let climbingHeading = results.data.results[0].formatted_address.split(',', 1).join();
            $scope.climbingAreaHeading = climbingHeading;
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
        $scope.count = 0;
        MountainProjService.getClimbingRoutesByLatLng(lat, lng).then((climbs) => {
            $scope.count++;
            let climbingHeading = climbs.data.routes[0].location[1] + ', ' + climbs.data.routes[0].location[0];
            $scope.routes = climbs.data.routes;
            $scope.climbingAreaHeadingPageLoad = climbingHeading;
        }).catch((err) => {
            console.log('error in getClimbingRoutesByLatLng:', err);
        });
    };

    /////DATEPICKER
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    function getDayClass(data) {
        let date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            let dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                let currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }


    //////DROPDOWN MENU
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

////////////////////


    $scope.savedRoutes = [];

    $scope.removeRouteFromSavedRoutes = (index, route) => {
        $scope.savedRoutes.splice(index, 1);
    };

    //save each climbing route
    $scope.saveToRouteList = (route) => {
        $scope.savedRoutes.push(route);
    };

    $scope.createTrip = (trip, routes, dt) => {
        let heading = angular.element(document.querySelector('.areaHeading'));
        let address = heading[0].innerHTML;
        MapsService.getMapByAddressQuery(address).then((results) => {
            if (results.data.results.length === 0) {
                address = 'nashville, tn';
                MapsService.getMapByAddressQuery(address).then((results) => {
                    let lat = results.data.results[0].geometry.location.lat;
                    let lng = results.data.results[0].geometry.location.lng;
                    let newTrip = TripsService.createTripObj(trip, address, lat, lng, dt);
                    saveTrip(newTrip);
                });
            }
            let lat = results.data.results[0].geometry.location.lat;
            let lng = results.data.results[0].geometry.location.lng;
            let newTrip = TripsService.createTripObj(trip, address, lat, lng);
            saveTrip(newTrip);
        });
    };

    const saveTrip = (newTrip) => {
        TripsService.saveTripToFirebase(newTrip).then((tripId) => {
            saveRoutes($scope.savedRoutes, tripId.data.name);
            $location.path("/trips");
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
