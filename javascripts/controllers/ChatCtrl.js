'use strict';

app.controller("ChatCtrl", function ($location, $scope, AuthService, RoutesService, TripsService) {

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
    
    $scope.routeToChatWindow = (tripId) => {
        $location.path(`/chat/window/${tripId}`);
    };

});