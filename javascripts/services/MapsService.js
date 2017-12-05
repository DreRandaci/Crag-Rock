'use strict';

app.service("MapsService", function( $http, $q, GOOGLEMAPS_CONFIG ){

    const getMapByAddressQuery = (address) => {
        return $q(( resolve, reject ) => {
            $http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLEMAPS_CONFIG}`).then((results) => {
                console.log("geocode results:", results.data.results[0]);
                
                // let lat = results.results[0].geometry.location.lat;
                // let lng = results.results[0].geometry.location.lng;

                // MountainProjService.getClimbs(lat, lng).then().catch();

                // let loc = {
                //     lat: lat, 
                //     lng: lng
                // };
                // let map = new google.maps.Map(document.getElementById('map'), {
                //     zoom: 8,
                //     center: loc
                // });

                // let marker = new google.maps.Marker({
                //     position: loc,
                //     map: map
                // });
            });
        });
    };
    return { getMapByAddressQuery };
});