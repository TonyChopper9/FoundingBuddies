function signUp(email, password){
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
}

function signInWithEmail(email, password){
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

//Shortcuts
var signInButtonWithGoogleElement = document.getElementById('signInWithGoogleBtn');
var signInButtonWithEmailElement = document.getElementById('signInWithEmailBtn');
var signUpButtonElement = document.getElementById('signUpBtn');
