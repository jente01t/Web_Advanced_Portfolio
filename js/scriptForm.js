'use strict';

console.log('script loaded');


let formDiv = document.getElementById('formDiv'); //Elementen selecteren
let form = document.getElementById('form');
let naam = document.getElementById('naam');
let email = document.getElementById('email');

let blackjack = document.getElementById('title');


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


