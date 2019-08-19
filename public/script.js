import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCR21vYC-VOPIqipke-DrTXy_rWM5JwRag",
  authDomain: "foundingbuddies-8f157.firebaseapp.com",
  databaseURL: "https://foundingbuddies-8f157.firebaseio.com",
  projectId: "foundingbuddies-8f157",
  storageBucket: "foundingbuddies-8f157.appspot.com",
  messagingSenderId: "762592768507",
  appId: "1:762592768507:web:a151988d7a9cb394"
};

const posts = firebase.firestore().collection('posts').get();

window.onload = function() {
  firebase.initializeApp(firebaseConfig);
  var einPost = posts.getElementById('1bu1KXFOMUHwSSOOkBlf');
  var element = document.createElement("div");
  element.setAttribute("class", "blog-post");
  var header1 = document.createElement("h2");
  header1.setAttribute("class", "blog-post-title");
  header1.appendChild(einPost.header);
  element.appendChild(header1);
  var theDiv = document.getElementById("output");
  theDiv.appendChild(element);
  console.log("Reached the end of the function.")
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
