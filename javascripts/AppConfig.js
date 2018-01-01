'use strict';

let isAuth = (AuthService) => new Promise((resolve, reject) => {
    if (AuthService.isAuthenticated()) {
        resolve();
    } else {
        reject();
    }
});

app.run(function ($location, $rootScope, $templateCache, FIREBASE_CONFIG, AuthService) {
    firebase.initializeApp(FIREBASE_CONFIG);
    $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls form-control" type="text" placeholder="Search">');
    $templateCache.put('window.tpl.html', '<div ng-controller="WindowCtrl" ng-init="showPlaceDetails(parameter)">{{place.name}}</div>');

    //watch method that fires on change of a route.  3 inputs. 
    //event is a change event
    //currRoute is information about your current route
    //prevRoute is information about the route you came from
    $rootScope.$on('$routeChangeStart', function (event, currRoute, prevRoute) {
        // checks to see if there is a cookie with a uid for this app in localstorage
        let logged = AuthService.isAuthenticated();

        let appTo;

        // to keep error from being thrown on page refresh
        if (currRoute.originalPath) {
            // check if the user is going to the auth page = currRoute.originalPath
            // if user is on auth page then appTo is true
            // if it finds something other than /auth it return a -1 and -1!==-1 so resolves to false
            appTo = currRoute.originalPath.indexOf('/auth') !== -1;
        }

        //if not on /auth page AND not logged in redirect to /auth
        if (!appTo && !logged) {
            event.preventDefault();
            $rootScope.navbar = false;
            $location.path('/auth');
        } else if (appTo && !logged) {
            //if on /auth page AND not logged in, no redirect only authentiate in navbar
            $rootScope.navbar = false;
        } else if (appTo && logged) {
            //if on /auth page AND logged in, redirect to search page
            $rootScope.navbar = true;
            $location.path('/trips');
        } else if (!appTo && logged) {
            //if not on /auth page AND logged in see other navbar
            $rootScope.navbar = true;
        }
    });
});

app.config(function ($qProvider, $routeProvider, uiGmapGoogleMapApiProvider, GOOGLEMAPS_CONFIG) {
    $qProvider.errorOnUnhandledRejections(false);
    uiGmapGoogleMapApiProvider.configure({
        china: true,
        key: GOOGLEMAPS_CONFIG,
        v: '3.30',
        libraries: 'weather,geometry,visualization,places'
    });
    $routeProvider
        .when("/auth", {
            templateUrl: 'partials/auth.html',
            controller: 'AuthCtrl'
        })
        .when("/profile", {
            templateUrl: 'partials/profile.html',
            controller: 'ProfileCtrl',
        })
        .when("/trip/detail/:id", {
            templateUrl: 'partials/trip-edit.html',
            controller: 'TripEditCtrl',
        })
        .when("/trip/create", {
            templateUrl: 'partials/trip-create.html',
            controller: 'TripCreateCtrl',
        })
        .when("/trips", {
            templateUrl: 'partials/trips.html',
            controller: 'TripsViewCtrl',
        })
        .when("/trip/add-places/:id", {
            templateUrl: 'partials/trip-places.html',
            controller: 'TripPlacesCtrl',
        })
        .otherwise('/auth');

});