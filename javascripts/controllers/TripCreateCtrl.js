'use strict';

app.controller('TripCreateCtrl', function ($location, $scope, $window, GOOGLEMAPS_CONFIG, MapsService, MountainProjService, RoutesService, TripsService) {

    //inject google maps script
    $scope.googleUrl = `http://maps.google.com/maps/api/js?key=${GOOGLEMAPS_CONFIG}`;

    $window.navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        $scope.map = {
            center: {
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

            let lat = model.latitude;
            let lng = model.longitude;

            $scope.map.zoom = 14;
            $scope.map.center = { latitude: lat, longitude: lng };
            model.show = !model.show;
            MapsService.getMapByLatLngQuery(lat, lng).then((results) => {
                $scope.address = results.data.results[0].formatted_address;
            });
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

    const getClimbingRoutes = (lat, lng) => {
        $scope.routes = [];
        MountainProjService.getClimbingRoutesByLatLng(lat, lng).then((climbs) => {
            let routes = climbs.data.routes.map((route) => {
                route.state = route.location[0];
                route.crag = route.location[1];
                return route;
            });
            $scope.routes = routes;
        }).catch((err) => {
            console.log('error in getClimbingRoutesByLatLng:', err);
        });
    };

    ////////////////////////////////////////DATEPICKER
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

    //////////////////////////////////////////////////

    $scope.savedRoutes = [];

    $scope.removeRouteFromSavedRoutes = (index, route) => {
        $scope.savedRoutes.splice(index, 1);
    };

    //save each climbing route
    $scope.saveToRouteList = (route) => {
        $scope.savedRoutes.push(route);
    };

    $scope.createTrip = (trip, routes, dt) => {
        let date = dt.toString();
        let crag = routes[0].crag;
        let state = routes[0].state;
        let lat = $scope.map.center.latitude;
        let lng = $scope.map.center.longitude;
        let location = $scope.address;

        let newTrip = TripsService.createTripObj(trip, location, lat, lng, date, crag, state);
        saveTrip(newTrip);
    };


    const saveTrip = (newTrip) => {
        TripsService.saveTripToFirebase(newTrip).then((results) => {
            let tripId = results.data.name;
            saveRoutes($scope.savedRoutes, tripId);
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
