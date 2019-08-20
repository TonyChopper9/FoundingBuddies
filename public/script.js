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

window.onload = function() {
  addDocument("1bu1KXFOMUHwSSOOkBlf")
};

function addDocument(docId) {
  const docRef = firestore.collection("posts").doc(docId);
  var mainDocData = null;
  docRef.get().then(function (doc) {
    if (doc && doc.exists){
      mainDocData = doc.data();

      if (mainDocData != null) {
        var element = document.createElement("div");
        element.setAttribute("class", "blog-post");
        element.setAttribute("id", docId);
        console.log("-1-");

        //HEADER
        var header1 = document.createElement("h2");
        header1.setAttribute("class", "blog-post-title");
        header1.innerHTML = mainDocData.header;
        element.appendChild(header1);
        console.log("-2-");

        //AUTHORING
        const userRef = firestore.collection("users").doc(mainDocData.user);
        var user = null;

        userRef.get().then(function (smh) {

          var metaStuff = document.createElement("p");
          metaStuff.setAttribute("class", "blog-post-meta");
          var linkName = document.createElement("a");
          linkName.setAttribute("href", "#");
          console.log("-3-");

          //User
          user = smh.data();
          var dateDate = mainDocData.Date.toDate();
          metaStuff.innerHTML = dateDate.getDate() + "." + dateDate.getMonth() + "." + dateDate.getFullYear() + " by ";
          metaStuff.appendChild(linkName);
          console.log("-4-");
          element.appendChild(metaStuff);
          metaStuff.lastChild.innerHTML = user.Username;
          console.log("-5-");

          //TAG ROW
          var divElement = document.createElement("div");
          divElement.setAttribute("class", "row");
          element.appendChild(divElement);
          console.log("-6-");

          //ZWISCHENZEILE
          var zeile = document.createElement("hr");
          element.appendChild(zeile);
          console.log("-7-");

          //INHALT
          var inhalt = document.createElement("p");
          inhalt.innerHTML = mainDocData.content;
          element.appendChild(inhalt);
          console.log("-8-");

          //MAIL ZEILE
          var mailZeile = document.createElement("p");
          mailZeile.innerHTML = "More Information under: " + user.mail;
          element.appendChild(mailZeile);
          console.log("-9-");

          var theDiv = document.getElementById("output");
          theDiv.insertBefore(element,theDiv.firstChild);
          console.log("-10-");

        }).catch(function (error) {
          console.log("Error: ", error);
        });
      }
    }
  }).catch(function (error) {
    console.log("Error: ", error);
  });
}

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
