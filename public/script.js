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
  var mainDocData = null;
  docRef.get().then(function (doc) {
    if (doc && doc.exists){
      mainDocData = doc.data();

      if (mainDocData != null) {
        var element = document.createElement("div");
        element.setAttribute("class", "blog-post");

        //HEADER
        var header1 = document.createElement("h2");
        header1.setAttribute("class", "blog-post-title");
        header1.innerHTML = mainDocData.header;

        //AUTHORING
        var metaStuff = document.createElement("p");
        metaStuff.setAttribute("class", "blog-post-meta");
        var linkName = document.createElement("a");
        //User
        var userRef = firestore.collection("users").doc(mainDocData.user);
        userRef.get().then(function (smh) {
          var user = null;
          if (smh && smh.exists) {
            user = smh.data();
            linkName.innerHTML = user.Username;
          }
        });
        //var mail = "mailto:" + user.E-mail;
        //linkName.setAttribute("href", mail);
        //linkName.innerHTML = user.Username;
        metaStuff.innerHTML = "TODO: DATUM";
        metaStuff.appendChild(linkName);

        //TAG ROW
        var divElement = document.createElement("div");
        divElement.setAttribute("class", "row");

        //ZWISCHENZEILE
        var zeile = document.createElement("hr /");

        //INHALT
        var inhalt = document.createElement("p");
        inhalt.innerHTML = mainDocData.content;

        element.appendChild(header1);
        element.appendChild(metaStuff);
        element.appendChild(divElement);
        element.appendChild(zeile);
        element.appendChild(inhalt);

        var theDiv = document.getElementById("output");
        theDiv.insertBefore(element,theDiv.firstChild);
      }

    }
  }).catch(function (error) {
    console.log("Error: ", error);
  });
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
