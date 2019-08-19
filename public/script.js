const firebaseConfig = {
  apiKey: "AIzaSyCR21vYC-VOPIqipke-DrTXy_rWM5JwRag",
  authDomain: "foundingbuddies-8f157.firebaseapp.com",
  databaseURL: "https://foundingbuddies-8f157.firebaseio.com",
  projectId: "foundingbuddies-8f157",
  storageBucket: "foundingbuddies-8f157.appspot.com",
  messagingSenderId: "762592768507",
  appId: "1:762592768507:web:a151988d7a9cb394"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

const docRef = firestore.doc("users/15");
const output = document.querySelector("#output");
const btn = document.querySelector("#UploadBtn");

btn.addEventListener("click", function() {
  docRef.get().then(function (doc) {
    if (doc && doc.exists) {
      const myData = doc.data();
      output.innerText = myData.name;
    }
  }).catch(function (error) {
    console.log("Error: ", error);
  })
});
