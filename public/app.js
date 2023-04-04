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

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const flexContainer = document.getElementById('flexContainer');
const houseLeaderboard = document.getElementById('houseLeaderboard');

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();


auth.onAuthStateChanged(user => {
    if (user) {
        //user variables
        var house = "";

        //signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hi, ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;

    //console.log(flexContainer);

        const userRef = db.collection("users").doc(user.uid);
        
        userRef.set({
            house: "Red",
            name: user.displayName,
            points: 80
        })
        .then(() => {
            console.log("New user created successfully!");
        })
        .catch((error) => {
            console.error("Error creating new user: ", error);
        });

        //Display user info in userInfo <ul>
        unsubscribe = userRef.onSnapshot((doc) => {
            var data = doc.data();
            userInfo.innerHTML = `
                <li>House: ${data.house}</li>
                <li>Name: ${data.name}</li>
                <li>Points: ${data.points}</li>
                `; 
                house = data.house;

                switch (house) {
                    case "Red":
                        //flexContainer.style.background = "#E74C3C";
                        houseLeaderboard.style.border = "5px solid red";
                        break;
                    case "Blue":
                        //flexContainer.style.background = "#6495ED";
                        houseLeaderboard.style.border = "5px solid blue";
                        break;
                    case "Purple":
                        flexContainer.style.background = "#";
                        break;
                    case "Orange":
                        flexContainer.style.background = "#";
                        break;
                }
        });

        console.log(house);

        //var house = data.house;
        //var house = "Red"

        

    } else {
        //not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});
