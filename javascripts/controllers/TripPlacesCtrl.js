'use strict';

app.controller('TripPlacesCtrl', function ($location, $rootScope, $routeParams, $scope, GOOGLEPLACES_CONFIG, TripsService, PlacesService) {

    $scope.googlePlacesUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLEPLACES_CONFIG}&libraries=places`;

    $scope.showPlaceHeading = false;
    $scope.showSaveHeading = false;

    $scope.map = {
        center: {
            //default nashville coords
            latitude: 36.174465, longitude: -86.767960
        },
        zoom: 10,
        styles: $rootScope.mapStyles,
        options: $scope.mapOptions,
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
                options: { scrollwheel: true },
                window: {
                    marker: {},
                    show: false,
                    closeClick: function () {
                        this.show = false;
                    },
                    options: {}
                }
            };
            getUserSavedPlaces(routeParams);
            getAndFormatPlaces("lodging", trip.lat, trip.lng, "https://maps.google.com/mapfiles/ms/icons/blue-dot.png");
        }).catch((err) => {
            console.log('err in getSingleTrip:', err);
        });
    };
    getSingleTripLocation($routeParams.id);

    const getUserSavedPlaces = (routeParams) => {
        PlacesService.getPlacesForSingleTrip(routeParams).then((results) => {
            $scope.savedPlaces = results;
        });
    };

    $scope.plotLodging = (lodging) => {
        let blueIcon = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        plotPlaceMarkers(lodging, blueIcon);
    };

    $scope.plotRestaurants = (restaurant) => {
        let orangeIcon = 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
        plotPlaceMarkers(restaurant, orangeIcon);
    };

    $scope.plotCampsites = (campground) => {
        let greenIcon = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
        plotPlaceMarkers(campground, greenIcon);
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
            $rootScope.infoWindowContent = { name: model.name, type: model.type };
            $rootScope.addPlaceToList = () => {
                let newPlace = PlacesService.createPlaceObj(model);
                PlacesService.savePlace(newPlace).then((results) => {
                    $scope.places.forEach((place) => {
                        if (place.name == model.name) {
                            place.disabled = true;
                        }
                    });
                    model.id = results.data.name;
                    model.disabled = true;
                    $scope.savedPlaces.push(model);
                });
            };
            $scope.showPlaceHeading = true;
            $scope.placeHeading = model.name;
            $scope.grabMarker = model;
            $scope.map.window.model = model;
            $scope.map.window.show = true;
        }
    };


    $scope.saveToPlaceList = (index, place) => {
        $scope.showSaveHeading = true;
        if (!place.disabled) {
            place.disabled = true;
            let newPlace = PlacesService.createPlaceObj(place);
            PlacesService.savePlace(newPlace).then((res) => {
                place.id = res.data.name;
                $scope.savedPlaces.push(place);
            });
        }
    };

    $scope.routeToTrips = () => {
        $location.path("/trips");
    };

    $scope.removePlaceFromSavedPlacesList = (index, place) => {
        $scope.places.forEach((listPlace) => {
            if (listPlace.name === place.name) {
                listPlace.disabled = false;
            }
        });
        PlacesService.deletePlace(place.id).then((results) => {
            $scope.savedPlaces.splice(index, 1);
        }).catch((err) => {
            console.log("err in deletePlace, TripsViewCtrl:", err);
        });
    };

});