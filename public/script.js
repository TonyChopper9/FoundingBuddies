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
        element.setAttribute("class", "blog-post");
        element.setAttribute("id", docId);
        //Potentially problematic
        //TODO: "DELETE" USE CASE
        element.setAttribute("id2", number);
        if(!visibility){element.setAttribute("style", "display: none;")}

        /* So soll ein Post aussehen
        <div class="card mb-3 w-100">
          <div class="card-body">
            <h5 class="mb-0 card-title">Creative manufacturing</h5>
            <p class="mb-2 card-text"><small class="text-muted">January 1, 2014 by <a href="#">Hans</a></small></p>
            <p class="card-text">With suppafgag juhegftkjhegtf lkjehtfkleh kjeghkijehag hikkgaelihorting text below as a natural lead-in to additional content.</p>
            <div class="row justify-content-end">
              <a href="#" class="mr-3 btn btn-primary">Contact</a>
            </div>
          </div>
        </div>
        */

        //HEADER
        var header1 = document.createElement("h2");
        header1.setAttribute("class", "blog-post-title");
        header1.innerHTML = mainDocData.header;
        element.appendChild(header1);

        //AUTHORING
        const userRef = firestore.collection("users").doc(mainDocData.user);
        var user = null;

        userRef.get().then(function (smh) {

          var metaStuff = document.createElement("p");
          metaStuff.setAttribute("class", "blog-post-meta");
          var linkName = document.createElement("a");
          linkName.setAttribute("href", "#");

          //User
          user = smh.data();
          var dateDate = mainDocData.Date.toDate();
          metaStuff.innerHTML = dateDate.getDate() + "." + dateDate.getMonth() + "." + dateDate.getFullYear() + " by ";
          metaStuff.appendChild(linkName);
          element.appendChild(metaStuff);
          metaStuff.lastChild.innerHTML = user.Username;

          //TAG ROW
          var divElement = document.createElement("div");
          divElement.setAttribute("class", "row");
          element.appendChild(divElement);

          //ZWISCHENZEILE
          var zeile = document.createElement("hr");
          element.appendChild(zeile);

          //INHALT
          var inhalt = document.createElement("p");
          inhalt.innerHTML = mainDocData.content;
          element.appendChild(inhalt);

          //MAIL ZEILE
          var mailZeile = document.createElement("p");
          mailZeile.innerHTML = "More Information under: " + user.mail;
          element.appendChild(mailZeile);

          var theDiv = document.getElementById("output");
          theDiv.insertBefore(element,theDiv.firstChild);

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
  //TODO: Close Modal on SUBMIT
  postRef.doc().set(inpData);
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
    userPicElement.src = addSizeToGoogleProfilePic(profilePicUrl);
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.style.display = "";

    // Hide sign-in button.
    loginPageButton.style.display = "none";
    // Show sign-out button.
    signOutButtonElement.style.display = "";
    uploadBtn.style.display = "";

    // We save the Firebase Messaging Device token and enable notifications.
    //saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.style.display = "none";

    // Show sign-in button.
    loginPageButton.style.display = "";
    //Hide sign-out Button
    signOutButtonElement.style.display = "none";
    uploadBtn.style.display = "none";
  }
}

function loginPage(){
  window.location.href = "login.html";
}





//Shortcuts to Document Elements
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var loginPageButton = document.getElementById("LoginPageBtn");
var signOutButtonElement = document.getElementById('sign-out');

// Add Listener
signOutButtonElement.addEventListener('click', signOut);
loginPageButton.addEventListener("click", loginPage);

initFirebaseAuth();
