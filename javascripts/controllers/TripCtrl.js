'use strict';

app.controller('TripCtrl', function ($http, $q, $log, $scope, MapsService) {
    
    //initial map instance on page load
    $scope.map = {
        center: {
            latitude: 36.1626638, longitude: -86.7816016
        },
        zoom: 8,
        options: {
            scrollwheel: true
        }
    };

    // initial marker instance on page load
    $scope.marker = {
        id: 0,
        coords: {
            latitude: 36.1626638, longitude: -86.7816016
        },
        options: { draggable: true },
        events: {
            dragend: function (marker, eventName, args) {
                $log.log('marker drag-end');
                let lat = marker.getPosition().lat();
                let lon = marker.getPosition().lng();
                $log.log(lat);
                $log.log(lon);

                $scope.marker.options = {
                    draggable: true,
                    labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        }
    };

    //for geolocation later on
    const getCurrentLocationMap = () => {
        navigator.geolocation.getCurrentPosition(function (position) {
            
            //update map instance on page load with geolcation
            $scope.map = {
                center: {
                    latitude: position.coords.latitude, longitude: position.coords.longitude
                },
                zoom: 8,
                options: {
                    scrollwheel: true
                }
            };

            //update marker instance on page load with geolocation
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: position.coords.latitude, longitude: position.coords.longitude
                },
                options: { draggable: true },
                events: {
                    dragend: function (marker, eventName, args) {
                        $log.log('marker drag-end');
                        let lat = marker.getPosition().lat();
                        let lon = marker.getPosition().lng();
                        $log.log(lat);
                        $log.log(lon);

                        $scope.marker.options = {
                            draggable: true,
                            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                            labelAnchor: "100 0",
                            labelClass: "marker-labels"
                        };
                    }
                }
            };
        });
    };

    //grab search query and update map marker
    $scope.geocode = (address) => {
        MapsService.getMapByAddressQuery(address).then((results) => {
            console.log(results.data.results[0]);

            let lat = results.data.results[0].geometry.location.lat;
            let lng = results.data.results[0].geometry.location.lng;

            $scope.map = {
                center: {
                    latitude: lat,
                    longitude: lng
                },
                zoom: 11,
                options: {
                    scrollwheel: true
                }
            };

            $scope.marker = {
                id: 0,
                coords: {
                    latitude: lat,
                    longitude: lng
                },
                options: { draggable: true },
                events: {
                    dragend: function (marker, eventName, args) {
                        $log.log('marker drag-end');
                        let lat = marker.getPosition().lat();
                        let lon = marker.getPosition().lng();
                        $log.log(lat);
                        $log.log(lon);

                        $scope.marker.options = {
                            draggable: true,
                            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
                            labelAnchor: "100 0",
                            labelClass: "marker-labels"
                        };
                    }
                }
            };
        }).catch((err) => {
            console.log("error in getMapByAddressQuery:", err);
        });
    };

});
