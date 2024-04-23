var listaGiochi = [], userLogged, uid;

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
    addDoc,
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

const gamesRef = collection(db, 'gameList');

const gameRequest = collection(db, 'gameRequests');

// popola i tag dei giochi
getDocs(gamesRef).then((snapShot) => {
        snapShot.docs.forEach((doc) => {
            listaGiochi.push({  id: doc.id, ...doc.data()});
        });
        popolaTag(listaGiochi);
    })
    .catch(err => {
        console.log(err);
    });

$(document).ready(function(){

    uid = JSON.parse(sessionStorage.getItem('auth')).uid;
    userLogged = JSON.parse(sessionStorage.getItem('userLogged'));

    $('#info').on("click", function(){
        Swal.fire({
            title: "Come funziona",
            text: "Completa i campi e clicca Salva per creare una richiesta di gioco. Seleziona i tag dei giochi che vorresti giocare e la modalità di gioco (presenza o online), dopodichè gli altri giocatori potranno contattarti per accordarsi sui dettagli.",
            icon: "info"
          });
    })

    $('#modalita').on('change', function(){
        console.log($(this).val());
        if ($(this).val() == "presenza"){
            $('#luogo').removeClass('d-none');
        } else {
            $('#luogo').addClass('d-none');
        }
    })

    $(document).on('click', '.tag', function(){
        $(this).toggleClass("active");
    })

    $('#btnNuovaRichiesta').on('click', function(){
        var tagList = [];
        var list = $('#tags').find('.tag.active');
        for (let i=0; i<list.length; i++){
            tagList.push(list[i].id.split('_')[1]);
        }

        // Controllo i campi obbligatori
        var titolo = $('#titolo').val();
        var modalita = $('#modalita').val();
        var luogo = $('#luogo').val();
        if (titolo == "" || titolo == undefined || titolo == null){
            Swal.fire("Compila i campi obbligatori", "Titolo obbligatorio", "warning");
            return;
        }
        if (modalita == "" || modalita == undefined || modalita == null){
            Swal.fire("Compila i campi obbligatori", "Modalità obbligatoria", "warning");
            return;
        }
        if (modalita == "presenza"){
            if (luogo == "" || luogo == undefined || luogo == null){
                Swal.fire("Compila i campi obbligatori", "Luogo obbligatorio", "warning");
                return;
            }
        }
        if (tagList.length == 0){
            Swal.fire("Compila i campi obbligatori", "Seleziona almeno un gioco dalla lista", "warning");
            return;
        }

        var req = {
            creator: uid,
            titolo: $('#titolo').val(),
            descrizione: $('#descrizione').val(),
            modalita: modalita,
            luogo: luogo,
            gameList: tagList
        }
        addDoc(gameRequest, req)
            .then(() => {
                Swal.fire("Salvataggio completato", "La tua richiesta è stata inserita correttamente", "success")
                    .then(() => {
                        window.location.href = "/pages/homePages/elencoRichieste.html";
                    });
            });
    })

})

function popolaTag(array){
    array.forEach(element => {
        var tag = `<button class="btn btn-success m-1 tag" id="tag_${element.id}" title="${element.name}">${element.tag}<i class="fa-solid fa-tag pl-2"></i></button>`;
        $('#tags').append(tag);
    });
}