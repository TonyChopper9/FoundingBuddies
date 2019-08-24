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

window.onload = function() {
  total = 0;
  firestore.collection("posts").orderBy("Date", "desc").get().then(function (list) {
    total = list.size;
    var i = 0;
    list.forEach((doc) => {
      i++;
      if (i <= 30) {
        if (i <= 10) {
          addDocument(doc.id, true, i)
        } else {
          addDocument(doc.id, false, i)
        }
      }
    });
  });
};

function addDocument(docId, visibility, number) {
  const docRef = firestore.collection("posts").doc(docId);
  var mainDocData = null;
  docRef.get().then(function (doc) {
    if (doc && doc.exists){
      mainDocData = doc.data();

      if (mainDocData != null) {
        var element = document.createElement("div");
        element.setAttribute("class", "card mb-3 w-100");
        element.setAttribute("id", docId);
        element.setAttribute("id2", number);
        if(!visibility){element.setAttribute("style", "display: none;")}

        var innerElement = document.createElement("div");
        innerElement.setAttribute("class", "card-body");

        //HEADER
        var header1 = document.createElement("h5");
        header1.setAttribute("class", "mb-0 card-title");
        header1.innerHTML = mainDocData.header;
        var closeBtn = document.createElement("button");
        closeBtn. setAttribute("type", "button");
        closeBtn. setAttribute("class", "close");
        var closeBtnText = document.createElement("span");
        closeBtnText.innerHTML = "&times;";
        closeBtn.appendChild(closeBtnText);
        innerElement.appendChild(header1);

        //AUTHORING
        const userRef = firestore.collection("users").doc(mainDocData.user);
        var user = null;

        userRef.get().then(function (smh) {

          var metaStuff = document.createElement("p");
          metaStuff.setAttribute("class", "mb-2 card-text");
          var small = document.createElement("small");
          small.setAttribute("class", "text-muted");
          //var linkName = document.createElement("a");
          //linkName.setAttribute("href", "#");

          //User
          user = smh.data();
          var dateDate = mainDocData.Date.toDate();
          small.innerHTML = dateDate.getDate() + "." + dateDate.getMonth() + "." + dateDate.getFullYear() + " by " + user.Username;
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

          /*
          if (number %= 0) {
          var pageTurner = document.createElement("nav");
          pageTurner.setAttribute("class", "blog-pagination");
          var older = document.createElement("a");
          older.setAttribute("class", "btn btn-outline-primary");
          older.setAttribute("onclick", "nextPage()");
          older.innerHTML = "Older";
          var newer = document.createElement("a");
          newer.setAttribute("class", "btn btn-outline-primary");
          newer.setAttribute("onclick", "prevPage()");
          newer.innerHTML = "Newer";
          pageTurner.appendChild(older);
          pageTurner.appendChild(newer);

          theDiv.appendChild(pageTurner);
          }
          */

          //add close Button if user is authorized
          if(user.id == mainDocData.user){
            header1.appendChild(closeBtn);
          }

        }).catch(function (error) {
          console.log("Error: ", error);
        });
      }
    }
  }).catch(function (error) {
    console.log("Error: ", error);
  });
}

function nextPage() {

  firebase.firestore().collection("users").doc("JHANSotw749yojnmC0am").set({
    Username: "testusername",
    mail: "email"
  }).catch(function (error){console.log(error)});

  console.log(page + "<--");
  console.log(Math.floor(total / 10) + "<--");
  if (page < Math.floor(total / 10)) {
    page++;
    if (page >= 3) {
      firestore.collection("posts").get().then(function (list) {
        var i = 0;
        list.forEach((doc) => {
          i++;
          if (i > 30) {
            addDocument(doc.id, false, i)
          }
        })
      });
    }
    var x = 1;
    for (x = 1; x <= 10; x++) {
      var id2a = ((page - 1) * 10) + x;
      if (id2a <= total) {
        document.querySelector('[id2="' + id2a + '"]').setAttribute("style", "display: none;")
      }
    }
    var y = 1;
    for (y = 1; y <= 10; y++) {
      var id2n = (page * 10) + y;
      if (id2n <= total) {
        document.querySelector('[id2="' + id2n + '"]').setAttribute("style", "display: inline;")
      }
    }
  }
}

//TODO: FIX
function prevPage() {
  if (page > 0) {
    page--;
    var x2 = 1;
    for (x2 = 1; x2 <= 10; x2++) {
      var id2a = ((page + 1) * 10) + x2;
      if (id2a <= total) {
        document.querySelector('[id2="' + id2a + '"]').setAttribute("style", "display: none;")
      }
    }
    var y2 = 1;
    for (y2 = 1; y2 <= 10; y2++) {
      var id2n = (page * 10) + y2;
      if (id2n <= total) {
        document.querySelector('[id2="' + id2n + '"]').setAttribute("style", "display: inline;")
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
  postRef.doc()
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
  return firebase.auth().currentUser.uid;
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
  return firebase.auth().currentUser.displayName;
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

    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    //load chat Messages
    //loadMessages();

    //if (profilePicUrl == "") {
    //  profilePicUrl = "media/usericon.png";
    //}

    // Set the user's profile pic and name.
    //userPicElement.src = addSizeToGoogleProfilePic(profilePicUrl);
    //userNameElement.textContent = userName;

    //Show user's profile and sign-out button.
    //userNameElement.style.display = "";
    //userPicElement.style.display = "";

    // Hide sign-in button.
    loginPageButton.style.display = "none";
    // Show sign-out button.
    logoutButtonElement.style.display = "";
    uploadBtn.style.display = "";
    notificationsPageBtn.style.display = "";

    // We save the Firebase Messaging Device token and enable notifications.
  } else { // User is signed out!
    //Hide user's profile and sign-out button.
    //userNameElement.style.display = "none";
    //userPicElement.style.display = "none";

    // Show sign-in button.
    loginPageButton.style.display = "";
    //Hide sign-out Button
    logoutButtonElement.style.display = "none";
    uploadBtn.style.display = "none";
    notificationsPageBtn.style.display = "none";
  }
}

function loginPage(){
  window.location.href = "login.html";
}

function notificationsPage(){
  window.location.href = "notifications.html";
}

function contact(postId) {
  if(document.getElementById("messageSendButton") != null){
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
    sender: firebase.auth().currentUser.uid
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
function menuicon(x) {
  x.classList.toggle("change");
}


//Shortcuts to Document Elements
//var userPicElement = document.getElementById('user-pic');
//var userNameElement = document.getElementById('user-name');
var loginPageButton = document.getElementById("LoginPageBtn");
var menuButtonElement = document.getElementById('smallMenu');
//var emailContentInput = document.getElementById('emailContentInput');
//var emailSubjectInput = document.getElementById('emailSubjectInput');
//var refPostEmail = document.getElementById("refPostEmail");
var notificationsPageBtn = document.getElementById("NotificationsPageBtn");
var logoutButtonElement = document.getElementById("sign-out");
var uploadBtn = document.getElementById("uploadBtn");

// Add Listener
//signOutButtonElement.addEventListener('click', signOut);
//loginPageButton.addEventListener("click", loginPage);
//notificationsPageBtn.addEventListener("click", notificationsPage);

initFirebaseAuth();
