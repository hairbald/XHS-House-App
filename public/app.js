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
const navbarParent = document.getElementById('navbarParent');
const flexContainer = document.getElementById('flexContainer');
const houseLeaderboard = document.getElementById('houseLeaderboard');
const studentLeaderboard = document.getElementById('studentLeaderboard');

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

function studentLeaderboardColorPicker(color) {
    switch (color) {
        case "Red":
            return "#C0392B";
            break;
        case "Blue":
            return "#2980B9";
            break;
        case "Purple":
            return "#8E44AD";
            break;
        case "Orange":
            return "#E67E22";
            break;
        
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        calculateHousePoints();
        updateHouseLeaderboard();

        const usersRef = db.collection("users");
        const usersQuery = usersRef.orderBy('points', 'desc').limit(10);

        usersQuery.get().then((querySnapshot) => {
            let rank = 1;
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                const userDiv = document.createElement('div');
                userDiv.style.fontSize = "medium";
                userDiv.style.color = studentLeaderboardColorPicker(user.house);
                userDiv.style.lineHeight = "25px";
                userDiv.innerHTML = `${rank}. ${user.name} - ${user.points}`;
                studentLeaderboard.appendChild(userDiv);
                rank++;
            });
        });

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
                        let role = querySnapshot.docs[0].data().role;
                        let graduationYear = querySnapshot.docs[0].data().graduationYear;

                        //set initial values
                        userRef.set({
                            house: house,
                            name: user.displayName,
                            points: 80,
                            role: role,
                            graduationYear: graduationYear
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
                <h3><a href="submit.html">Events & Redeem Points</a></h3>
                <h3><a href="rewards.html">Rewards</a></h3>
                `;

            if (data.role == "teacher") {
                navbar.innerHTML += `<h3><a href="report.html">Generate a Report</a></h3>`
            }


            house = data.house;

            setColor(house);

        });


    } else {
        //not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

function setColor(color) {
   
    flexContainer.borderRadius = "4px";

    switch (color) {
        case "Red":
            flexContainer.style.border = "10px solid #C0392B";
            flexContainer.style.borderRadius = "4px";
            houseLeaderboard.style.border = "5px solid #C0392B";
            navbarParent.style.backgroundColor = "#E74C3C";
            navbar.style.backgroundColor = "#E74C3C";
            break;
        case "Blue":
            flexContainer.style.border = "10px solid #2980B9";
            houseLeaderboard.style.border = "5px solid #2980B9";
            navbarParent.style.backgroundColor = "#3498DB";
            navbar.style.backgroundColor = "#3498DB";
            break;
        case "Purple":
            flexContainer.style.border = "10px solid #8E44AD";
            houseLeaderboard.style.border = "5px solid #8E44AD";
            navbarParent.style.backgroundColor = "#9B59B6";
            navbar.style.backgroundColor = "#9B59B6";
            break;
        case "Orange":
            flexContainer.style.border = "10px solid #E67E22";
            houseLeaderboard.style.border = "5px solid #E67E22";
            navbarParent.style.backgroundColor = "F39C12";
            navbar.style.backgroundColor = "#F39C12";
            break;
    }
}
