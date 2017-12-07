'use strict';

app.controller('TripsViewCtrl', function ($location, $rootScope, $scope, TripsService) {

    $scope.routeToCreateTrip = () => {
        $location.path("/trip/create");
    };    

});