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

function calculateHousePoints() {
    db.collection("users")
        .get()
        .then(querySnapshot => {
            const housePoints = {
                Red: 0,
                Blue: 0,
                Orange: 0,
                Purple: 0,
            };

            querySnapshot.forEach(doc => {
                const userHouse = doc.data().house;
                const userPoints = doc.data().points;
                housePoints[userHouse] += userPoints;
            });

            //Update points in house doc
            Object.entries(housePoints).forEach(([houseName, points]) => {
                db.collection("houses").doc(houseName).update({ points });
            });
        })
        .catch(error => {
            console.log(error);
        });
}

function updateHouseLeaderboard() {
    db.collection("houses")
        .get()
        .then(querySnapshot => {
            let leaderboardHTML = `<h3>House Leaderboard:</h3>`;

            querySnapshot.forEach(doc => {
                const houseName = doc.id;
                const points = doc.data().points;
                leaderboardHTML += `
                    <div>${houseName}: ${points}</div>
                    `;
            });

            houseLeaderboard.innerHTML = leaderboardHTML;
        })
}

auth.onAuthStateChanged(user => {
    if (user) {
        calculateHousePoints();
        updateHouseLeaderboard();

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
                        setColor("5px solid #C0392B");
                        navbar.style.backgroundColor = "#E74C3C";
                        break;
                    case "Blue":
                        setColor("5px solid #2980B9");
                        navbar.style.backgroundColor = "#3498DB";
                        break;
                    case "Purple":
                        setColor("5px solid #8E44AD");
                        navbar.style.backgroundColor = "#9B59B6";
                        break;
                    case "Orange":
                        setColor("5px solid #E67E22");
                        navbar.style.backgroundColor = "#F39C12";
                        break;
                }

                //Add points to house

        });


    } else {
        //not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

function setColor(color) {
    flexContainer.style.border = color;
    houseLeaderboard.style.border = color;
}
