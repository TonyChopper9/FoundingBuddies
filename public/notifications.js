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
var page = 0;
var total = 0;

window.onload = function(){
    const goal = document.getElementById("output");
    if (isUserSignedIn()) {
        console.log(firebase.auth().currentUser.uid);
        const userRef = firestore.collection("users").doc(firebase.auth().currentUser.uid);
        userRef.collection("ReceivedMessages").get().then(function (userColl) {
            userColl.forEach(message => {
                const mData = message.data();
                const header = mData.header;
                const content = mData.constant;
                var sender = "";
                firestore.collection("users").doc(mData.sender).get().then(function (senderU) {
                    sender = senderU.data().Username;

                    var card = document.createElement("div");
                    card.setAttribute("class", "card");
                    var col = document.createElement("div");
                    col.setAttribute("class", "row text-center card-header");
                    col.setAttribute("id", "headingOne");
                    var colI = document.createElement("div");
                    colI.setAttribute("class", "col-4");
                    var but = document.createElement("button");
                    but.setAttribute("class", "btn btn-link collapsed");
                    but.setAttribute("type", "button");
                    but.setAttribute("data-toggle", "collapse");
                    but.setAttribute("data-target", "#collapseOne");
                    but.innerHTML = header;
                    var colII = document.createElement("div");
                    colII.setAttribute("class", "col-4");
                    colII.innerHTML = sender;
                    colI.appendChild(but);
                    col.appendChild(colI);
                    col.appendChild(colII);

                    var colla = document.createElement("div");
                    colla.setAttribute("class", "collapse");
                    colla.setAttribute("id", "collapseOne");
                    colla.setAttribute("data-parent", "#accordionExample");
                    var collab = document.createElement("div");
                    collab.setAttribute("class", "card-body");
                    collab.innerHTML = content;
                    colla.appendChild(collab);

                    card.appendChild(col);
                    card.appendChild(colla);

                    goal.appendChild(card);
                })
            })
        }).catch(function (error) {
            console.log(error)
        })
    }
        else {
            console.log("No user is signed in ATM");
        }

};

function addMessage() {

}

function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

function authStateObserver(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.

    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    //load chat Messages
    //loadMessages();

    //if (profilePicUrl == "") {
    //  profilePicUrl = "media/usericon.png";
    //}

    // Set the user's profile pic and name.
    userPicElement.src = addSizeToGoogleProfilePic(profilePicUrl);
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.style.display = "";
    userPicElement.style.display = "";

    // Hide sign-in button.
    //loginPageButton.style.display = "none";
    // Show sign-out button.
    //menuButtonElement.style.display = "";
    //uploadBtn.style.display = "";

    // We save the Firebase Messaging Device token and enable notifications.
    //saveMessagingDeviceToken();
  } else { // User is signed out!
      window.location.href = "index.html";
    // Hide user's profile and sign-out button.
    //userNameElement.setAttribute('hidden', 'true');
    //userPicElement.style.display = "none";

    // Show sign-in button.
    //loginPageButton.style.display = "";
    //Hide sign-out Button
    //menuButtonElement.style.display = "none";
    //uploadBtn.style.display = "none";
  }
}

/*
function sendEmail() {
  var sendTestMail = firebase.functions().httpsCallable('sendMail');
  const docRef = firestore.collection("posts").doc(refPost.value);
  var mainDocData = null;
  docRef.get().then(function (doc) {
    if (doc && doc.exists){
      mainDocData = doc.data();

      if (mainDocData != null) {
        const userRef = firestore.collection("users").doc(mainDocData.user);
        var user = null;
        userRef.get().then(function (smh) {
          user = smh.data();
          var sendUserName = user.Username;
          var sendUserEmail = user.mail;
        });
    }
  }
  var data = {
    fromName: getUserName,
    to: sendUserEmail,
    subject: emailSubjectInput,
    content: emailContentInput
  }
  sendTestMail(data).then(function(result) {
    // Read result of the Cloud Function.
    console.log(result);
    // ...
  });
}
*/
function menuicon(x) {
  x.classList.toggle("change");
}

function homepage() {
  window.location.href = "index.html";
}

function getUserId() {
    return firebase.auth().currentUser.uid;
}

function isUserSignedIn() {
    return !!firebase.auth().currentUser;
}

//Shortcuts to Document Elements
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
//var menuButtonElement = document.getElementById('menu');
var signOutButtonElement = document.getElementById("sign-out");

// Add Listener
signOutButtonElement.addEventListener('click', signOut);

initFirebaseAuth();
