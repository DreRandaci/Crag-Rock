'use strict';

app.controller("ChatCtrl", function( $scope, GOOGLEMAPS_CONFIG ) {
    
    $scope.googleUrl = `http://maps.google.com/maps/api/js?key=${GOOGLEMAPS_CONFIG}`;
});