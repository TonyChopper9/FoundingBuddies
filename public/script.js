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

window.onload = function () {
    total = 0;
    firestore.collection("posts").orderBy("Date", "desc").get().then(function (list) {
        total = list.size;
        addDocument(list.docs, true, 0);
    });
};

function addDocument(docs, visibility, number) {
    const doc = docs[number];
    var mainDocData = null;
    if (doc && doc.exists) {
        mainDocData = doc.data();
        if (mainDocData != null) {
            var element = document.createElement("div");
            element.setAttribute("class", "card mb-3 w-100");
            element.setAttribute("id", docs[number].id);
            element.setAttribute("id2", number);
            if (!visibility) {
                element.setAttribute("style", "display: none;")
            }

            var innerElement = document.createElement("div");
            innerElement.setAttribute("class", "card-body");

            //HEADER
            var header1 = document.createElement("h5");
            header1.setAttribute("class", "mb-0 card-title");
            header1.innerHTML = mainDocData.header;
            innerElement.appendChild(header1);

            //CLOSE BUTTON
            var closeBtn = document.createElement("button");
            closeBtn.setAttribute("type", "button");
            closeBtn.setAttribute("class", "close");
            closeBtn.setAttribute("data-toggle", "modal");
            closeBtn.setAttribute("data-target", "#deleteModal");
            closeBtn.setAttribute("onclick", "openDeleteModal('" + docs[number].id + "')");
            var closeBtnText = document.createElement("span");
            closeBtnText.innerHTML = "&times;";
            closeBtn.appendChild(closeBtnText);

            //AUTHORING
            const userRef = firestore.collection("users").doc(mainDocData.user);
            var user = null;

            userRef.get().then(function (smh) {

                var metaStuff = document.createElement("p");
                metaStuff.setAttribute("class", "mb-2 card-text");
                var small = document.createElement("small");
                small.setAttribute("class", "text-muted");

                //User
                user = smh.data();
                var dateDate = mainDocData.Date.toDate();
                small.innerHTML = dateDate.getDate() + "." + (dateDate.getMonth() + 1) + "." + dateDate.getFullYear() + " by " + user.Username;
                metaStuff.appendChild(small);
                innerElement.appendChild(metaStuff);

                //INHALT
                var inhalt = document.createElement("p");
                inhalt.setAttribute("class", "text-brake card-text");
                inhalt.innerHTML = mainDocData.content;
                innerElement.appendChild(inhalt);

                //MAIL ZEILE
                var mailZeile = document.createElement("div");
                mailZeile.setAttribute("class", "row justify-content-end");
                var contactB = document.createElement("button");
                contactB.setAttribute("class", "mr-3 btn btn-primary");
                contactB.setAttribute("data-toggle", "modal");
                contactB.setAttribute("data-target", "#messageModal");
                contactB.setAttribute("onclick", "contact('" + mainDocData.user + "')");
                contactB.innerHTML = "Contact";
                mailZeile.appendChild(contactB);
                innerElement.appendChild(mailZeile);

                element.appendChild(innerElement);

                var theDiv = document.getElementById("output");
                theDiv.appendChild(element);

                //add close Button if user is authorized
                if (getUserId() == mainDocData.user) {
                    contactB.setAttribute("style", "display: none");
                    header1.appendChild(closeBtn);
                }
                console.log(number);

                if (number < total) {
                    if (number < 9) {
                        addDocument(docs, true, number + 1)
                    } else {
                        addDocument(docs, false, number + 1)
                    }
                }
            }).catch(function (error) {
                console.log("Error: ", error);
            });
        }
    }
}

function nextPage() {
    if (page < Math.floor(total / 10) - 1) {
        page++;
        for (x = 0; x < 10; x++) {
            var id2a = ((page - 1) * 10) + x;
            if (id2a <= total) {
                document.querySelector('[id2="' + id2a + '"]').setAttribute("style", "display: none;")
            }
        }
        for (y = 0; y < 10; y++) {
            var id2n = (page * 10) + y;
            if (id2n <= total) {
                document.querySelector('[id2="' + id2n + '"]').removeAttribute("style")
            }
        }
    }
}

function prevPage() {
    if (page > 0) {
        page--;
        for (x2 = 0; x2 < 10; x2++) {
            var id2a = ((page + 1) * 10) + x2;
            if (id2a <= total) {
                document.querySelector('[id2="' + id2a + '"]').setAttribute("style", "display: none;")
            }
        }
        for (y2 = 0; y2 < 10; y2++) {
            var id2n = (page * 10) + y2;
            if (id2n <= total) {
                document.querySelector('[id2="' + id2n + '"]').removeAttribute("style")
            }
        }
    }
}

function upload() {
    const postRef = firestore.collection("posts");
    const inputHeader = document.querySelector("#uploadTitleInput");
    const inputContent = document.querySelector("#uploadContentInput");
    //const inputButton = document.querySelector("#createButton");
    const inpData = {
        Date: firebase.firestore.Timestamp.fromDate(new Date()),
        content: inputContent.value,
        header: inputHeader.value,
        user: getUserId()
    };
    postRef.doc().set(inpData);
    clearUploadModal();
}

function clearUploadModal() {
    document.getElementById("uploadTitleInput").value = "";
    document.getElementById("uploadContentInput").value = "";
    while (tagList.firstChild) {
        tagList.removeChild(tagList.firstChild);
    }
    var e = document.getElementById("uploadTagInput");
    e.options[e.selectedIndex].removeAttribute("selected");
    e.options[0].selected = true;

}

