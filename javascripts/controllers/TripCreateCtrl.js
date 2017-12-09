'use strict';

app.controller('TripCreateCtrl', function ($location, $scope, $window, GOOGLEMAPS_CONFIG, MapsService, MountainProjService, RoutesService, TripsService) {

    //inject google maps script
    $scope.googleUrl = `http://maps.google.com/maps/api/js?key=${GOOGLEMAPS_CONFIG}`;

    $scope.removeHeading = () => { return false; };

    $window.navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        $scope.map = {
            center: {
                //default nashville coords
                latitude: lat, longitude: lng
            },
            zoom: 6,
            options: { scrollwheel: false }
        };
        MountainProjService.getClimbingAreas100(lat, lng).then((results) => {
            let coords = results.data.routes.map((route, i) => {
                let locations = {};
                locations.latitude = route.latitude;
                locations.longitude = route.longitude;
                locations.id = i;
                return locations;
            });
            $scope.markers = coords;
        });
    });


    $scope.markersEvents = {
        click: function (marker, eventName, model) {
            console.log("marker", marker);
            console.log("model", model);

            let lat = model.latitude;
            let lng = model.longitude;
            
            $scope.map.zoom = 14;
            $scope.map.center = {latitude: lat, longitude: lng};
            model.show = !model.show;
            
            getClimbingRoutes(lat, lng);
        }
    };

    //initial map instance on page load
    $scope.map = {
        center: {
            //default nashville coords
            latitude: 34.1626638, longitude: -82.7816016
        },
        zoom: 4,
        options: { scrollwheel: false }
    };

    // initial marker instance on page load
    $scope.markers = [{
        id: 0,
        latitude: 34.1626638, longitude: -82.7816016
    }];

    //geolocation to update marker on map
    // $window.navigator.geolocation.getCurrentPosition(function (position) {
    //     let lat = position.coords.latitude;
    //     let lng = position.coords.longitude;

    //     //get climbing routes near you for dropdown menu
    //     MountainProjService.getClimbingRoutesByLatLng(lat, lng).then((climbs) => {
    //         $scope.nearestAreaLat = climbs.data.routes[0].latitude;
    //         $scope.nearestAreaLng = climbs.data.routes[0].longitude;
    //         getClimbingRoutes(position.coords.latitude, position.coords.longitude);

    //         //update map instance with geolcation
    //         $scope.map.center.latitude = lat;
    //         $scope.map.center.longitude = lng;
    //         $scope.map.zoom = 10;
    //         $scope.marker.id = 0;
    //         $scope.marker.coords = { latitude: $scope.nearestAreaLat, longitude: $scope.nearestAreaLng };
    //     });
    // });

    //grab search query and update map marker
    $scope.geocode = (address) => {
        $scope.routesToSave = [];
        MapsService.getMapByAddressQuery(address).then((results) => {
            let lat = results.data.results[0].geometry.location.lat;
            let lng = results.data.results[0].geometry.location.lng;

            $scope.removeHeading = () => { return true; };

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
            };
        }).catch((err) => {
            console.log("error in getMapByAddressQuery:", err);
        });
    };

    const getClimbingRoutes = (lat, lng) => {
        $scope.routes = [];
        // $scope.count = 0;
        MountainProjService.getClimbingRoutesByLatLng(lat, lng).then((climbs) => {
            // $scope.count++;
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
        let heading;
        let date = dt.toString();
        if (!$scope.removeHeading()) {
            heading = angular.element(document.querySelector('.areaHeading1'));
        } else {
            heading = angular.element(document.querySelector('.areaHeading2'));
        }
        let address = heading[0].innerHTML;

        MapsService.getMapByAddressQuery(address).then((results) => {

            //if the address passed in above returns no results
            if (results.data.results.length === 0) {
                let lat = $scope.nearestAreaLat;
                let lng = $scope.nearestAreaLng;

                let newTrip = TripsService.createTripObj(trip, address, lat, lng, date);
                saveTrip(newTrip);
            } else {
                let lat = results.data.results[0].geometry.location.lat;
                let lng = results.data.results[0].geometry.location.lng;
                let newTrip = TripsService.createTripObj(trip, address, lat, lng, date);
                saveTrip(newTrip);
            }
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
