var listaEventi = [];

window.onload = () => {
    const transitionElement = document.querySelector('.transition')
    setTimeout(() => {
        transitionElement.classList.remove('is-active');
    }, 200)
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

import { 
    getFirestore, 
    getDocs, 
    collection 
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const eventiRef = collection(db, 'eventi');

$(document).ready(function(){
    const authLogged = JSON.parse(sessionStorage.getItem('auth'));
    const uid = authLogged.uid;
    var userLogged = JSON.parse(sessionStorage.getItem('userLogged'));

    getEventi();
})

function getEventi(){
    getDocs(eventiRef).then((snapShot) => {
        snapShot.docs.forEach((doc) => {
            listaEventi.push({  id: doc.id, ...doc.data()});
        });
        popolaEventi(listaEventi);
    })
    .catch(err => {
        console.log(err);
    });

}

function popolaEventi(array){
    array.forEach(element => {
        var card = `
        <div class="card gameCard bg-dark navbar-dark">
            <img class="card-img-top" src="${element.immagine}">
            <div class="card-body">
                <div class="card-title">
                    <div class="cardTitle">
                        <h5>${element.titolo}</h5>
                    </div>
                </div>
                <hr class="text-white">
                <p class="card-text"><i class="fa-solid fa-calendar" style="margin-right: 10px;"></i>${element.data}</p>
                <p class="card-text"><i class="fa-solid fa-location-dot" style="margin-right: 10px;"></i>${element.luogo}</p>
                <p class="card-text">${element.descrizione}</p>
                <p style="display: flex; justify-content: end;"><a href="${element.link}" target="_blank">Info evento</p>
            </div>
        </div>`;
        $('#listaEventi').append(card);
    });
}
