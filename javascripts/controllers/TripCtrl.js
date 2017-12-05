'use strict';

app.controller('TripCtrl', function ( $scope, uiGmapGoogleMapApi ) {
    
    uiGmapGoogleMapApi.then((stuff) => {
        console.log(stuff);
        $scope.map = { 
            center: { 
                latitude: 45, 
                longitude: -73 
            }, 
            zoom: 8 
        };
    });

});