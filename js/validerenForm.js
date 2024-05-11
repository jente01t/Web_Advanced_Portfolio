'use strict';
//Gebruiken van een constante
const emailBenodigdheden = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // uit werkcollege 2 oplossingen

function validerenForm(naamValue, emailValue, leeftijdValue) { //Formulier valideren
    return new Promise((resolve, reject) => { ////Promise
        if (naamValue.trim() == "") {
            reject("Naam is verplicht!");
        }
        if (leeftijdValue == "") {
            reject("Leeftijd is verplicht!");
        }
        if (leeftijdValue < 18) {
            reject("Je moet minstens 18 jaar zijn om te spelen!");
        }
        if (emailValue == "" || !emailBenodigdheden.test(emailValue)) {
            reject("Email is verplicht en moet een geldig emailadres zijn!");
        }

        resolve("Bedankt, we kunnen spelen!");
    });
}
