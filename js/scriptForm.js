'use strict';

console.log('script loaded');


let formDiv = document.getElementById('formDiv'); //Elementen selecteren
let form = document.getElementById('form');
let naam = document.getElementById('naam');
let email = document.getElementById('email');
let leeftijd = document.getElementById('leeftijd');

let blackjack = document.getElementById('title');

// functie voor kaarten ophalen en deze te koppelen aan de DOM
let deckId = null;

async function KaartenOphalen() { //Async & Await
    if (!deckId) {
        let response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'); //Fetch om data op te halen
        let data = await response.json();
        deckId = data.deck_id;
    }

    let drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`); //Gebruiken van template literals
    let drawData = await drawResponse.json();

    if (drawData.cards.length < 2) {
        deckId = null;
        return KaartenOphalen(); 
    }

    let linkerKaartImg = drawData.cards[0].image;
    let linkerKaart = document.createElement('img');
    linkerKaart.src = linkerKaartImg;
    linkerKaart.classList.add('linker_Kaart');
    document.body.appendChild(linkerKaart);

    let rechterKaartImg = drawData.cards[1].image;
    let rechterKaart = document.createElement('img');
    rechterKaart.src = rechterKaartImg;
    rechterKaart.classList.add('rechter_Kaart');
    document.body.appendChild(rechterKaart);
};

// Roep de functie aan om kaarten op te halen
KaartenOphalen();



// functie om kaarten te tonen op het scherm
(function kaartenTonen() {
    setInterval(async () => {
        await KaartenOphalen();
    }, 2500);
})(); // self executable function


// eventlistener voor het formulier te valideren met SweetAlerts en naam op te slagen in local storage
form.addEventListener('submit', function (event) { //Event aan een element koppelen
    event.preventDefault();

    let naamValue = naam.value;
    let emailValue = email.value;
    let leeftijdValue = leeftijd.value;

    // aanroepen functie voor het valideren van het formulier
    loadScript('js/validerenForm.js') //Callback function
        .then(() => {                 //Consumer methods
            validerenForm(naamValue, emailValue, leeftijdValue)
                .then((succesMessage) => {
                    let formatNaam = naam.value.charAt(0).toUpperCase() + naam.value.slice(1);

                    localStorage.setItem('spelerNaam', formatNaam); //Local storage gebruiken

                    sessionStorage.setItem('spelerNaam', formatNaam);
                    sessionStorage.setItem('spelerEmail', email.value);
                    sessionStorage.setItem('spelerLeeftijd', leeftijd.value);

                    Swal.fire({
                        icon: 'success',
                        title: 'Gelukt!',
                        text: succesMessage
                    }).then((result) => {
                        console.log('Swal prompt weergegeven');
                        if (result.isConfirmed) {
                            window.location.href = 'Spel.html';
                        }
                    });
                })
                .catch((errorMessage) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oeps...',
                        text: errorMessage
                    });
                });
        })
        .catch((error) => { //Arrow function
            console.error('Script error:', error);
        });
});



// functie om promise script te laden
function loadScript(src) {
    return new Promise(function (resolve, reject) {
        let script = document.createElement('script');
        script.src = src;

        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error('Script load error: ' + src));

        document.head.append(script);
    })
}

