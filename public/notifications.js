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
var unis = new Map();
unis.set("TUM", "Technische Universität München");
unis.set("LMU", "Ludwig-Maximilians-Universität");
unis.set("UNIBW", "Universität der Bundeswehr München");
unis.set("HM", "Hochschule München");
unis.set("MBS", "Munich Business School");

function loadMessages() {
    const goal = document.getElementById("output");
    const userRef = firestore.collection("users").doc(firebase.auth().currentUser.uid);
    userRef.get().then(user => {
        const uData = user.data();
        userRef.set({
            Username: uData.Username,
            mail: uData.mail,
            newMessage: false
        });
    });
    userRef.collection("ReceivedMessages").orderBy("timestamp", "desc").get().then(function (userColl) {
        var counter = 0;
        userColl.forEach(message => {
            const thisCounter = counter++;
            const mData = message.data();
            const header = mData.header;
            const content = mData.content;
            const tmstmp = mData.timestamp;
            var sender = "";
            firestore.collection("users").doc(mData.sender).get().then(function (senderU) {
                if (senderU.data() != undefined) {
                    sender = senderU.data().Username;
                }

                var card = document.createElement("div");
                card.setAttribute("class", "card");
                var col = document.createElement("div");
                if (thisCounter % 2 == 0) {
                    col.setAttribute("class", "bg-light row text-center card-header collapsed");
                } else {
                    col.setAttribute("class", "bg-white row text-center card-header collapsed");
                }

                col.setAttribute("id", "heading" + thisCounter);
                col.setAttribute("data-toggle", "collapse");
                col.setAttribute("data-target", "#collapse" + thisCounter);
                var colI = document.createElement("div");
                colI.setAttribute("class", "col-4");
                colI.innerHTML = header;
                var colII = document.createElement("div");
                colII.setAttribute("class", "col-4");
                if (senderU.data() != undefined) {
                    colII.innerHTML = sender;
                } else {
                    colII.innerHTML = "[deleted]";
                }
                var colIII = document.createElement("div");
                colIII.setAttribute("class", "col-4");
                var dateDate = tmstmp.toDate();
                colIII.innerHTML = dateDate.getDate() + "." + (dateDate.getMonth() + 1) + "." + dateDate.getFullYear();
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

                if (senderU.data() != undefined) {
                    //Add reply Button
                    var repBtn = document.createElement("button");
                    repBtn.setAttribute("class", "float-right mr-3 mb-3 btn btn-j3");
                    repBtn.setAttribute("onclick", "changeReplyModal('" + message.id + "')");
                    repBtn.setAttribute("data-toggle", "modal");
                    repBtn.setAttribute("data-target", "#replyModal");
                    //TODO: message id
                    repBtn.innerHTML = "Reply";
                    colla.appendChild(repBtn);
                }

                card.appendChild(col);
                card.appendChild(colla);

                goal.appendChild(card);
            }).catch(error => {
                console.log(error)
            });
        })
    }).catch(error => {
        console.log(error)
    });
}

function loadMyPosts(){
  firestore.collection("posts").where("user", "==", getUserId()).orderBy("Date", "desc").get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            var data = doc.data();
            var card = document.createElement("div");
            card.setAttribute("class", "card mb-3 w-100");
            card.setAttribute("id", doc.id);

            var body = document.createElement("div");
            body.setAttribute("class", "card-body");

            var title = document.createElement("h5");
            title.setAttribute("class", "mb-0 card-title");
            title.innerHTML = data.header + " - " + unis.get(data.uni);
            body.appendChild(title);

            var closeBtn = document.createElement("button");
            closeBtn.setAttribute("type", "button");
            closeBtn.setAttribute("class", "ml-1 close material-icons");
            closeBtn.setAttribute("data-toggle", "modal");
            closeBtn.setAttribute("data-target", "#deletePostModal");
            var closeBtnText = document.createElement("span");
            closeBtnText.innerHTML = "close";
            closeBtn.appendChild(closeBtnText);
            title.appendChild(closeBtn);

            var editBtn = document.createElement("button");
            editBtn.setAttribute("type", "button");
            editBtn.setAttribute("class", "close material-icons");
            editBtn.setAttribute("data-toggle", "modal");
            editBtn.setAttribute("data-target", "#editModal");
            editBtn.setAttribute("onclick", "openEditModal('" + doc.id + "')");
            var editBtnText = document.createElement("span");
            editBtnText.innerHTML = "edit";
            editBtn.appendChild(editBtnText);
            title.appendChild(editBtn);

            var metaStuff = document.createElement("p");
            metaStuff.setAttribute("class", "mb-2 card-text");
            var small = document.createElement("small");
            small.setAttribute("class", "text-muted");
            var dateDate = data.Date.toDate();
            small.innerHTML = dateDate.getDate() + "." + (dateDate.getMonth() + 1) + "." + dateDate.getFullYear();
            metaStuff.appendChild(small);
            body.appendChild(metaStuff);


            var inhalt = document.createElement("p");
            inhalt.setAttribute("class", "text-brake card-text");
            inhalt.innerHTML = data.content;
            body.appendChild(inhalt);

            card.appendChild(body);
            var postOutput = document.getElementById("postOutput");
            postOutput.appendChild(card);

        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function changeReplyModal(messageID) {
    document.getElementById("messageSendButton").setAttribute("onclick", "sendReply('" + messageID + "')");
}

function sendReply(messageID) {
    const userRef = firestore.collection("users").doc(firebase.auth().currentUser.uid);
    userRef.collection("ReceivedMessages").doc(messageID).get().then(function (message) {
        const mData = message.data();
        firestore.collection("users").doc(mData.sender).get().then(user => {
            const userData = user.data();
            firestore.collection("users").doc(mData.sender).set({
                newMessage: true,
                Username: userData.Username,
                mail: userData.mail
            });
        }).then(na => {
            const receiverMessages = firestore.collection("users").doc(mData.sender).collection("ReceivedMessages");
            receiverMessages.doc().set({
                content: document.getElementById("emailContentInput").value,
                header: document.getElementById("emailSubjectInput").value,
                sender: firebase.auth().currentUser.uid,
                timestamp: firebase.firestore.Timestamp.fromDate(new Date())
            }).then(na2 => {
                clearReplyModal();
            });
        }).catch(na => {
            window.alert("User does not exist anymore.")
        });
    });
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
        if (user.providerData.entries().next().value[1].providerId == "google.com") {
            changeEmailBtn.style.display = "none";
            changePasswordBtn.style.display = "none";
        }
        loadMessages();
        loadMyPosts();
    } else { // User is signed out!
        window.location.href = "index.html";
    }
}

