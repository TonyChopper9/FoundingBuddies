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

function signUp(){
  const username = document.getElementById("inputSignUpUsername").value;
  const email = document.getElementById("inputSignUpEmail").value;
  const password = document.getElementById("inputSignUpPassword").value;


  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((user) => {
      console.log(user);
      console.log(user.user);
      console.log(user.user.uid);
      console.log(user.user.email);
      console.log(username);
      console.log(email);
      console.log("lulululu");
    firebase.firestore().collection("users").doc("PEter").set({
        Username: username,
        mail: email
    }).then(function() {
      console.log("Added User!!!")
    }).catch(function(error){console.log(error)})
    //user.updateProfile({
    //displayName: username
    //photoURL: // some photo url
    //})
  })
  .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });



}


function signInWithEmail(){
  var email = document.getElementById("inputLoginEmail").value;
  var password = document.getElementById("inputLoginPassword").value;
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // log error
  console.console.log(error);
});

}

function signInWithGoogle() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}


//redirect after sign in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    window.location.href = "index.html";
  }
});
//Shortcuts
var signInButtonWithGoogleElement = document.getElementById('signInWithGoogleBtn');
var signInButtonWithEmailElement = document.getElementById('signInWithEmailBtn');
var signUpButtonElement = document.getElementById('signUpBtn');

//Add Listener
signInButtonWithGoogleElement.addEventListener('click', signInWithGoogle);
signInButtonWithEmailElement.addEventListener("click", signInWithEmail);
signUpButtonElement.addEventListener("click", signUp)

//initFirebaseAuth();
