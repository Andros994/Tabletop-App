var userLogged, tagList = [], listaRichieste = [], selectedRequest = {}, creatorInfo = {};

window.onload = () => {
    const transitionElement = document.querySelector('.transition')
    setTimeout(() => {
        transitionElement.classList.remove('is-active');
    }, 200)
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

import { 
    getDatabase, 
    get ,
    ref,
    child
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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

const authLogged = JSON.parse(sessionStorage.getItem('auth'));
const uid = authLogged.uid;
userLogged = JSON.parse(sessionStorage.getItem('userLogged'));
  
const app = initializeApp(firebaseConfig);
// Real time DB
const database = getDatabase(app);

$(document).ready(function(){
    getAllUsers();

})

function getAllUsers() {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/`  )).then((snapshot) => {
      if (snapshot.exists()) {
        var arrayUsers = Object.values(snapshot.val());
        populateMap(arrayUsers);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

function populateMap(arrayUtenti) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (location) {
        var map = L.map('map').setView([location.coords.latitude, location.coords.longitude], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        arrayUtenti.forEach(element => {
            if (element.latitude != "" && element.longitude != "" && element.latitude != undefined && element.longitude != undefined){
                var marker = L.marker([element.latitude, element.longitude]).addTo(map);
                var whAppBtn = "", fbBtn = "", igBtn = "";
                element.telefono != "" ? whAppBtn = `<a href="https://wa.me/${element.telefono}" target="_blank"><i class="fa-brands fa-whatsapp whatsapp fa-xl" style="margin-right: 5px;"></i></a>` : "" 
                element.fbLink != "" ? fbBtn = `<a href="${element.fbLink}" target="_blank"><i class="fa-brands fa-facebook facebook fa-xl" style="margin-right: 5px;"></i></a>` : "" 
                element.igLink != "" ? igBtn = `<a href="${element.igLink}" target="_blank"><i class="fa-brands fa-instagram instagram fa-xl" style="margin-right: 5px;"></i></a>` : "" 
              
                marker.bindPopup(`
                <div class="">
                    <div class="card-title"><i class="fa-solid fa-user text-black" style="margin-right: 5px;"></i>${element.username}</div>
                    <div class="card-body">
                        <p><i class="fa-solid fa-envelope text-black" style="margin-right: 5px;"></i>${element.email}</p>
                        <p><i class="fa-solid fa-phone text-black" style="margin-right: 5px;"></i>${element.telefono}</p>
                        <div class="d-flex" style="justify-content: space-between">
                            ${whAppBtn}
                            ${fbBtn}
                            ${igBtn}
                        </div>
                    </div>
                </div>
                `)
            }
        });
    });
    } else {
        Swal.fire({
            title: "Errore di geolocalizzazione", 
            text: "Questo browser non supporta la geolocalizzazione", 
            icon: "warning"
        })
    }
}
