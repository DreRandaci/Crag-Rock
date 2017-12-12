'use strict';

app.controller('TripPlacesCtrl', function ($routeParams, $scope, GOOGLEPLACES_CONFIG, TripsService, PlacesService) {

    $scope.googlePlacesUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLEPLACES_CONFIG}&libraries=places`;

    $scope.map = {
        center: {
            //default nashville coords
            latitude: 36.174465, longitude: -86.767960
        },
        zoom: 6,
        options: { scrollwheel: false }
    };

    // initial marker instance on page load
    $scope.markers = [{
        id: 0,
        latitude: 36.174465, longitude: -86.767960
    }];

    $scope.trip = {};

    const getSingleTrip = (routeParams) => {
        TripsService.getSingleTrip(routeParams).then((trip) => {            
            trip = trip.data;
            let type = 'lodging';
            PlacesService.getGooglePlaces(trip.lat,trip.lng, type).then((results) => {
                console.log(results.data);
                results.data.results.forEach((place) => {
                    console.log("place:", place);
                });                
            }).catch((err) => {

            });
        }).catch((err) => {
            console.log('err in getSingleTrip:', err);
        });
    };
    getSingleTrip($routeParams.id);

});