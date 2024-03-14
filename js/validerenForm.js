'use strict';
//Gebruiken van een constante
const emailBenodigdheden = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // uit werkcollege 2 oplossingen

function validerenForm(naamValue, emailValue) { //Formulier valideren
    return new Promise((resolve, reject) => { ////Promise
        if (naamValue.trim() == "") {
        }
        if (emailValue == "" || !emailBenodigdheden.test(emailValue)) {
            reject("Email is verplicht en moet een geldig emailadres zijn!");
        }
    });
}
