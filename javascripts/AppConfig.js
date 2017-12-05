'use strict';

app.run(function( FIREBASE_CONFIG ){
    firebase.initializeApp(FIREBASE_CONFIG); 
});

app.config(function( $routeProvider ){    
    $routeProvider
    .when( "/auth", {
        templateUrl: 'partials/auth.html',
        controller: 'AuthCtrl'
    })
    .when( "/chat", {
        templateUrl: 'partials/chat.html',
        controller: 'ChatCtrl', 
    })
    .when( "/friend/detail/:id", {
        templateUrl: 'partials/friend-detail.html',
        controller: 'FriendDetailCtrl', 
    })
    .when( "/friends", {
        templateUrl: 'partials/friends.html',
        controller: 'FriendsCtrl', 
    })
    .when( "/profile", {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl', 
    })
    .when( "/trip/detail/:id", {
        templateUrl: 'partials/trip-detail.html',
        controller: 'TripDetailCtrl', 
    })
    .when( "/trips", {
        templateUrl: 'partials/trips.html',
        controller: 'TripCtrl', 
    })

    .otherwise('/auth');

});