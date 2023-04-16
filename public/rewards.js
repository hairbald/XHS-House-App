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

  //For new prize form
  var isSubmitting = false;
  
  const user = firebase.auth().currentUser
  
  const navbar = document.getElementById('navbar');
  
  const rewardsProgress = document.getElementById('rewardsProgress');
  const markersDiv = document.getElementById('markers');
  const prizesDiv = document.getElementById('prizes');
  const winnerMessage = document.getElementById('winnerMessage');
  const newPrizeName = document.getElementById('newPrizeName');
  const newEventDiv = document.getElementById('newEventDiv');
  const pointsInputSlider = document.getElementById('pointInputSlider');
  const submit = document.getElementById('submit');
  
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

      rewardsProgress.value = doc.data().points;

      var prizesArray = [];

      db.collection("rewards").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            prizesArray.push({
                points: doc.data().points,
                prize: doc.data().prize
            });
        });
        console.log(prizesArray);

        const progressPercentage = (doc.data().points / 5000) * 100;
  
        let users = [];

        db.collection("users").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            users.push({
              name: doc.data().name,
              points: doc.data().points
            });
          });
        })

        console.log(users);

        prizesArray.forEach(item => {
          const percentage = (item.points / 5000) * 100;
  
          const marker = document.createElement('div');
          marker.classList.add('marker');
          marker.style.left = `${percentage}%`;
          markersDiv.appendChild(marker);
  
          const prize = document.createElement('div');
          prize.classList.add('prize');
          prize.innerHTML = `${item.points} points: ${item.prize}`;
          prize.style.left = `${percentage}%`;
          markersDiv.appendChild(prize);

          if (data.role == "teacher") {
          newEventDiv.hidden = false;
          
            const winnerText = document.createElement('div');
          winnerText.classList.add('winner-text');
          prize.appendChild(winnerText);

          const button = document.createElement('button');
          button.classList.add('winner-button');
          button.innerHTML = "Choose a Winner";
          prize.appendChild(button);

          button.addEventListener('click', () => {
            const eligibleUsers = users.filter(user => user.points >= item.points);
            const winnerIndex = Math.floor(Math.random() * eligibleUsers.length);
            const winner = eligibleUsers[winnerIndex];

            if (winner) {
              winnerText.innerHTML = `Winner: ${winner.name}`;
              console.log(winner.name);
              winnerMessage.innerHTML = `
                <h3>${winner.name} won ${item.prize}!</h3>
              `;
            } else {
              winnerText.innerHTML = `No winner found.`;
            }

          });

          submit.addEventListener('click', function(e) {
            e.preventDefault();

            if (isSubmitting) {
              return;
            }

            var points = pointsInputSlider.value;
            var prize = newPrizeName.value;

            isSubmitting = true;

            db.collection("rewards").add({
              points: points,
              prize: prize
            })
            .then(function() {
              //reload page so reward shows up
              location.reload();
            })
          })

        }

      });
      

      
      });
      

      });
      
  
      
      
  
    }
    
  });
  
  function onSliderChange(val) {
    document.getElementById('output').innerHTML = val;
  }
