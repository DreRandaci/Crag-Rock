'use strict';

app.controller('TripsViewCtrl', function ($location, $rootScope, $scope, TripsService, RoutesService) {

    $scope.routeToCreateTrip = () => {
        $location.path("/trip/create");
    };

    const getTrips = () => {
        TripsService.getTrips($rootScope.uid).then((trips) => {
            $scope.trips = trips;
            RoutesService.getRoutes($rootScope.uid).then((routes) => {
                $scope.routes = routes;
            }).catch((err) => {
                console.log('err in getTrips:', err);
            });
        }).catch((err) => {
            console.log('err in getRoutes:', err);
        });
    };
    getTrips();


});