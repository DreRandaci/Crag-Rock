'use strict';

app.controller('TripEditCtrl', function ($location, $log, $routeParams, $scope, AuthService, MapsService, MountainProjService, RoutesService, TripsService) {

    // initial map instance on page load
    $scope.map = {
        center: {
            //default nashville coords
            latitude: 36.174465, longitude: -86.767960
        },
        zoom: 4,
        options: { scrollwheel: true }
    };

    // initial marker instance on page load
    $scope.marker = {
        id: 0,
    };

    $scope.trip = {};

    const getSingleTrip = (routeParams) => {
        TripsService.getSingleTrip(routeParams).then((trip) => {
            $scope.trip = trip.data;

            //FOR DATEPICKER
            $scope.tripDate = function () {
                let date = $scope.trip.date.toString();
                $scope.dt = new Date(date);
            };
            $scope.tripDate();

            updateRoutesList(trip.data);
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

    const updateRoutesList = (trip) => {
        let lat = trip.lat;
        let lng = trip.lng;

        let climbingHeadings = trip.name;
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
        };
    };

    const getClimbingRoutes = (lat, lng) => {
        $scope.routes = [];
        MountainProjService.getClimbingRoutesByLatLng(lat, lng).then((climbs) => {
            let areaName = climbs.data.routes[0].location[1] + ', ' + climbs.data.routes[0].location[0];
            $scope.routes = climbs.data.routes;
        }).catch((err) => {
            console.log('error in getClimbingRoutesByLatLng:', err);
        });
    };

    $scope.savedRoutes = [];

    $scope.removeRouteFromSavedRoutes = (index, route) => {
        $scope.savedRoutes.splice(index, 1);
        RoutesService.deleteRoutes(route.id).then(() => {
        }).catch((err) => {
            console.log('error in deleteSingleRouteFromFirebase:', err);
        });
    };

    //save each climbing route
    $scope.saveToRouteList = (route) => {
        saveUpdatedRoutes(route, $routeParams.id);
    };

    $scope.createTrip = (trip, savedRoutes, dt) => {
        trip.date = dt.toString();
        postUpdatedTrip(trip);
    };


    const postUpdatedTrip = (updatedTrip) => {
        TripsService.updateTripInFirebase(updatedTrip, $routeParams.id).then((tripId) => {
            $location.path("/trips");
        }).catch((err) => {
            console.log('error in updateTripInFirebase:', err);
        });
    };

    const saveUpdatedRoutes = (route, tripId) => {
        let newRoute = RoutesService.createRouteObj(route, tripId);
        RoutesService.saveTripRoutesToFirebase(newRoute).then((results) => {
            newRoute.id = results.data.name;
            $scope.savedRoutes.push(newRoute);
        }).catch((err) => {
            console.log('error in saveTripRoutesToFirebase:', err);
        });
    };

    //DATEPICKER
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
    /////////////

});