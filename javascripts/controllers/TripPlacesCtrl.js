'use strict';

app.controller('TripPlacesCtrl', function ($routeParams, $scope, GOOGLEPLACES_CONFIG, TripsService, PlacesService) {

    $scope.googlePlacesUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLEPLACES_CONFIG}&libraries=places`;

    $scope.showPlaceHeading = false;
    $scope.showSaveHeading = false;

    $scope.map = {
        center: {
            //default nashville coords
            latitude: 36.174465, longitude: -86.767960
        },
        zoom: 7,
        options: { scrollwheel: false }
    };

    // initial marker instance on page load
    $scope.markers = [{
        id: 0,
    }];

    $scope.trip = {};

    const getSingleTripLocation = (routeParams) => {
        TripsService.getSingleTrip(routeParams).then((trip) => {
            trip = trip.data;
            $scope.trip = trip;
            $scope.markers.push({ id: 'trip', latitude: trip.lat, longitude: trip.lng });
        }).catch((err) => {
            console.log('err in getSingleTrip:', err);
        });
    };
    getSingleTripLocation($routeParams.id);

    $scope.plotLodging = (lodging) => {
        let blueIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        // let yellowIcon = "https://cdn.cyberduck.io/img/cyberduck-icon-384.png";
        plotPlaceMarkers(lodging, blueIcon);
    };

    $scope.plotRestaurants = (restaurant) => {
        let blueIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        plotPlaceMarkers(restaurant, blueIcon);
    };

    $scope.plotCampsites = (campground) => {
        let blueIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        plotPlaceMarkers(campground, blueIcon);
    };

    const plotPlaceMarkers = (type, icon) => {
        let lat = $scope.trip.lat;
        let lng = $scope.trip.lng;
        PlacesService.getGooglePlaces(type, lat, lng).then((results) => {
            let coords = results.data.results.map((place, i) => {
                let places = {};
                places.google_place_id = place.place_id;
                places.trip_id = $routeParams.id;
                places.type = type;
                places.name = place.name;
                places.latitude = place.geometry.location.lat;
                places.longitude = place.geometry.location.lng;
                places.id = i;
                places.icon = icon;
                places.vicinity = place.vicinity;
                if (place.photos !== undefined) {
                    places.img = place.photos[0].html_attributions[0];
                    places.photo_reference = place.photos[0].photo_reference;
                }
                return places;
            });
            $scope.map.center = { latitude: lat, longitude: lng };
            $scope.map.zoom = 11;
            $scope.markers = coords;
            $scope.markers.push({ id: 'trip', latitude: lat, longitude: lng });
        }).catch((err) => {
            console.log('error in getGooglePlaces, TripPlacesCtrl:', err);
        });
    };

    $scope.markersEvents = {
        click: function (marker, eventName, model) {
            $scope.showPlaceHeading = true;
            $scope.placeHeading = model.name;
            $scope.grabMarker = model;
        }
    };

    $scope.places = [];

    $scope.addPlace = (place) => {
        $scope.showSaveHeading = true;
        $scope.places.push(place);
        // PlacesService.savePlace(place).then((results) => {
        // }).catch((err) => {
        //     console.log("err in savePlace, TripPlacesCtrl", err);
        // });
    };

});