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
const addPointsBtn = document.getElementById('addPointsBtn');

const userDetails = document.getElementById('userDetails');

const navbar = document.getElementById('navbar');
const flexContainer = document.getElementById('flexContainer');
const houseLeaderboard = document.getElementById('houseLeaderboard');

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

let house = "unknown";

auth.onAuthStateChanged(user => {
    if (user) {
        //user variables
        //var house = "";

        //signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        //userDetails.innerHTML = `<h3>Hi, ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;

        

        const userRef = db.collection("users").doc(user.uid);
        
        userRef.get().then(doc => {
            if (doc.exists) {
                console.log("User already exists:", doc.data());
                house = doc.data().house;

            } else {
                //Lookup student
                db.collection("students").where("name", "==", user.displayName).get()
                .then(querySnapshot => {
                    if (!querySnapshot.empty) {
                        //Get the student's house
                        house = querySnapshot.docs[0].data().house;

                        //set initial values
                        userRef.set({
                            house: house,
                            name: user.displayName,
                            points: 80
                        })
                    }
                })
                .then(() => {
                    console.log("New user created successfully!");
                })
                .catch((error) => {
                    console.error("Error creating new user: ", error);
                });
            }
        })

        addPointsBtn.onclick = () => 
            userRef.update({
                points: firebase.firestore.FieldValue.increment(10)
            })
            .then(() => {
                console.log("Points updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating points: ", error);
            });

        //Display user info in userInfo <ul>
        unsubscribe = userRef.onSnapshot((doc) => {
            var data = doc.data();

            userInfo.innerHTML = `
                <li>House: ${data.house}</li>
                <li>Name: ${data.name}</li>
                <li>Points: ${data.points}</li>
                `; 

            navbar.innerHTML = `
                <img id="userPhoto" src="${user.photoURL}" alt="Profile Photo" width="48" height="48">
                <h3>Hi, ${user.displayName}!</h3>
                <h3>Points: ${data.points}</h3>
                <h3><a href="index.html">Home</a></h3>
                <h3><a href="submit.html">Redeem Points</a></h3>
                `;


            house = data.house;

                switch (house) {
                    case "Red":
                        flexContainer.style.border = "5px solid #C0392B";
                        houseLeaderboard.style.border = "5px solid #C0392B";
                        break;
                    case "Blue":
                        flexContainer.style.border = "5px solid #2980B9";
                        houseLeaderboard.style.border = "5px solid #2980B9";
                        break;
                    case "Purple":
                        flexContainer.style.border = "5px solid #8E44AD";
                        houseLeaderboard.style.border = "5px solid #8E44AD";
                        break;
                    case "Orange":
                        flexContainer.style.border = "5px solid #D35400";
                        houseLeaderboard.style.border = "5px solid #D35400";
                        break;
                }
        });
    

    } else {
        //not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});
