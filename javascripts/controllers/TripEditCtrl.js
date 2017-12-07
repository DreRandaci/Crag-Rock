'use strict';

app.controller('TripEditCtrl', function ($log, $routeParams, $scope, AuthService, RoutesService, TripsService) {

    $scope.trip = {};

    const getSingleTrip = (tripId) => {
        TripsService.getSingleTrip(tripId).then((trip) => {
            $scope.trip = trip.data;
            $scope.addressSearch = trip.data.googleMapsAddress;
            RoutesService.getRoutes(AuthService.getCurrentUid()).then((savedRoutes) => {
                savedRoutes.forEach((route) => {
                    if (route.trip_id === tripId) {
                        $scope.routesToSave.push(route);
                    }
                });
                console.log($scope.routesToSave);
            }).catch((err) => {
                console.log('err in getRoutes:', err);
            });
        }).catch((err) => {
            console.log('err in getSingleTrip:', err);
        });
    };
    getSingleTrip($routeParams.id);

    $scope.routesToSave = [];

    $scope.removeRouteFromSaveList = (index) => {
        $scope.routesToSave.splice(index, 1);
    };

    //save each climbing route
    $scope.saveToRouteList = (route, tripId) => {
        $scope.routesToSave.push(route);
    };

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

});