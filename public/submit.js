// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBDEUVPJjFC6-Q_HQvNyH9uvxCpYoSTBsM",
    authDomain: "xhs-house-app.firebaseapp.com",
    projectId: "xhs-house-app",
    storageBucket: "xhs-house-app.appspot.com",
    messagingSenderId: "776582590026",
    appId: "1:776582590026:web:77e7177429c171e345c0b3",
    measurementId: "G-K2X4P92BB9"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let unsubscribe;

const user = firebase.auth().currentUser

const navbar = document.getElementById('navbar');

const eventInput = document.getElementById('eventInput');
const eventSuggestions = document.getElementById('eventSuggestions');

console.log("test");

auth.onAuthStateChanged(user => {
  if (user) {

    const userRef = db.collection("users").doc(user.uid);

    unsubscribe = userRef.onSnapshot((doc) => {
      var data = doc.data();

      navbar.innerHTML = `
        <img id="userPhoto" src="${user.photoURL}" alt="Profile Photo" width="48" height="48">
        <h3>Hi, ${user.displayName}!</h3>
        <h3>Points: ${data.points}</h3>
        <h3><a href="index.html">Home</a></h3>
        <h3><a href="submit.html">Redeem Points</a></h3>
        `
    });

    eventInput.addEventListener('input', () => {
      const inputText = eventInput.value.trim();
      if (inputText.length === 0) {
        eventSuggestions.innerHTML = '';
        return;
      }

      const suggestions = getEventSuggestions(inputText);
      eventSuggestions.innerHTML = suggestions.map(suggestion => {
        if (Array.isArray(suggestion)) {
          return `<div>${suggestion.join('')}</div>`;
        } else {
          return `<div>${suggestion}</div>`;
        }
      }).join('');
    });

    function getEventSuggestions(inputText) {
      //get event list
      var events = ['Soccer Game', 'Volleyball Game', 'Jazz Concert', 'Theatre Play', 'Softball Game'];

      return events.filter(event => event.toLowerCase().startsWith(inputText.toLowerCase()));
    }

  }
})