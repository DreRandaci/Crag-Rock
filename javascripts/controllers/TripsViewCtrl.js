'use strict';

app.controller('TripsViewCtrl', function ($location, $scope, AuthService, RoutesService, TripsService) {

    $scope.routeToCreateTrip = () => {
        $location.path("/trip/create");
    };

    const getTrips = () => {
        TripsService.getTrips(AuthService.getCurrentUid()).then((trips) => {
            $scope.trips = trips;
            RoutesService.getRoutes(AuthService.getCurrentUid()).then((routes) => {
                $scope.routes = routes;
            }).catch((err) => {
                console.log('err in getTrips:', err);
            });
        }).catch((err) => {
            console.log('err in getRoutes:', err);
        });
    };
    getTrips();

    $scope.editTrip = (tripId) => {
        console.log(tripId);
        $location.path(`/trip/detail/${tripId}`);
    };

});