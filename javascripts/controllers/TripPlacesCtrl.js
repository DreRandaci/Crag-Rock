'use strict';

app.controller('TripPlacesCtrl', function ($location, $routeParams, $scope, GOOGLEPLACES_CONFIG, TripsService, PlacesService) {

    $scope.googlePlacesUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLEPLACES_CONFIG}&libraries=places`;

    $scope.showPlaceHeading = false;
    $scope.showSaveHeading = false;

    $scope.map = {
        center: {
            //default nashville coords
            latitude: 36.174465, longitude: -86.767960
        },
        zoom: 10,
        options: { scrollwheel: true }
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
            $scope.map = {
                center: { latitude: trip.lat, longitude: trip.lng },
                zoom: 10,
                options: { scrollwheel: true }
            };
            getSavedPlaces(routeParams);
            getAndFormatPlaces("lodging", trip.lat, trip.lng, "http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
        }).catch((err) => {
            console.log('err in getSingleTrip:', err);
        });
    };
    getSingleTripLocation($routeParams.id);

    const getSavedPlaces = (routeParams) => {
        PlacesService.getPlacesForSingleTrip(routeParams).then((results) => {
            $scope.savedPlaces = results;
        });
    };

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
        getAndFormatPlaces(type, lat, lng, icon);
    };

    const getAndFormatPlaces = (type, lat, lng, icon) => {
        PlacesService.getGooglePlaces(type, lat, lng).then((results) => {
            $scope.places = createPlacesObjectsArray(results, icon, type);
            $scope.markers = createPlacesObjectsArray(results, icon, type);
            $scope.map.center = { latitude: lat, longitude: lng };
            $scope.map.zoom = 11;

            // ADDS 'DISABLED' PROPERTY TO PREVIOUSLY SAVED PLACES
            $scope.places.forEach((place) => {
                $scope.savedPlaces.forEach((savedPlace) => {
                    if (place.name == savedPlace.name) {
                        place.disabled = true;
                    }
                });
            });

            //TO ALSO SHOW TRIP MARKER 
            $scope.markers.push({ id: 'trip', latitude: lat, longitude: lng });
        }).catch((err) => {
            console.log('error in getGooglePlaces, TripPlacesCtrl:', err);
        });
    };

    const createPlacesObjectsArray = (results, icon, type) => {
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
        return coords;
    };

    $scope.markersEvents = {
        click: function (marker, eventName, model) {
            $scope.showPlaceHeading = true;
            $scope.placeHeading = model.name;
            $scope.grabMarker = model;
        }
    };

    $scope.saveToPlaceList = (index, place) => {
        $scope.showSaveHeading = true;
        if (!place.disabled) {
            place.disabled = true;
            $scope.savedPlaces.push(place);
        }
    };

    $scope.savePlaces = () => {
        $scope.places.forEach((place) => {
            let newPlace = PlacesService.createPlaceObj(place);
            PlacesService.savePlace(newPlace).then(() => {
            }).catch((err) => {
                console.log("err in savePlace, TripPlacesCtrl", err);
            });
        });
        $location.path("/trips");
    };

    $scope.removePlaceFromSavedPlacesList = (index, place) => {
        $scope.savedPlaces.forEach((listPlace) => {
            if (listPlace.id === place.id) {
                listPlace.disabled = false;
            }
        });
        $scope.savedPlaces.splice(index, 1);
    };

});