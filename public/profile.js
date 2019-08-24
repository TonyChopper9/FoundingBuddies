var firebaseConfig = {
    apiKey: "AIzaSyCR21vYC-VOPIqipke-DrTXy_rWM5JwRag",
    authDomain: "foundingbuddies-8f157.firebaseapp.com",
    databaseURL: "https://foundingbuddies-8f157.firebaseio.com",
    projectId: "foundingbuddies-8f157",
    storageBucket: "foundingbuddies-8f157.appspot.com",
    messagingSenderId: "762592768507",
    appId: "1:762592768507:web:a151988d7a9cb394"
};
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();
var functions = firebase.functions();

function initFirebaseAuth() {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged(authStateObserver);
}

function authStateObserver(user) {
    if (user) { // User is signed in!
        // Get the signed-in user's profile pic and name.

        var profilePicUrl = getProfilePicUrl();
        var userName = getUserName();
        // Set the user's profile pic and name.
        userPicElement.src = addSizeToGoogleProfilePic(profilePicUrl);
        userNameElement.textContent = userName;

    } else { // User is signed out!
        window.location.href = "index.html";
    }
}

var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var logoutButtonElement = document.getElementById("sign-out");

initFirebaseAuth();