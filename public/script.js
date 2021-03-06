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
var unis = new Map();
unis.set("TUM", "Technische Universität München");
unis.set("LMU", "Ludwig-Maximilians-Universität");
unis.set("UNIBW", "Universität der Bundeswehr München");
unis.set("HM", "Hochschule München");
unis.set("MBS", "Munich Business School");
var params = new Map();
params.set("lastEl", "");
params.set("keyword", "");
params.set("filter", "");
params.set("uni", "");
var pageSize = 2;

window.onload = function () {
    //total = 0;
    //firestore.collection("posts").orderBy("Date", "desc").get().then(function (list) {
    //    total = list.size;
    //    addDocument(list.docs, true, 0);
    //});
    params = getParams(params);
    console.log(params);
    setWebsitefromParams(params);
    nextPage(params.get("lastEl"), params.get("uni"));
};

function debug() {
    console.log(params);
}

function nextPage(lastEl, uni) {
    if (uni == "") {
        if (lastEl == "") {
            var first = firestore.collection("posts").orderBy("Date", "desc").limit(pageSize);
            first.get().then(function (snap) {
                if (snap.size == 0) {
                    console.log("snap empty");
                    return;
                }
                clearOutput();
                for (const post of snap.docs) {
                    firestore.collection("users").doc(post.data().user).get().then(function (user) {
                        buildPost(post.data(), user.data());
                    });
                }
                params.set("lastEl", snap.docs[snap.docs.length - 1]);
                params.set("firstEl", snap.docs[0]);
            });
        } else {    //then load all docs
            console.log("Loading all posts...");
            var first = firestore.collection("posts").orderBy("Date", "desc").startAfter(lastEl).limit(pageSize);
            first.get().then(function (snap) {
                if (snap.size == 0) {
                    console.log("snap empty");
                    return;
                }
                clearOutput();
                for (const post of snap.docs) {
                    firestore.collection("users").doc(post.data().user).get().then(function (user) {
                        buildPost(post.data(), user.data());
                    });
                }
                params.set("lastEl", snap.docs[snap.docs.length - 1]);
                params.set("firstEl", snap.docs[0]);
            });
        }
    } else {
        if (lastEl == "") {
            var first = firestore.collection("posts").where("uni", "==", uni).orderBy("Date", "desc").limit(pageSize);
            first.get().then(function (snap) {
                if (snap.size == 0) {
                    console.log("snap empty");
                    return;
                }
                clearOutput();
                for (const post of snap.docs) {
                    firestore.collection("users").doc(post.data().user).get().then(function (user) {
                        buildPost(post.data(), user.data());
                    });
                }
                params.set("lastEl", snap.docs[snap.docs.length - 1]);
                params.set("firstEl", snap.docs[0]);
            });
        } else {    //then load all docs
            console.log("Loading all posts...");
            var first = firestore.collection("posts").where("uni", "==", uni).orderBy("Date", "desc").startAfter(lastEl).limit(pageSize);
            first.get().then(function (snap) {
                if (snap.size == 0) {
                    console.log("snap empty");
                    return;
                }
                clearOutput();
                for (const post of snap.docs) {
                    firestore.collection("users").doc(post.data().user).get().then(function (user) {
                        buildPost(post.data(), user.data());
                    });
                }
                params.set("lastEl", snap.docs[snap.docs.length - 1]);
                params.set("firstEl", snap.docs[0]);
            });
        }
    }
}

function prevPage(firstEl, uni) {
    if (firstEl == "") {
        return;
    } else {
        if (uni == "") {
            var first = firestore.collection("posts").orderBy("Date", "asc").startAfter(firstEl).limit(pageSize);
            first.get().then(function (snap) {
                if (snap.size == 0) {
                    console.log("snap empty");
                    return;
                }
                clearOutput();
                for (const post of snap.docs) {
                    firestore.collection("users").doc(post.data().user).get().then(function (user) {
                        buildPost(post.data(), user.data());
                    });
                }
                params.set("lastEl", snap.docs[0]);
                params.set("firstEl", snap.docs[snap.docs.length - 1]);
            });
        } else {    //then load all docs
            console.log("Loading all posts...");
            var first = firestore.collection("posts").where("uni", "==", uni).orderBy("Date", "asc").startAfter(firstEl).limit(pageSize);
            first.get().then(function (snap) {
                if (snap.size == 0) {
                    console.log("snap empty");
                    return;
                }
                clearOutput();
                for (const post of snap.docs) {
                    firestore.collection("users").doc(post.data().user).get().then(function (user) {
                        buildPost(post.data(), user.data());
                    });
                }
                params.set("lastEl", snap.docs[0]);
                params.set("firstEl", snap.docs[snap.docs.length - 1]);
            });
        }
    }
}

