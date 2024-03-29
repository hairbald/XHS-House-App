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
let house;

//For new event form
let isSubmitting = false;

const user = firebase.auth().currentUser

const navbar = document.getElementById('navbar');

//const eventInput = document.getElementById('eventInput');
const eventSuggestions = document.getElementById('eventSuggestions');
const eventListDiv = document.getElementById('eventListDiv');
const eventList = document.getElementById('eventList');

const newEventDiv = document.getElementById('new-event-div');
const pointInputSlider = document.getElementById('point-input-slider');
const eventNameInput = document.getElementById('event-name-input');
const submitEventBtn = document.getElementById('submit-event');

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
        <h3><a href="submit.html">Events & Redeem Points</a></h3>
        <h3><a href="rewards.html">Rewards</a></h3>
        <h3><a href="leaderboard.html">Leaderboard</a></h3>
      `;

      if (data.role == "teacher") {
        navbar.innerHTML += `<h3><a href="report.html">Generate a Report</a></h3>`
        newEventDiv.hidden = false;
    }

      house = data.house;

      switch (house) {
        case "Red":
            //setColor("5px solid #C0392B");
            navbar.style.backgroundColor = "#E74C3C";
            break;
        case "Blue":
            //setColor("5px solid #2980B9");
            navbar.style.backgroundColor = "#3498DB";
            break;
        case "Purple":
            //setColor("5px solid #8E44AD");
            navbar.style.backgroundColor = "#9B59B6";
            break;
        case "Orange":
            //setColor("5px solid #E67E22");
            navbar.style.backgroundColor = "#F39C12";
            break;
    }
    });

    //Add events to dropdown (obsolete)
    /*db.collection("events").get().then((snapshot => {
      snapshot.forEach((doc) => {
        const eventName = doc.data().eventName;
        const points = doc.data().points;

        const option = document.createElement('option');
        option.value = points;
        option.textContent = eventName;
        eventInput.appendChild(option);
      })
    }))*/

    //List all events in collection
    db.collection("events").get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const event = doc.data();

          const eventListItem = document.createElement('li');
          eventListItem.innerHTML = `
            ${event.eventName} (${event.points} points)
          `;

          eventList.appendChild(eventListItem);
        });
      });

    /*eventInput.addEventListener('input', () => {
      const inputText = eventInput.value.trim();
      if (inputText.length === 0) {
        eventSuggestions.innerHTML = '';
        return;
      }

      getEventSuggestions(inputText).then(suggestions => {
        eventSuggestions.innerHTML = suggestions.map(suggestion => {
          if (Array.isArray(suggestion)) {
            return `<div>${suggestion.join('')}</div>`;
          } else {
            return `<div>${suggestion}</div>`;
          }
        }).join('');
      });
    });*/

    async function getEventSuggestions(inputText) {
      //get event list
      var eventList = [];

      const querySnapshot = await firebase.firestore().collection('events').get();

      querySnapshot.forEach((doc) => {
        eventList.push(doc.data().eventName);
      });

      console.log(eventList);

      return eventList.filter(eventName => eventName.toLowerCase().startsWith(inputText.toLowerCase()));
    }

    document.getElementById('submit').addEventListener('click', (e) => {
      e.preventDefault();

      //const eventName = document.getElementById('eventInput').value; (obselete method)
      //let pointsEarned;
      //const pointsEarned = parseInt(document.getElementById('eventInput').selectedOptions[0].value);

      const ticketID = document.getElementById('ticket-input').value;
      
      //Lookup ID
      db.collection("tickets").where('ticketID', '==', ticketID).get()
        .then((querySnapshot) => {
          //Ticket does not exist
          if (querySnapshot.empty) {
            console.log("Ticket not found");
            alert("Ticket does not exist.");
          } else {
            const ticketDoc = querySnapshot.docs[0];

            const eventName = ticketDoc.data().eventName;
            const points = ticketDoc.data().points;
            
            //Update user points
            const userRef = db.collection("users").doc(user.uid);
            userRef.update({
              points: firebase.firestore.FieldValue.increment(points)
            })
            .then(() => {
              alert(`You have successfully redeemed ${points} points!`);
            })
          }
        })

      //Retreive info on event entered
      db.collection('events').where('eventName', '==', eventName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          pointsEarned = doc.data().points;
        });

        //add points to user
        const userRef = db.collection("users").doc(user.uid);
        userRef.update({
          points: firebase.firestore.FieldValue.increment(pointsEarned)
        })
        .then(() => {
          console.log(`Gave ${pointsEarned} points to ${user.uid}`);
          //Reset form
          alert(`You have redeemed ${eventName} points!`)
          document.getElementById("eventForm").reset();
        })
        .catch((error) => {
          console.error("It no work (Adding points to user): ", error);
        });
      })
      .catch((error) => {
        console.error("It no work (Couldn't retrieve doc):", error);
      });

    });

    //Create new event functionality
    /*submitEventBtn.addEventListener('click', function(e) {
      e.preventDefault();

      console.log("ijwefijofewjofjoweofjie");

      if (isSubmitting) {
        return;
      }

      var points = pointInputSlider.value;
      var eventName = eventNameInput.value;

      isSubmitting = true;

      console.log(db);

      db.collection("events").add({
        points: points,
        eventName: eventName
      })
      .then(function() {
        //reload page so reward shows up
        location.reload();
      })
    })*/

    //New create event functionality with ticket
    submitEventBtn.addEventListener('click', function(e) {
      e.preventDefault();

      console.log("Yo the button was clicked");

      if (isSubmitting) {
        return;
      }

      var points = pointInputSlider.value;
      var eventName = eventNameInput.value;
      var ticketID = generateID();

      isSubmitting = true;

      console.log(generateID());

      //Add to ticket collection
      db.collection("tickets").add({
        points: points,
        eventname: eventName,
        ticketID: ticketID
      })

      //Add to event collection
      db.collection("events").add({
        points: points,
        eventName: eventName
      })
      .then(function() {
        //Reload the page so the event shows up & show comfirmation alert box
        alert(`
        ${eventName} (${points}) has been registered as a new event!\n
        Ticket ID: ${ticketID}
        `);
        location.reload();
      })

    })

  }
});

function onSliderChange(val) {
  document.getElementById('output').innerHTML = val;
}

function generateID() {
  let result = "";
  const characters = 'ABCDEFabcdef0123456789';
  var length = 4;
  let count = 0;
  while (count < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    count++;
  }

  return result;
}
