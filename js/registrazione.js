window.onload = () => {
    const transitionElement = document.querySelector('.transition')
    setTimeout(() => {
        transitionElement.classList.remove('is-active');
    }, 200)
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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

var username, psw, confirmPsw, email;

$(document).ready(function(){
    $(document).on("click", "#registrazione", function(){
        username = $('#username').val();
        email = $('#email').val();
        psw = $('#psw').val();
        confirmPsw = $('#confirmPsw').val();

        // if (username == ""){
        //     Swal.fire({title: 'Errore!',text: 'Username obbligatorio',icon: 'error'})
        //     return
        // }
        if (email == ""){
            Swal.fire({title: 'Errore!',text: 'Email obbliagatoria',icon: 'error'})
            return
        }
        if (psw == "" || (psw != confirmPsw)){
            Swal.fire({title: 'Errore!',text: 'La password non deve essere vuota e le password devono combaciare',icon: 'error'})
            return
        }

        // creo l'utente nella collection AuthUsers
        createUserWithEmailAndPassword(auth, email, psw)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;

                // Salvo l'utente anche sulla collection user
                set(ref(database, 'users/' + user.uid), {
                    username: username,
                    email: email,
                    telefono: "",
                    profilePic: "",
                    fbLink: "",
                    igLink: "",
                    bio: ""
                })

                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        Swal.fire({
                            title: "Controlla la mail", 
                            text: "Abbiamo inviato un link di verfica alla mail fornita, effettua il login dopo aver cliccato sul link nella mail",
                            icon: "success",
                            showCancelButton: false,
                        }).then(() => {
                            window.location.href = "/index.html";
                            });
                        })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode == 'auth/email-already-in-use'){
                    Swal.fire('Errore!', "L'email immessa è già in uso", "warning");
                } else {
                    Swal.fire('Errore!', "Errore nella creazione utente", "warning");
                }
            });
        })
})