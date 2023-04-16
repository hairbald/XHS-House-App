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

  let totalClassPoints;
  let numInClass;
  let sortedUsers;
  
  const user = firebase.auth().currentUser
  
  const navbar = document.getElementById('navbar');
  
  const yearButtons = document.querySelectorAll('input[name="year"]');
  const reportDiv = document.getElementById('report');
  const downloadReport = document.getElementById('download-report');
  
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

      //the report
      document.getElementById('submit').addEventListener('click', (e) => {
        e.preventDefault();

        let users = [];
        sortedUsers = [];

        totalClassPoints = 0;
        numInClass = 0;

        db.collection("users").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) =>  {
            const selectedYear = document.querySelector('input[name="year"]:checked').selected;
            users.push({
              name: doc.data().name,
              points: doc.data().points,
              graduationYear: doc.data().graduationYear
            });

            sortedUsers = users.filter(checkYear);

          });

          console.log(sortedUsers);

          reportDiv.innerHTML = "";

          sortedUsers.forEach((user) => {
            const userDiv = document.createElement('div');
            userDiv.style.fontSize = "medium";
            userDiv.innerHTML = `${user.name}  - ${user.points} points`;
            reportDiv.appendChild(userDiv);

            totalClassPoints += user.points;
            numInClass++;
          });

        });
        


      });

      //Generate PDF of report
      downloadReport.addEventListener('click', () => {
        let doc = new jsPDF();


        const selectedYear = document.querySelector('input[name="year"]:checked').value;

        doc.setFontSize(20);
        doc.text(`Class of ${selectedYear} Report`, 15, 15);
        
        doc.setFontSize(11);
        doc.text(`Class total: ${totalClassPoints} points`, 15, 30);
        doc.text(`Class average: ${totalClassPoints / numInClass} points`, 15, 35)

        const mostPointsUser = sortedUsers.sort((a, b) => b.points - a.points)[0];
        doc.text(`Most points: ${mostPointsUser.name} - ${mostPointsUser.points} points`, 15, 40);

        sortedUsers.sort((a, b) => a.points - b.points);
        doc.text(`Least points: ${sortedUsers[0].name} - ${sortedUsers[0].points} points`, 15, 45);

        doc.fromHTML(reportDiv.innerHTML, 15, 60);

        doc.save("report.pdf");

      });

      });
  
      


      

    }
  });

  function checkYear(sorted) {
    const selectedYear = document.querySelector('input[name="year"]:checked').value;
    return sorted.graduationYear == selectedYear;
  }
