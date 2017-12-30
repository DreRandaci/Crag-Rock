'use strict';

app.controller('TripCreateCtrl', function ($location, $scope, $timeout, $window, GOOGLEMAPS_CONFIG, moment, MapsService, MountainProjService, RoutesService, TripsService) {

    //inject google maps script
    $scope.googleUrl = `https://maps.google.com/maps/api/js?key=${GOOGLEMAPS_CONFIG}`;

    $scope.updateHeadingBeforeUserClicksMarker = true;
    $scope.filterOn = "name";

    //initial map instance on page load purely for the map to rendar 
    $scope.map = {
        center: {
            //default nashville coords
            latitude: 36.174465, longitude: -86.767960
        },
        zoom: 4,
        options: { scrollwheel: true },
        events: {
            click: function (a, click, b) {
                //this is to initialize events. events will not work without
            }
        },
        searchbox: {
            template: 'searchbox.tpl.html',
            position: 'top-left',
            options: {
                visible: true
            },
            events: {
                //FOR SEARCH QUERIES
                places_changed: function (searchBox) {
                    let places = searchBox.getPlaces();
                    let lat = places[0].geometry.location.lat();
                    let lng = places[0].geometry.location.lng();
                    MountainProjService.getClimbingAreas15(lat, lng).then((results) => {
                        $scope.map.zoom = 12;
                        $scope.map.center = formatMapCenter(results.data.routes[0].latitude, results.data.routes[0].longitude);
                        $scope.markers = formatMarkerLocations(results);
                        $scope.routes = [{ name: "", type: "click a marker" }];
                    });
                }
            }
        }
    };

    // initial marker instance on page load
    $scope.markers = [{
        id: 0,
    }];

    //GRABS CURRENT LOCATION, PLOTS CLIMBS WITHIN 100 MILES
    const plotCurrentPositionMarker = () => {
        $window.navigator.geolocation.getCurrentPosition(function (position) {
            $scope.currentPosition = position;
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;
            $scope.markers.push({ id: 'crntPos', latitude: lat, longitude: lng });
            $scope.map = {
                center: formatMapCenter(lat, lng),
                events: {
                    //FOR CLICK QUERIES
                    click: function (a, click, c) {
                        $scope.map.zoom = 8;
                        $scope.map.center = formatMapCenter(c[0].latLng.lat(), c[0].latLng.lng());
                        getClimbingRadius50Miles(c[0].latLng.lat(), c[0].latLng.lng());
                        $scope.markers.push({ id: 'trip', latitude: lat, longitude: lng });
                    }
                },
                zoom: 6,
                options: { scrollwheel: true }
            };
            getClimbingRadius100Miles(lat, lng);
        });
    };
    plotCurrentPositionMarker();

    const formatMapCenter = (lat, lng) => {
        return { latitude: lat, longitude: lng };
    };

    const formatMarkerLocations = (results) => {
        let coords = results.data.routes.map((route, i) => {
            let locations = {};
            locations.latitude = route.latitude;
            locations.longitude = route.longitude;
            locations.id = i;
            locations.icon = 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
            return locations;
        });
        return coords;
    };

    const getClimbingRadius100Miles = (lat, lng) => {
        MountainProjService.getClimbingAreas100(lat, lng).then((results) => {
            $scope.markers = formatMarkerLocations(results);
            $scope.markers.push({ id: 'crntPos', latitude: lat, longitude: lng });
        }).catch((err) => {
            console.log("err in getClimbingAreas100:", err);
        });
    };

    const getClimbingRadius50Miles = (lat, lng) => {
        MountainProjService.getClimbingAreas50(lat, lng).then((results) => {
            $scope.markers = formatMarkerLocations(results);
            $scope.markers.push({ id: 'crntPos', latitude: lat, longitude: lng });
        }).catch((err) => {
            console.log("err in getClimbingAreas100:", err);
        });
    };

    $scope.markersEvents = {
        click: function (marker, eventName, model) {
            $scope.updateHeadingBeforeUserClicksMarker = false;
            model.show = !model.show;

            let markerLat = model.latitude;
            let markerLng = model.longitude;
            $scope.map.zoom = 13;
            $scope.map.center = formatMapCenter(markerLat, markerLng);
            getMapByLatLng(markerLat, markerLng);
            getClimbingRoutes(markerLat, markerLng);
        }
    };

    const getMapByLatLng = (lat, lng) => {
        MapsService.getMapByLatLngQuery(lat, lng).then((results) => {
            $scope.address = results.data.results[0].formatted_address;
        }).catch((err) => {
            console.log('error in getMapByLatLngQuery, TripCreateCtrl:', err);
        });
    };

    const getClimbingRoutes = (lat, lng) => {
        $scope.allRoutes = [];
        $scope.routes = [];
        MountainProjService.getClimbingRoutesByLatLng(lat, lng).then((climbs) => {
            climbs = climbs.data.routes;
            let area = climbs.filter(function (route) {
                if (route.latitude === $scope.map.center.latitude && route.longitude === $scope.map.center.longitude) {
                    return route.location[1].indexOf($scope.map.center.latitude) + ', ' + route.location[0].indexOf($scope.map.center.latitude);
                } else {
                    return "Unnamed Area";
                }
            });

            /////ClIMBING AREA HEADING
            $scope.area = area[0].location[1] + ', ' + area[0].location[0];

            let routes = climbs.map((route) => {
                route.area = route.location[1] + ', ' + route.location[0];
                return route;
            });
            //SAVING A COPY OF THE ROUTES ARRAY FOR FILTERING
            $scope.allRoutes = routes;
            $scope.routes = routes;
        }).catch((err) => {
            console.log('error in getClimbingRoutesByLatLng:', err);
        });
    };

    $scope.filterRoutesClassic = () => {
        $scope.filterOn = "-stars";
        getAllRoutes();
        $scope.routes = $scope.routes.filter((a) => {
            if (4 <= a.stars) {
                return a;
            }
        });
        if ($scope.routes.length == 0) {
            $scope.routes = [{ name: "None", type: "search again" }];
        }

    };

    $scope.filterRoutesType = (type, TR) => {
        $scope.filterOn = "name";
        getAllRoutes();
        if (TR) {
            $scope.routes = $scope.routes.filter((route) => {
                return route.type.indexOf(TR) > -1;
            });
        } else {
            getAllRoutes();
            $scope.routes = $scope.routes.filter((route) => {
                return route.type.indexOf(type) > -1;
            });
        }
        if ($scope.routes.length == 0) {
            $scope.routes = [{ name: "None", type: "search again" }];
        }
    };

    $scope.getAllRoutes = () => {
        $scope.filterOn = "name";
        getAllRoutes();
    };

    const getAllRoutes = () => {
        $scope.routes = $scope.allRoutes;
    };

    $scope.savedRoutes = [];

    $scope.removeRouteFromSavedRoutes = (index, route) => {
        $scope.routes.forEach((listRoute) => {
            if (listRoute.id === route.id) {
                listRoute.disabled = false;
            }
        });
        $scope.savedRoutes.splice(index, 1);
    };

    // SAVE/REMOVE EACH CLIMBING ROUTE TO AN ARRAY FROM MAIN ROUTE LIST UNDER MAP
    $scope.saveToRouteList = (index, route) => {
        route.disabled = route.disabled ? false : true; 
        if (route.disabled) {
            $scope.savedRoutes.push(route);
        } else {
            $scope.savedRoutes.forEach((savedRoute, i) => {
                if (savedRoute.id == route.id) {
                    $scope.savedRoutes.splice(i, 1);
                }
            });
        }        
    };

    $scope.createTrip = (trip, dt) => {
        let date = dt.toString();
        let area = $scope.area;
        let lat = $scope.map.center.latitude;
        let lng = $scope.map.center.longitude;
        let mapsAddress = $scope.address;

        let newTrip = TripsService.createTripObj(trip, mapsAddress, lat, lng, date, area);
        saveTrip(newTrip);
    };

    const saveTrip = (newTrip) => {
        TripsService.saveTripToFirebase(newTrip).then((results) => {
            let tripId = results.data.name;
            saveRoutes($scope.savedRoutes, tripId);
            $timeout(function () {
                $location.path("/trips");
            }, 250);
        }).catch((err) => {
            console.log('error in saveTripToFirebase:', err);
        });
    };

    const saveRoutes = (routes, tripId) => {
        routes.forEach((route) => {
            let newRoute = RoutesService.createRouteObj(route, tripId);
            RoutesService.saveTripRoutesToFirebase(newRoute).then(() => {
            }).catch((err) => {
                console.log('error in saveTripRoutesToFirebase:', err);
            });
        });
    };

    // ////////////////////////////////////////
    // DATEPICKER
    // ////////////////////////////////////////
    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    function getDayClass(data) {
        let date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            let dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                let currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }
        return '';
    }

    //////////////////////////////////////////////////

});