function buildPost(postData, userData) {

    var element = document.createElement("div");
    element.setAttribute("class", "card mb-3 w-100");
    //element.setAttribute("id", postDATA.id); // probably the post object needed for id

    var innerElement = document.createElement("div");
    innerElement.setAttribute("class", "card-body");

    //HEADER
    var header1 = document.createElement("h5");
    header1.setAttribute("class", "mb-0 card-title");
    header1.innerHTML = postData.header + " - " + unis.get(postData.uni);
    innerElement.appendChild(header1);

    //AUTHORING
    var metaStuff = document.createElement("p");
    metaStuff.setAttribute("class", "mb-2 card-text");
    var small = document.createElement("small");
    small.setAttribute("class", "text-muted");

    //User
    var dateDate = postData.Date.toDate();
    small.innerHTML = dateDate.getDate() + "." + (dateDate.getMonth() + 1) + "." + dateDate.getFullYear() + " by " + userData.Username;
    metaStuff.appendChild(small);
    innerElement.appendChild(metaStuff);

    //INHALT
    var inhalt = document.createElement("p");
    inhalt.setAttribute("class", "text-brake card-text");
    inhalt.innerHTML = postData.content;
    innerElement.appendChild(inhalt);

    //MAIL ZEILE
    var mailZeile = document.createElement("div");
    mailZeile.setAttribute("class", "row justify-content-end");
    var contactB = document.createElement("button");
    contactB.setAttribute("class", "mr-3 btn btn-j3");
    contactB.setAttribute("data-toggle", "modal");
    contactB.setAttribute("data-target", "#messageModal");
    contactB.setAttribute("onclick", "contact('" + postData.user + "')");
    contactB.innerHTML = "Contact";
    mailZeile.appendChild(contactB);
    innerElement.appendChild(mailZeile);

    element.appendChild(innerElement);

    var theDiv = document.getElementById("output");
    theDiv.appendChild(element);
}

function insertParam(key, value) {
    //key = encodeURI(key); value = encodeURI(value);

    var kvp = document.location.search.substr(1).split('&');

    var i = kvp.length;
    var x;
    while (i--) {
        x = kvp[i].split('=');

        if (x[0] == key) {
            if (value == "") {
                kvp.splice(i, 1);
                break;
            }
            x[1] = value;
            kvp[i] = x.join('=');
            break;
        }
    }
    if (i < 0) {
        kvp.push([key, value].join('='));
    }
    if (kvp[0] == "") {
        kvp.shift();
    }
    document.location.search = kvp.join('&');
}

function getParams(params) {
    var kvp = document.location.search.substr(1).split('&');
    params.forEach(function (value, key) {
        kvp.forEach(function (item) {
            var pair = item.split("=");
            if (key == pair[0]) {
                params.set(key, pair[1]);
            }
        });
    });
    return params;
}

function setWebsitefromParams(params) {
    document.getElementById("uniFilter").value = params.get("uni");
}

/*function addDocument(docs, visibility, number) {
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
            header1.innerHTML = mainDocData.header + " - " + unis.get(mainDocData.uni);
            innerElement.appendChild(header1);

            //CLOSE BUTTON
            var closeBtn = document.createElement("button");
            closeBtn.setAttribute("type", "button");
            closeBtn.setAttribute("class", "close");
            closeBtn.setAttribute("data-toggle", "modal");
            closeBtn.setAttribute("data-target", "#deleteModal");
            closeBtn.setAttribute("onclick", "openDeleteModal('" + docs[number].id + ", " + number + "')");
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
                contactB.setAttribute("class", "mr-3 btn btn-j3");
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
*/

