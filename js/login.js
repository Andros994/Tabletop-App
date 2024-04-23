var email, psw;

window.onload = () => {
    const transitionElement = document.querySelector('.transition')
    setTimeout(() => {
        transitionElement.classList.remove('is-active');
    }, 200)
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
    $(document).on('click', '#login', function(){
        email = $('#email').val();
        psw = $('#psw').val();

        signInWithEmailAndPassword(auth, email, psw)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;

                const dt = new Date();

                update(ref(database, 'users/' + user.uid), {
                    last_login: dt
                })

                if (user.emailVerified){
                    // Setto l'authentication nella sessione
                    sessionStorage.setItem('auth', JSON.stringify(user));
                    //todo reindirizzare alla homePage
                    window.location.href = "../pages/home.html";
                } else {
                    Swal.fire("Email non verificata", "Controlla tra le mail indesiderate se hai ricevuto una mail di verifica", "warning");
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                if (errorCode == "auth/invalid-email"){
                    Swal.fire("Errore!", "Email non trovata", "warning")
                }
            });

    })
})

