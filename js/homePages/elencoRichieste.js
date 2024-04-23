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
// Real time DB
const database = getDatabase(app);
// Firestore DB
const db = getFirestore();
const gamesRef = collection(db, 'gameList');
const gameRequestsRef = collection(db, 'gameRequests');

$(document).ready(function(){

    const authLogged = JSON.parse(sessionStorage.getItem('auth'));
    const uid = authLogged.uid;
    userLogged = JSON.parse(sessionStorage.getItem('userLogged'));

    getTags();
    getRichieste();

    $('#info').on("click", function(){
        Swal.fire({
            title: "Come funziona",
            text: "In questa pagina trovi tutte le richieste create dai giocatori di partecipazione ad un tavolo da loro creato. Cliccando sulla singola richiesta puoi vedere i dettagli del creatore per contattarlo se vuoi unirti al gioco. Se invece vuoi creare una nuova richiesta di gioco clicca sul taso + in basso a destra.",
            icon: "info"
          });
    })

    $(document).on("click", ".infoRichiesta", function(){
        selectedRequest = listaRichieste.filter((req) => req.id == $(this).attr("idRichiesta"))[0];
        const dbRef = ref(database);
        get(child(dbRef, 'users/' +  selectedRequest.creator)).then((snapshot) => {
            if(snapshot.exists()){
                var creatorInfo = snapshot.val();
                modalRichiesta(creatorInfo, selectedRequest);
            } else {
                console.log("Utente non trovato");
            }
        })
        .catch((err) => {
            console.log(err);
        });
    })
})

function getTags(){
    getDocs(gamesRef).then((snapShot) => {
        snapShot.docs.forEach((doc) => {
            tagList.push({  id: doc.id, ...doc.data()});
        });
    })
    .catch(err => {
        console.log(err);
    });
}

function getRichieste(){
    getDocs(gameRequestsRef).then((snapShot) => {
        snapShot.docs.forEach((doc) => {
            listaRichieste.push({  id: doc.id, ...doc.data()});
        });
        popolaRichieste(listaRichieste);
    })
    .catch(err => {
        console.log(err);
    });

}

function popolaRichieste(array){
    array.forEach(element => {
        var tagButtons = returnTags(element.gameList);
        var modalita = "";
        if (element.modalita == "presenza"){
            modalita = "In presenza"
        } else if (element.modalita == "online"){
            modalita = "Online"
        }
        var card = `
        <div class="card gameCard bg-dark navbar-dark">
            <div class="card-body">
                <div class="card-title">
                    <div class="cardTitle">
                        <h5>${element.titolo}</h5>
                        <button type="button" class="btn floatingActionBtn infoRichiesta" idRichiesta="${element.id}"><i class="fa-solid fa-circle-info"></i></button>
                    </div>
                </div>
                <p class="card-text">${element.descrizione}</p>
                <p class="card-text">Modalità: ${modalita}</p>
                <p class="card-text">${element.luogo}</p>
                <div id="richiesta_${element.id}">${tagButtons}</div>
            </div>
        </div>`;
        $('#elencoRichieste').append(card);
        // tagButtons.forEach(el => {
        //     var id = `richiesta_${element.id}`;
        //     $('#'+id).append(el);
        // })
    });
}

function returnTags(array){
    // var returnArray = [];
    var tags = "";
    array.forEach(element => {
        tagList.forEach(el => {
            if (el.id == element){
                tags += `<button class="btn btn-success m-1 tag" id="tag_${el.id}" title="${el.name}">${el.tag}<i class="fa-solid fa-tag pl-2"></i></button>`;
                // returnArray.push(tag);
            }
        })
    });
    return tags;
}

function modalRichiesta(creator, richiesta){
    console.log(creator);
    var tagButtons = returnTags(richiesta.gameList);
    var place = `<i class="fa-solid fa-location-dot" style="margin-right: 5px;"></i>${richiesta.luogo}`;
    richiesta.luogo == "" ? place = "" : "";
    var phoneBtn = "";
    var whAppBtn = "";
    var fbBtn = "";
    var igBtn = "";
    creator.telefono != "" ? phoneBtn = `<a href="tel: ${creator.telefono}" style="margin: 5px;"><i class="fa-solid fa-phone" style="margin-right: 5px;"></i>${creator.telefono}</a>` : "" 
    creator.telefono != "" ? whAppBtn = `<a href="https://wa.me/${creator.telefono}" target="_blank" style="margin: 5px;"><i class="fa-brands fa-whatsapp whatsapp fa-xl" style="margin-right: 5px;"></i></a>` : "" 
    creator.fbLink != "" ? fbBtn = `<a href="${creator.fbLink}" target="_blank" style="margin: 5px;"><i class="fa-brands fa-facebook facebook fa-xl" style="margin-right: 5px;"></i></a>` : "" 
    creator.igLink != "" ? igBtn = `<a href="${creator.igLink}" target="_blank" style="margin: 5px;"><i class="fa-brands fa-instagram instagram fa-xl" style="margin-right: 5px;"></i></a>` : "" 
    
    var html = `
    <div class="bg-dark">
        <hr class="text-white">
        <div class="userInfoDiv">
            <div class="detailUserInfo">
                <img class="infoUserImg" src="${creator.profilePic}"></img>
                <span>${creator.username}</span>
            </div>
            <div class="userContacts">
                <a style="color: white;" href="mailto:${creator.email}" style="margin: 5px;"><i class="fa-solid fa-envelope" style="margin-right: 5px;"></i>Invia mail</a>
                ${phoneBtn}
                <div class="p-2">
                    ${whAppBtn}
                    ${fbBtn}
                    ${igBtn}
                </div>
            </div>
        </div>
        <hr class="text-white">
        <p>${richiesta.descrizione}</p>
        <p><i class="fa-solid fa-gamepad" style="margin-right: 5px;"></i>Modalità: ${richiesta.modalita}</p>
        <p>${place}</p>
        <div id="tagsAppend">${tagButtons}</div>
    </div>`;
    
    Swal.fire({
        title: richiesta.titolo,
        html: html,
    })
}