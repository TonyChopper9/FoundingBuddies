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


  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
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

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("hallo");
            firebase.firestore().collection("users").doc("" + user.uid).set({
                Username: username,
                mail: email
            }).catch(function (error){console.log(error)});
          user.updateProfile({
            displayName: username
            //photoURL: // some photo url
          }).then(function() {
            window.location.href = "index.html";
          });
        }
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
//redirect after sign in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    window.location.href = "index.html";
  }
});
}

function signInWithGoogle() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);

  //Redirect after Sign in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      window.location.href = "index.html";
      firebase.firestore().collection("users").doc(user.uid).set({
          Username: user.displayName,
          mail: user.email
      }).catch(function (error){console.log(error)});
    }
  });
}

/*function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

function authStateObserver(user) {
  if (user) { // User is signed in!
    window.location.href = "index.html";
  }
}
*/
//Shortcuts
var signInButtonWithGoogleElement = document.getElementById('signInWithGoogleBtn');
var signInButtonWithEmailElement = document.getElementById('signInWithEmailBtn');
var signUpButtonElement = document.getElementById('signUpBtn');

//Add Listener
signInButtonWithGoogleElement.addEventListener('click', signInWithGoogle);
signInButtonWithEmailElement.addEventListener("click", signInWithEmail);
signUpButtonElement.addEventListener("click", signUp)

//initFirebaseAuth();
