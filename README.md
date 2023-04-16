# XHS-House-App

<h1 align="center">XHS House App</h1>

<p align="center">Web app I'm writing for FBLA 2023 Coding and Programming</p>
<br/>
<p>Developed by Harry Baldwin</p>
<p>Libraries used</p>
<table>
  <tr>
    <th>Lib</th>
    <th>Purpose</th>
    <th>Link</th>
  </tr>
  <tr>
    <td>Firebase</td>
    <td>Hosting and user authentication with Google</td>
    <td>https://firebase.google.com</td>
  </tr>
  <tr>
    <td>Firestore</td>
    <td>NoSQL cloud-based database</td>
    <td>https://firebase.google.com/docs/firestore</td>
  </tr>
  <tr>
    <td>jsPDF</td>
    <td>Uses JS to generate PDF documents</td>
    <td>https://github.com/parallax/jsPDF</td>
  </tr>
</table>
<br/>

<div>
  <h2>Logging In</h2>
  <p>The <a href="https://xhs-house-app.web.app">home screen</a> has a button to sign in with Google. This will be used to retreieve credentials from your Google account such as your name, email address, and profile photo. You cannot proceed unless you sign in with your Google account.</p><br/>
  <img src="public/images/documentation/login.png"><br/>
  <h3>Registering</h3>
  <p>To access most of the entirety of the website you must be a registered user within the school. Accounts with teacher permissions can register users at the bottom of the home page if they are logged in and have the teacher role.</p><br/>
  <img src="public/images/documentation/register-new-user.png"><br/>

  <h2>The Home Page</h2>
  <img src="public/images/documentation/home.png"><br/>
  <p>The home page is the center of the app. It includes the navbar to get to every accessible page on the website, information related to your account, and (special to the home navbar,) a sign-out button. There is also a tally of every houses' points from the users that belong to them. The student leaderboard on the home page shows the top 10 users ranked by their point count, but a link is under it to view the <a>full leaderboard</a>.</p><br/>
  <p>Accounts with teacher permissions will see a form to <a href="#registering">register new users</a>.</p>
</div>
