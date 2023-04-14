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
  
  const user = firebase.auth().currentUser
  
  const navbar = document.getElementById('navbar');
  
  const yearButtons = document.querySelectorAll('input[name="year"]');
  
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
        `;
  
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
  
      //the report
      yearButtons.forEach(button => {
        button.addEventListener('change', () => {
          updateReport(button.value);
        });
      });

      updateReport(data.graduationYear);


      

    }
  });
  
  function updateReport(graduationYear) {
    db.collection("users")
      .where('graduationYear', '==', graduationYear)
      .get()
      .then((querySnapshot) => {
        let reportHTML = "";
        querySnapshot.forEach((doc) => {
          reportHTML += `<p>${doc.data().name}: ${doc.data().points} points</p>`;
        });
        report.innerHTML = reportHTML
      })
  }