function clearOutput() {
    const myNode = document.getElementById("output");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function checkIfEmpty(string) {
    if (string.replace(/\s/, "").length < 1) {
        return true;
    }
    return false;
}

function upload() {
    if (firebase.auth().currentUser.emailVerified) {
        const postRef = firestore.collection("posts");
        const inputHeader = document.querySelector("#uploadTitleInput");
        const inputContent = document.querySelector("#uploadContentInput");
        if (checkIfEmpty(inputHeader.value)) {
            alert("Your Header is empty");
            return;
        }
        if (checkIfEmpty(inputContent.value)) {
            alert("Your description is empty");
            return;
        }
        var options = document.getElementById("uploadTagInput");
        var uni = options.options[options.selectedIndex].value;
        const inpData = {
            Date: firebase.firestore.Timestamp.fromDate(new Date()),
            content: inputContent.value,
            header: inputHeader.value,
            user: getUserId(),
            uni: uni
        };
        clearUploadModal();
        postRef.doc().set(inpData).then(na => {
            document.location.reload()
        });
    } else {
        alert("Your email must be confirmed in order to be able to upload!")
    }
}

function clearUploadModal() {
    document.getElementById("uploadTitleInput").value = "";
    document.getElementById("uploadContentInput").value = "";
    var e = document.getElementById("uploadTagInput");
    e.options[e.selectedIndex].removeAttribute("selected");
    e.options[0].selected = true;

}

function clearMessageModal() {
    document.getElementById("emailSubjectInput").value = "";
    document.getElementById("emailContentInput").value = "";
}

function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut().then(na => {
        document.location.reload()
    });
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
        console.error(error);
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
        console.log(user);
        // Hide sign-in button.
        loginPageButton.style.display = "none";
        loginPageButtonDrpMenu.style.display = "none";
        // Show sign-out button.
        logoutButtonElement.style.display = "";
        uploadBtn.style.display = "";
        notificationsPageBtn.style.display = "";
        logoutButtonElementDrpMenu.style.display = "";
        //uploadBtnDrpMenu.style.display = "";
        divider.style.display = "";
        notificationsPageBtnDrpMenu.style.display = "";

        firestore.collection("users").doc(user.uid).onSnapshot(function(doc) {
            if (doc.data().newMessage) {
                document.getElementById("NotificationsPageBtn").className += " pulseClass";
                document.getElementById("notifiyDot").style.display = "";
            }
            else {
                document.getElementById("NotificationsPageBtn").classList.remove("pulseClass");
                document.getElementById("notifiyDot").style.display = "none";
            }
        });

    } else { // User is signed out!
        // Show sign-in button.
        loginPageButton.style.display = "";
        loginPageButtonDrpMenu.style.display = "";
        //Hide sign-out Button
        logoutButtonElement.style.display = "none";
        uploadBtn.style.display = "none";
        notificationsPageBtn.style.display = "none";
        logoutButtonElementDrpMenu.style.display = "none";
        //uploadBtnDrpMenu.style.display = "none";
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

function aboutPage() {
    window.location.href = "about.html";
}

function contact(userId) {
    if (document.getElementById("messageSendButton") != null) {
        document.getElementById("messageSendButton").remove()
    }
    var but1 = document.createElement("button");
    but1.setAttribute("type", "button");
    but1.setAttribute("data-dismiss", "modal");
    but1.setAttribute("class", "btn btn-j2");
    but1.setAttribute("onclick", "sendMessage('" + userId + "')");
    but1.setAttribute("id", "messageSendButton");
    but1.innerHTML = "Send";

    var insert = document.getElementById("buttonInput");
    insert.appendChild(but1);
}

function sendMessage(userId) {
    if (firebase.auth().currentUser != null) {
        if (firebase.auth().currentUser.emailVerified) {
            firestore.collection("users").doc(userId).get().then(user => {
                const userData = user.data();
                firestore.collection("users").doc(userId).set({
                    newMessage: true,
                    Username: userData.Username,
                    mail: userData.mail
                });
            });
            const authorMessages = firestore.collection("users").doc(userId).collection("ReceivedMessages");
            authorMessages.doc().set({
                content: document.getElementById("emailContentInput").value,
                header: document.getElementById("emailSubjectInput").value,
                sender: firebase.auth().currentUser.uid,
                timestamp: firebase.firestore.Timestamp.fromDate(new Date())
            });
            clearMessageModal();
            alert("Your message has been sent!");
        } else {
            alert("Your email must be confirmed in order to be able to send messages!")
        }
    } else {
        alert("You have to be logged in, in order to be able to send messages!")
    }
}

function openDeleteModal(docId, number) {
    document.getElementById("deleteButton").setAttribute("data-postid", docId);
    document.getElementById("deleteButton").setAttribute("data-postno", number)
}

function deletePost(docIdNo) {
    const StringArray = docIdNo.split(",");
    const docId = StringArray[0];
    const number = StringArray[1];
    console.log(number);
    const docRef = firestore.collection("posts").doc(docId);
    docRef.get().then(function (doc) {
        if (firebase.auth().currentUser.uid == doc.data().user) {
            docRef.delete().then(function () {
                total--; //TODO: Das sieht mir nicht ganz richtig aus; das fliegt uns noch um die Ohren
                document.getElementById("deleteButton").setAttribute("data-postid", "");
                document.getElementById("deleteButton").setAttribute("data-postno", "");
                document.location.reload();
            }).catch(error => {
                console.log(error)
            })
        } else {
            alert("You are not authorized to delete this post!")
        }
    });
}

function search(searchInput) {
    const term = document.getElementById("searchInput").value;
    firestore.collection("posts").where("header", "==", term)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
}

//Shortcuts to Document Elements
//var userPicElement = document.getElementById('user-pic');

var loginPageButton = document.getElementById("LoginPageBtn");
var menuButtonElement = document.getElementById('smallMenu');
var notificationsPageBtn = document.getElementById("NotificationsPageBtn");
var logoutButtonElement = document.getElementById("sign-out");
var uploadBtn = document.getElementById("uploadBtn");
var dropDownMenu = document.getElementById("sf");

var notificationsPageBtnDrpMenu = document.getElementById("NotificationsPageBtnDrpMenu");
var logoutButtonElementDrpMenu = document.getElementById("sign-outDrpMenu");
//var uploadBtnDrpMenu = document.getElementById("uploadBtnDrpMenu");
var loginPageButtonDrpMenu = document.getElementById("LoginPageBtnDrpMenu");
var divider = document.getElementById("divider");
//var changeEmailButtonModal = document.getElementById("changeEmailButtonModal");

/*document.getElementById('uniFilter').onchange = function() {
  var index = this.selectedIndex;
  var value = this.children[index].value;
  console.log(value);
}*/

initFirebaseAuth();

//00FFFF 00A3A3 2EF4F4 5BF7F7 FFFFFF
