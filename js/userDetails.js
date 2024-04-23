var username, email, telefono, fbLink, igLink, profilePic="", bio, coords;

window.onload = () => {
    const transitionElement = document.querySelector('.transition')
    setTimeout(() => {
        transitionElement.classList.remove('is-active');
    }, 200)
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
    
    var userLogged = JSON.parse(sessionStorage.getItem('userLogged'));
    profilePic = userLogged.profilePic;
    const id = JSON.parse(sessionStorage.getItem('auth')).uid;

    fillFields(userLogged);

    // Mappa della posizione
    getLocation();
    
    $(document).on("click", '#home', function(){        // torno alla home
        window.location.href = "../pages/home.html";
    })

    $(document).on("change", "#file", readFile);        // cambio immagine profilo

    $(document).on("change", "#posizione", function(){
        if ($(this).val() == "posizioneSi"){
            $('#mapContainer').fadeIn();
        } else {
            $('#mapContainer').fadeOut();
        }
    })

    $(document).on("click", "#aggiorna", function(){
        username = $('#username').val();
        email = $('#email').val();
        telefono = $('#telefono').val();
        fbLink = $('#fbLink').val();
        igLink = $('#igLink').val();
        bio = encodeURI($('#bio').val());

        if ($('#posizione').val() == "posizioneSi"){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (location) {
                    try {
                        var jsonUpdate = {
                            username: username,
                            telefono: telefono,
                            fbLink: fbLink,
                            igLink: igLink,
                            bio: bio,
                            profilePic: profilePic,
                            email: email,
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        }
            
                        update(ref(database, 'users/' + id), jsonUpdate);
            
                        Swal.fire("Modifica effettuata","","success");
                        
                        sessionStorage.setItem('userLogged', JSON.stringify(jsonUpdate));       // Aggionro le info nella sessione
                    }
                    catch (error){
                        console.log(error);
                        Swal.fire("Ops...","Qualcosa è andato storto", "warning");
                    }
                })
            } else {
                Swal.fire({
                    title: "Errore di geolocalizzazione", 
                    text: "Questo browser non supporta la geolocalizzazione", 
                    icon: "warning"
                })
            }
        } else {

        }

        //todo fare update del file sulla collection users/
        try {
            var jsonUpdate = {
                username: username,
                telefono: telefono,
                fbLink: fbLink,
                igLink: igLink,
                bio: bio,
                profilePic: profilePic,
                email: email,
                latitude: "",
                longitude: ""
            }

            update(ref(database, 'users/' + id), jsonUpdate);

            Swal.fire("Modifica effettuata","","success");
            
            sessionStorage.setItem('userLogged', JSON.stringify(jsonUpdate));       // Aggionro le info nella sessione
        }
        catch (error){
            console.log(error);
            Swal.fire("Ops...","Qualcosa è andato storto", "warning");
        }
    })

})

function fillFields(userLogged){
    $('#username').val(userLogged.username);        // username
    $('#email').val(userLogged.email);              // email
    $('#telefono').val(userLogged.telefono);        // telefono
    $('#fbLink').val(userLogged.fbLink);            // link FB
    $('#igLink').val(userLogged.igLink);            // link IG
    $('#bio').val(decodeURI(userLogged.bio));            // bio
    if (userLogged.profilePic == ""){               // immagine profilo
        $('#profilePic').attr('src', '/resources/img/user_placeHolder.jpeg')
    } else {
        $('#profilePic').attr('src', userLogged.profilePic)
    }
}

function readFile() {
  
    if (!this.files || !this.files[0]) return;
      
    const FR = new FileReader();
      
    FR.addEventListener("load", function(evt) {
        profilePic = evt.target.result;
        document.querySelector("#profilePic").src = evt.target.result;
    }); 
      
    FR.readAsDataURL(this.files[0]);
    
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (location) {
        var map = L.map('map').setView([location.coords.latitude, location.coords.longitude], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        var marker = L.marker([location.coords.latitude, location.coords.longitude]).addTo(map);
    });
    } else {
        Swal.fire({
            title: "Errore di geolocalizzazione", 
            text: "Questo browser non supporta la geolocalizzazione", 
            icon: "warning"
        })
    }
}
