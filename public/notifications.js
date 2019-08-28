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

function loadMessages() {
    const goal = document.getElementById("output");

    const userRef = firestore.collection("users").doc(firebase.auth().currentUser.uid);
    userRef.collection("ReceivedMessages").get().then(function (userColl) {
        var counter = 0;
        userColl.forEach(message => {
            const thisCounter = counter++;
            const mData = message.data();
            const header = mData.header;
            const content = mData.content;
            const tmstmp = mData.timestamp;
            var sender = "";
            firestore.collection("users").doc(mData.sender).get().then(function (senderU) {
                sender = senderU.data().Username;

                var card = document.createElement("div");
                card.setAttribute("class", "card");
                var col = document.createElement("div");
                if (thisCounter % 2 == 0){
                  col.setAttribute("class", "bg-light row text-center card-header");
                } else {
                  col.setAttribute("class", "bg-dark text-white row text-center card-header");
                }

                col.setAttribute("id", "heading" + thisCounter);
                var colI = document.createElement("div");
                colI.setAttribute("class", "col-4");
                var but = document.createElement("button");
                but.setAttribute("class", "btn collapsed");
                but.setAttribute("type", "button");
                but.setAttribute("data-toggle", "collapse");
                but.setAttribute("data-target", "#collapse" + thisCounter);
                but.innerHTML = header;
                var colII = document.createElement("div");
                colII.setAttribute("class", "col-4");
                colII.innerHTML = sender;
                var colIII = document.createElement("div");
                colIII.setAttribute("class", "col-4");
                var dateDate = tmstmp.toDate();
                colIII.innerHTML = dateDate.getDate() + "." + (dateDate.getMonth() + 1) + "." + dateDate.getFullYear();
                colI.appendChild(but);
                col.appendChild(colI);
                col.appendChild(colII);
                col.appendChild(colIII);

                var colla = document.createElement("div");
                colla.setAttribute("class", "collapse");
                colla.setAttribute("id", "collapse" + thisCounter);
                colla.setAttribute("data-parent", "#output");
                var collab = document.createElement("div");
                collab.setAttribute("class", "card-body");
                collab.innerHTML = content;
                colla.appendChild(collab);

                //Add reply Button
                var repBtn = document.createElement("button");
                repBtn.setAttribute("class", "float-right mr-3 mb-3 btn btn-primary");
                repBtn.setAttribute("onclick", "changeReplyModal('" + message.id + "')");
                //TODO: message id
                repBtn.innerHTML = "Reply";
                colla.appendChild(repBtn);

                card.appendChild(col);
                card.appendChild(colla);

                goal.appendChild(card);
            }).catch(function (error){
                console.log(error);
            })
        })
    }).catch(function (error) {
        console.log(error)
    })
}

function changeReplyModal(messageID) {
    console.log(messageID)
}

function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut();
}

function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
    return firebase.auth().currentUser.displayName;
}

function initFirebaseAuth() {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged(authStateObserver);
}

function authStateObserver(user) {
    if (user) { // User is signed in!
        // Get the signed-in user's profile pic and name.

        var profilePicUrl = getProfilePicUrl();
        var userName = user.displayName;
        var userMail = getUserMail();
        var emailVerify = user.emailVerified;

        // Set the user's profile pic and name and mail and show.
        //userPicElement.src = addSizeToGoogleProfilePic(profilePicUrl);
        userNameElement.innerHTML = userName;
        if (emailVerify) {
            userMailElement.innerHTML = userMail;
        } else {
            userMailElement.innerHTML = userMail + "<br>(not verified yet)";
            addSendEmailVerifyButton();
        }
        if (user.providerId != "firebase") {
            changeEmailBtn.style.display = "none";
            resetPasswordBtn.style.display = "none";
        }
        loadMessages();
    } else { // User is signed out!
        window.location.href = "index.html";
    }
}

function sendReply(ReplyId) {
    const recieverMessages = firestore.collection("users").doc(ReplyId).collection("ReceivedMessages");
    recieverMessages.doc().set({
        content: document.getElementById("emailContentInput").value,
        header: document.getElementById("emailSubjectInput").value,
        sender: firebase.auth().currentUser.uid,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date())
    })
    clearReplyModal();
}

function clearReplyModal() {
    document.getElementById("emailSubjectInput").value = "";
    document.getElementById("emailContentInput").value = "";
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

function addSizeToGoogleProfilePic(url) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
        return url + '?sz=25';
    }
    return url;
}

function getUserMail() {
    return firebase.auth().currentUser.email;
}

function addSendEmailVerifyButton() {
    var emailVerifyBtn = document.createElement("button");
    emailVerifyBtn.setAttribute("class", "btn btn-warning btn-block");
    emailVerifyBtn.setAttribute("type", "button");
    emailVerifyBtn.setAttribute("onclick", "sendVerificationEmail()");
    emailVerifyBtn.innerHTML = "Send Verification-Email";
    profileDiv.appendChild(emailVerifyBtn);
}

function sendVerificationEmail() {
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        alert("A Verification-Email has been sent to: " + firebase.auth().currentUser.email);
    }).catch(function (error) {
        // An error happened.
    });
}

function changeEmail() {
    var newEmail = document.getElementById("newEmailInput").value;
    //TODO: check new email on syntax, no stackoverflow etc.
    firebase.auth().currentUser.updateEmail(newEmail).then(function () {
        document.getElementById("newEmailInput").value = ""; //clear modal
        alert("Your Email has been changed to " + firebase.auth().currentUser.email + ".");
    }).catch(function (error) {
        // An error happened.
    });
}

function changePassword() {
    var newEmail = document.getElementById("").value;
    //TODO: check new password on syntax, no stackoverflow etc.
    firebase.auth().currentUser.updatePassword(newPassword).then(function () {
        alert("Your password has beend changed!");
    }).catch(function (error) {
        // An error happened.
    });
}

function deleteUser() {
    alert("Delete is not unlocked yet!");
    /*
    firebase.auth().currentUser.delete().then(function() {
      alert("Your account has been deleted!");
    }).catch(function(error) {
      console.error(error);
    });*/
}

//Shortcuts to Document Elements
var userPicElement = document.getElementById('user-pic');
var signOutButtonElement = document.getElementById("sign-out");
var userNameElement = document.getElementById('user-name');
var userMailElement = document.getElementById('user-mail');
var profileDiv = document.getElementById("profileDiv");
var profileData = document.getElementById("profileData");
var changeEmailBtn = document.getElementById("changeEmailBtn");
var resetPasswordBtn = document.getElementById("resetPasswordBtn");


// Add Listener
signOutButtonElement.addEventListener('click', signOut);

initFirebaseAuth();
