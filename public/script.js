//Hier sollte vielleicht irgendwas stehen aber kein Plan

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
const docRef = firestore.collection("posts").doc("1bu1KXFOMUHwSSOOkBlf");

window.onload = function() {
  console.log("Reached the Beginning.");
  var mainDocData = null;
  docRef.get().then(function (doc) {
    if (doc && doc.exists){
      mainDocData = doc.data()
    }
  }).catch(function (error) {
    console.log("Error: ", error)
  });

  if (mainDocData != null) {
    console.log("Reached the start of the function.");
    var element = document.createElement("div");
    element.setAttribute("class", "blog-post");
    var header1 = document.createElement("h2");
    header1.setAttribute("class", "blog-post-title");
    header1.innerHTML = mainDocData.header;
    element.appendChild(header1);
    var theDiv = document.getElementById("output");
    theDiv.appendChild(element);
    console.log("Reached the end of the function.");
  }
};

function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

function authStateObserver(){
if (isUserSignedIn() == true ){
  document.getElementById("loginBtn").innerHTML = "Logout";
}
else {
  document.getElementById("loginBtn").innerHTML = "Login";
}
}
