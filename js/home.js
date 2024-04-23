var userLogged;

window.onload = () => {
    const transitionElement = document.querySelector('.transition')
    setTimeout(() => {
        transitionElement.classList.remove('is-active');
    }, 200)
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, 
        ref, 
        get, 
        child
    } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8laAxEpUWtSY4ImormM-TEKTZLpAb8RY",
  authDomain: "tabletop-app-397a8.firebaseapp.com",
  databaseURL: "https://tabletop-app-397a8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tabletop-app-397a8",
  storageBucket: "tabletop-app-397a8.appspot.com",
  messagingSenderId: "662870057944",
  appId: "1:662870057944:web:5e4138ba87b7620305c8ad",
  measurementId: "G-NMR7GE5STG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

$(document).ready(function(){

    // dall'username dell'utente loggato cerco quello sulla collection /users
    const authLogged = JSON.parse(sessionStorage.getItem('auth'));
    const userId = authLogged.uid;
    userLogged = JSON.parse(sessionStorage.getItem('userLogged'));
    if (userLogged == null){           // se non ho un userLogged al momento nel sessionStorage lo vado a pescare dalla collection Users
        console.log('userLogged null');
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${userId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                userLogged = snapshot.val();
                sessionStorage.setItem('userLogged', JSON.stringify(userLogged));
            } else {
                console.log("No data available");
            }
            window.location.reload();
        }).catch((error) => {
            console.error(error);
        });
    }

    $('#username').text(userLogged.username);       // setto username
    if (userLogged.profilePic == "") {              // setto immagine profilo
        $('#profilePic').attr('src', '/resources/img/user_placeHolder.jpeg');
    } else {
        $('#profilePic').attr('src', userLogged.profilePic);
    }

    $(document).on("click", '#profilePic', function(){      // vado ai dettagli dell'utente
        window.location.href = "/pages/userDetails.html";
    })

    $(document).on("click", "#logout", function(){
        //todo fare loggout
        window.location.href = "/index.html"
    })

    $(document).on("click", ".nav-link", function(){
        $('.nav-link').removeClass("active");
        $(this).addClass("active");
        var pageName = $(this).attr('pageName');
        $('#mainIframe').attr('src', `/pages/homePages/${pageName}.html`)
    })

    $(document).on("click", "#mobileIcon", function(){
        $('#sideMenu').toggleClass("active");
    })

})