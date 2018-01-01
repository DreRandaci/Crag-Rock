'use strict';

app.service("AuthService", function ($window, FIREBASE_CONFIG) {

    const authenticateGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider);
    };

    const isAuthenticated = () => {
        return getCurrentUid() ? true : false;
    };

    const logout = () => {
        firebase.auth().signOut();
    };

    const getCurrentUid = () => {
        const localStorageKey = `firebase:authUser:${FIREBASE_CONFIG.apiKey}:[DEFAULT]`;
        const localStorageValue = $window.localStorage[localStorageKey];
        if (localStorageValue) {
            return JSON.parse(localStorageValue).uid;
        }
        return false;
    };

    const getCurrentUserInfo = () => {
        const localStorageKey = `firebase:authUser:${FIREBASE_CONFIG.apiKey}:[DEFAULT]`;
        const localStorageValue = $window.localStorage[localStorageKey];
        if (localStorageValue) {
            let formatUser = {};
            formatUser.first_name = JSON.parse(localStorageValue).displayName.split(' ')[0];            
            formatUser.last_name = JSON.parse(localStorageValue).displayName.split(' ')[1];            
            formatUser.full_name = JSON.parse(localStorageValue).displayName;            
            formatUser.email = JSON.parse(localStorageValue).email;            
            formatUser.picture = JSON.parse(localStorageValue).photoURL;            
            return formatUser;
        }
        return false;
    };

    return { authenticateGoogle, getCurrentUserInfo, getCurrentUid, isAuthenticated, logout };
});
