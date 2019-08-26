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
var flag1 = false;
var flag2 = false;

function signUp() {
    const username = document.getElementById("inputSignUpUsername").value;
    const email = document.getElementById("inputSignUpEmail").value;
    const password = document.getElementById("inputSignUpPassword").value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            user.user.updateProfile({
                displayName: username
            }).then(function(){
              //Send Verification Email
              user.user.sendEmailVerification().then(function () {
                  alert("A Verification-Email has been sent to " + user.user.email + ".");
              }).catch(function (error) {
                  // An error happened.
              });
            }).catch(function(error) {
                user.user.updateProfile({
                    displayName: "nameError"
                });
            });

            firestore.collection("users").doc(user.user.uid).set({
                Username: username,
                mail: email
            }).then(function () {
                firestore.collection("users").doc(user.user.uid).collection("ReceivedMessages").doc().set({
                    content: "This will be your personal message Space!!",
                    header: "Welcome to FoundingBuddies!",
                    sender: "9p78wKqLdoSgyHMG6uG5GHtObm33",
                    timestamp: firebase.firestore.Timestamp.fromDate(new Date())
                }).then(function () {
                    flag1 = true;
                    console.log("Added User!!!");
                    redirectHome();
                });
            }).catch(function (error) {
                console.error("Error writing doc: ", error);
            });
            flag2 = true;
            redirectHome();
        })
        .catch(function (error) {
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

    console.log("ende");
}

function signInWithEmail() {
    var email = document.getElementById("inputLoginEmail").value;
    var password = document.getElementById("inputLoginPassword").value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        flag1 = true;
        flag2 = true;
        redirectHome()
    }).catch(function (error) {
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
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var user = result.user;
        console.log(user.displayName);
        console.log(user.uid);



        firestore.collection("users").doc(user.uid).add({
            Username: user.displayName,
            mail: user.email
        }).then(function () {
            firestore.collection("users").doc(user.uid).collection("ReceivedMessages").doc().set({
                content: "This will be your personal message Space!!",
                header: "Welcome to FoundingBuddies!",
                sender: "9p78wKqLdoSgyHMG6uG5GHtObm33",
                timestamp: firebase.firestore.Timestamp.fromDate(new Date())
            }).then(function () {
                flag1 = true;
                console.log("Added User!!!");
                redirectHome();
            });
        }).catch(function (error) {
            console.error("G: Error writing doc: ", error);
        });
        flag2 = true;
        redirectHome()
    });
}

function redirectHome() {
    console.log("aiaiai dios mio!");
    if (flag1 && flag2) {
        flag1 = false;
        flag2 = false;
        window.location.href = "index.html";
    }
}

function resetPassword() {
  var emailAddress = document.getElementById("inputLoginEmail").value;
  //TODO: check emailAddress on syntax, no stackoverflow etc.
  firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
    alert("A Password-Reset-Email has been sent to " + emailAddress + "!");
  }).catch(function(error) {
    console.error(error);
  });
}

firebase.auth().onAuthStateChanged(function (user) {
    redirectHome();
});

//Shortcuts
var signInButtonWithGoogleElement = document.getElementById('signInWithGoogleBtn');
var signInButtonWithEmailElement = document.getElementById('signInWithEmailBtn');
var signUpButtonElement = document.getElementById('signUpBtn');

//Add Listener
signInButtonWithGoogleElement.addEventListener('click', signInWithGoogle);
signInButtonWithEmailElement.addEventListener("click", signInWithEmail);
signUpButtonElement.addEventListener("click", signUp);

//initFirebaseAuth();
