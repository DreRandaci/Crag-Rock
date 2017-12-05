'use strict';

app.controller('TripCtrl', function ( $http, $q, $log, $scope, MapsService ) {    

    $scope.map = {
        center: {
            latitude: 36.1626638, longitude: -86.7816016
        }, 
        zoom: 8,
    };

    var address = 'nashville, tn';    
    const geocode = (address) => {
        MapsService.getMapByAddressQuery(address).then((results) => {
            console.log(results);
        }).catch((err) => {
            console.log("error in getMapByAddressQuery:", err);
        });
    };
    geocode(address);

    $scope.marker = {
        id: 0,
        coords: {
                    //nashville
          latitude: 36.1626638,
          longitude: -86.7816016
        },
        options: { draggable: true },
        events: {
          dragend: function (marker, eventName, args) {
            $log.log('marker dragend');
            var lat = marker.getPosition().lat();
            var lon = marker.getPosition().lng();
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
