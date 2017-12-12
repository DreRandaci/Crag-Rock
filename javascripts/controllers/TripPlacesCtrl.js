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
    }];

    $scope.trip = {};

    const getSingleTrip = (routeParams) => {
        TripsService.getSingleTrip(routeParams).then((trip) => {
            trip = trip.data;
            let type = 'lodging';
            PlacesService.getGooglePlaces(trip.lat, trip.lng, type).then((results) => {
                let coords = results.data.results.map((place, i) => {
                    let places = {};
                    places.google_place_id = place.place_id;
                    places.trip_id = $routeParams.id;
                    places.type = 'lodging';
                    places.name = place.name;
                    places.latitude = place.geometry.location.lat;
                    places.longitude = place.geometry.location.lng;
                    places.id = i;
                    places.icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
                    return places;
                });                
                $scope.map.center = { latitude: trip.lat, longitude: trip.lng };
                $scope.map.zoom = 10;
                $scope.markers = coords;
                $scope.markers.push({id:'trip', latitude:trip.lat, longitude:trip.lng});
            }).catch((err) => {

            });
        }).catch((err) => {
            console.log('err in getSingleTrip:', err);
        });
    };
    getSingleTrip($routeParams.id);

});