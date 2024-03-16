'use strict';

console.log('script loaded');


let formDiv = document.getElementById('formDiv'); //Elementen selecteren
let form = document.getElementById('form');
let naam = document.getElementById('naam');
let email = document.getElementById('email');

let blackjack = document.getElementById('title');


async function KaartenOphalen() { //Async & Await

    let response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'); //Fetch om data op te halen
    let data = await response.json(); //JSON manipuleren en weergeven (niet zeker of dit de juiste termen zijn)
    let deckId = data.deck_id;
    console.log(deckId);


    let drawResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`); //Gebruiken van template literals
    let drawData = await drawResponse.json();

    let linkerKaartImg = drawData.cards[0].image;
    let linkerKaart = document.createElement('img');
    linkerKaart.src = linkerKaartImg;
    linkerKaart.classList.add('linker_Kaart');
    document.body.appendChild(linkerKaart);

    let drawResponse2 = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    let drawData2 = await drawResponse2.json();

    let rechterKaartImg = drawData2.cards[0].image;
    let rechterKaart = document.createElement('img');
    rechterKaart.src = rechterKaartImg;
    rechterKaart.classList.add('rechter_Kaart');
    document.body.appendChild(rechterKaart);
};

(function kaartenTonen() {
    setInterval(async () => {
        await KaartenOphalen();
    }, 2500);
})(); // self executable function



form.addEventListener('submit', function (event) { //Event aan een element koppelen
    event.preventDefault();

    let naamValue = naam.value;
    let emailValue = email.value;

    loadScript('js/validerenForm.js') //Callback function
        .then(() => {                 //Consumer methods
            validerenForm(naamValue, emailValue)
                .then((succesMessage) => {
                    let formatNaam = naam.value.charAt(0).toUpperCase() + naam.value.slice(1);

                    localStorage.setItem('spelerNaam', formatNaam); //Local storage gebruiken

                    Swal.fire({
                        icon: 'success',
                        title: 'Gelukt!',
                        text: succesMessage
                    }).then((result) => {
                        console.log('Swal prompt weergegeven');
                        if (result.isConfirmed) {
                            window.location.href = 'spel.html';
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






function loadScript(src) {
    return new Promise(function (resolve, reject) {
        let script = document.createElement('script');
        script.src = src;

        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error('Script load error: ' + src));

        document.head.append(script);
    })
}