function clearReplyModal() {
    document.getElementById("emailSubjectInput").value = "";
    document.getElementById("emailContentInput").value = "";
}

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
    const emailVerifyBtn = document.createElement("button");
    emailVerifyBtn.setAttribute("class", "btn btn-j1 btn-block");
    emailVerifyBtn.setAttribute("type", "button");
    emailVerifyBtn.setAttribute("onclick", "sendVerificationEmail()");
    emailVerifyBtn.innerHTML = "Send Verification-Email";
    profileDiv.appendChild(emailVerifyBtn);
}

function sendVerificationEmail() {
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        alert("A Verification-Email has been sent to: " + firebase.auth().currentUser.email);
    }).catch((error) => {
        console.error(error)
    });
}

function changeEmail() {
    const newEmail = document.getElementById("newEmailInput").value;
    firebase.auth().currentUser.updateEmail(newEmail).then(function () {
        document.getElementById("newEmailInput").value = ""; //clear modal
        alert("Your Email has been changed to " + firebase.auth().currentUser.email + ".");
    }).catch((error) => {
        console.error(error)
    });
}

function changePassword() {
    const newPassword = document.getElementById("").value;
    firebase.auth().currentUser.updatePassword(newPassword).then(function () {
        alert("Your password has been changed!");
    }).catch((error) => {
        console.error(error)
    });
}

function deletePosts(snapshot) {
    return new Promise((resolve, reject) => {
        console.log("1");
        snapshot.forEach(doc => {
            firestore.collection("posts").doc(doc.id).delete().then(na => {}).catch((error) => {
                console.error(error);
                reject(error)
            });
            console.log("2");
        });
        console.log("3");
        resolve()
    })
}

function deleteUser() {
    console.log("start");
    firestore.collection("posts").where("user", "==", firebase.auth().currentUser.uid).get().then(function (snapshot) {
        console.log("4");
        deletePosts(snapshot).then(na => {
            console.log("5");
            firestore.collection("users").doc(firebase.auth().currentUser.uid).delete().then(function () {
                console.log("6");
                firebase.auth().currentUser.delete().then(function () {
                    console.log("7");
                    alert("Your account has been deleted!");
                }).catch((error) => {
                    if(error.code == "auth/requires-recent-login"){
                        alert("To delete your account you have to have logged in recently. Log out and back in and try again.")
                    } else {
                        console.error(error)
                    }
                })
            }).catch((error) => {console.error(error)});
        }).catch((error) => {console.error(error)});
    }).catch((error) => {
        console.error(error)
    });
}

function openEditModal(id) {
  firestore.collection("posts").doc(id).get().then(function(doc){
    if(doc.exists){
        document.getElementById("editTitleInput").value = doc.data().header;
        document.getElementById("editContentInput").value = doc.data().content;
        document.getElementById("editButton").setAttribute("onclick", "editPost('" + id + "')");
        var e = document.getElementById("editTagInput");
        e.options[e.selectedIndex].removeAttribute("selected");
        //var select = e.options.indexOf(doc.data().uni); TODO
        //e.options[select].selected = true;
        console.log(doc.data().uni);
        for (var i = 0; i < e.options.length; i++) {
          console.log(e.options[i].value);
        	if (e.options[i].value == doc.data().uni) {
        		e.options[i].selected = true;
            console.log("Hurra");
        	}
        }
    }
  });
}

function editPost(id) {
  firestore.collection("posts").doc(id).get().then(function(doc){
    if (doc.data().user == getUserId()) {
      var e = document.getElementById("editTagInput");
      var inpData = {
        header: document.getElementById("editTitleInput").value,
      	content: document.getElementById("editContentInput").value,
      	uni: e.options[e.selectedIndex].value
      }
    	firestore.collection("posts").doc(id).set(inpData).catch(function(error) {
        console.error(error);
      });
    }
    else {
      console.error("You don't have the permission to edit this post!");
    }
  });
}

//Shortcuts to Document Elements
var userPicElement = document.getElementById('user-pic');
var signOutButtonElement = document.getElementById("sign-out");
var userNameElement = document.getElementById('user-name');
var userMailElement = document.getElementById('user-mail');
var profileDiv = document.getElementById("profileDiv");
var profileData = document.getElementById("profileData");
var changeEmailBtn = document.getElementById("changeEmailBtn");
var changePasswordBtn = document.getElementById("changePasswordBtn");

// Add Listener
signOutButtonElement.addEventListener('click', signOut);

initFirebaseAuth();