function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut();
}

function initFirebaseAuth() {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's userid
function getUserId() {
    if (firebase.auth().currentUser != null) {
        return firebase.auth().currentUser.uid;
    } else {
        //Possibly subject to change
        return "error"
    }
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
    const userRef = firestore.collection("users").doc(firebase.auth().currentUser.uid);
    userRef.get().then(function (user) {
        return user.data().Username;
    }).catch(function (error) {
        console.log(error)
    });
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
        //var profilePicUrl = getProfilePicUrl();
        //var userName = user.displayName;
        //var userMail = getUserMail();
        //var emailVerify = user.emailVerified;

        // Set the user's profile pic and name and mail and show.
        //userPicElement.src = addSizeToGoogleProfilePic(profilePicUrl);
        profileDiv.style.display = "";
        userNameElement.innerHTML = userName;
        userNameElement.style.display = "";
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
        userMailElement.style.display = "";
        //userPicElement.style.display = "";

        // Hide sign-in button.
        loginPageButton.style.display = "none";
        loginPageButtonDrpMenu.style.display = "none";
        // Show sign-out button.
        logoutButtonElement.style.display = "";
        uploadBtn.style.display = "";
        notificationsPageBtn.style.display = "";
        logoutButtonElementDrpMenu.style.display = "";
        uploadBtnDrpMenu.style.display = "";
        divider.style.display = "";
        notificationsPageBtnDrpMenu.style.display = "";

        // We save the Firebase Messaging Device token and enable notifications.
    } else { // User is signed out!
        //Hide user's profile and sign-out button.
        profileDiv.style.display = "none";
        userNameElement.style.display = "none";
        userMailElement.style.display = "none";
        //userPicElement.style.display = "none";

        // Show sign-in button.
        loginPageButton.style.display = "";
        loginPageButtonDrpMenu.style.display = "";
        //Hide sign-out Button
        logoutButtonElement.style.display = "none";
        uploadBtn.style.display = "none";
        notificationsPageBtn.style.display = "none";
        logoutButtonElementDrpMenu.style.display = "none";
        uploadBtnDrpMenu.style.display = "none";
        divider.style.display = "none";
        notificationsPageBtnDrpMenu.style.display = "none";
    }
}

function loginPage() {
    window.location.href = "login.html";
}

function notificationsPage() {
    window.location.href = "notifications.html";
}

function contact(postId) {
    if (document.getElementById("messageSendButton") != null) {
        document.getElementById("messageSendButton").remove()
    }
    var but1 = document.createElement("button");
    but1.setAttribute("type", "button");
    but1.setAttribute("data-dismiss", "modal");
    but1.setAttribute("class", "btn btn-success");
    but1.setAttribute("onclick", "sendMessage('" + postId + "')");
    but1.setAttribute("id", "messageSendButton");
    but1.innerHTML = "Send";

    var insert = document.getElementById("buttonInput");
    insert.appendChild(but1);
}

function sendMessage(postId) {
    console.log(postId + "<-- postId");
    const authorMessages = firestore.collection("users").doc(postId).collection("ReceivedMessages");
    authorMessages.doc().set({
        content: document.getElementById("emailContentInput").value,
        header: document.getElementById("emailSubjectInput").value,
        sender: firebase.auth().currentUser.uid,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date())
    })
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

function addTag() {
    var tagValue = document.getElementById("uploadTagInput").value;
    if (tagValue != "choose") {
        var tag = document.createElement("button");
        tag.setAttribute("class", "btn btn-primary mt-3 mr-3 rounded-pill");
        tag.setAttribute("onclick", "this.parentNode.removeChild(this)");
        tag.innerHTML = tagValue;
        document.getElementById("tagList").appendChild(tag);
    }


}

function openDeleteModal(docId) {
    document.getElementById("deleteButton").setAttribute("data-postid", docId);
}

function isAuthorizedToDeletDoc(documentId) { //returns true if currentUser==documentId.author
    //TODO
}

function deletePost(docId) {
    console.log(docId);
    //TODO: delete docId
    //isAuthorizedToDeleteDoc(docId);    <--- if yes -> continue
    /*firestore.collection("posts").doc(docId).delete().then(function() {
        console.log("Post deleted");
    }).catch(function(error) {
        console.error("Error deleting post: " + error);
    });*/
    //clear Modal
    document.getElementById("deleteButton").setAttribute("data-postid", "");
}

//Shortcuts to Document Elements
//var userPicElement = document.getElementById('user-pic');

var loginPageButton = document.getElementById("LoginPageBtn");
var menuButtonElement = document.getElementById('smallMenu');
var notificationsPageBtn = document.getElementById("NotificationsPageBtn");
var logoutButtonElement = document.getElementById("sign-out");
var uploadBtn = document.getElementById("uploadBtn");
var tagList = document.getElementById("tagList");
var dropDownMenu = document.getElementById("sf");

var notificationsPageBtnDrpMenu = document.getElementById("NotificationsPageBtnDrpMenu");
var logoutButtonElementDrpMenu = document.getElementById("sign-outDrpMenu");
var uploadBtnDrpMenu = document.getElementById("uploadBtnDrpMenu");
var loginPageButtonDrpMenu = document.getElementById("LoginPageBtnDrpMenu");
var divider = document.getElementById("divider");
//var changeEmailButtonModal = document.getElementById("changeEmailButtonModal");

initFirebaseAuth();
