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
var page = 0;
var total = 0;

window.onload = function() {
  total = 0;
  firestore.collection("posts").get().then(function (list) {
    var i = 0;
    list.forEach((doc) => {
      total++;
      i++;
      if (i <= 10) {addDocument(doc.id, true)}
      else {addDocument(doc.id, false)}
    })
  });
};

function addDocument(docId, visibility) {
  const docRef = firestore.collection("posts").doc(docId);
  var mainDocData = null;
  docRef.get().then(function (doc) {
    if (doc && doc.exists){
      mainDocData = doc.data();

      if (mainDocData != null) {
        var element = document.createElement("div");
        element.setAttribute("class", "blog-post");
        element.setAttribute("id", docId);
        if(!visibility){element.setAttribute("style", "display: none;")}
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

function nextPage(){
  var x = 0;
  while (x != total){

  }
}

function prevPage(){

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

function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=25';
  }
  return url;
}

function authStateObserver(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.src = addSizeToGoogleProfilePic(profilePicUrl);
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.style.display = "none";
    signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    loginButton.setAttribute('hidden', 'true');
    // Show sign-out button.
    signOutButtonElement.removeAttribute('hidden');

    // We save the Firebase Messaging Device token and enable notifications.
    //saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.style.display = "";
    signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    loginButton.removeAttribute('hidden');
    //Hide sign-out Button
    signOutButtonElement.setAttribute('hidden', "true");
  }
}






//Shortcuts to Document Elements
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var loginPageButton = document.getElementById("LoginPageBtn");
var signOutButtonElement = document.getElementById('sign-out');

// Add Listener
signOutButtonElement.addEventListener('click', signOut);

initFirebaseAuth();
