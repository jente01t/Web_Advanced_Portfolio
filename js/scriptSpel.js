

let spelerNaam = document.getElementById('spelerNaam');
let dealerNaam = document.getElementById('dealerNaam');
let dealerKaartenDiv = document.getElementById('dealerKaartenDiv');
let spelerKaartenDiv = document.getElementById('spelerKaartenDiv');
let hitBtn = document.getElementById('hit');
let standBtn = document.getElementById('stand');
let keuzeText = document.getElementById('keuzeText')
let NieuwSpelBtn = document.getElementById('NieuwSpel');
const achterKaart = "https://www.deckofcardsapi.com/static/img/back.png";


let storedName = localStorage.getItem('spelerNaam'); //Local storage
console.log(storedName);
spelerNaam.textContent = storedName; //element aanpassen


let dealerKaarten = [];
let spelerKaarten = [];


async function kaartenOphalen() {
    let response = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=1');
    let data = await response.json();
    return data.cards[0];
};

async function dealKaarten () {              
    spelerKaarten.push(await kaartenOphalen());
    dealerKaarten.push(await kaartenOphalen());
    spelerKaarten.push(await kaartenOphalen());
    dealerKaarten.push(await kaartenOphalen());

    toonkaarten();
};

dealKaarten();  

function toonkaarten () {
    dealerKaartenDiv.innerHTML = "";
    spelerKaartenDiv.innerHTML = "";

    for (let kaart of dealerKaarten) {
        let fotoKaart = document.createElement('img');
        if (dealerKaarten.indexOf(kaart) == 0) {
            fotoKaart.src = achterKaart;
        } else {
            fotoKaart.src = kaart.image;
        }
        dealerKaartenDiv.appendChild(fotoKaart);
    }
    
    for (let kaart of spelerKaarten) {
        let fotoKaart = document.createElement('img');
        fotoKaart.src = kaart.image;
        spelerKaartenDiv.appendChild(fotoKaart);
    }
}

function waardeKaarten (kaarten) {
    let waarde = 0;
    let azen = 0;
    for (let kaart of kaarten) {
        if (kaart.value === 'ACE') {
            waarde += 11;
            azen += 1;
        } else if (kaart.value === 'KING' || kaart.value === 'QUEEN' || kaart.value === 'JACK') {
            waarde += 10;
        } else {
            waarde += parseInt(kaart.value);
        };
    };

    while (waarde > 21 && azen > 0) {
        waarde -= 10;
        azen -= 1;
    };
    return waarde;
};

hitBtn.addEventListener('click', async function () {
    spelerKaarten.push(await kaartenOphalen());
    toonkaarten();
    let spelerWaarde = waardeKaarten(spelerKaarten);
    if (spelerWaarde > 21) {
        checkWinnaar();
    }
});

standBtn.addEventListener('click', async function () {
    keuzeText.textContent = 'De dealer is aan de beurt';
    dealerKaartenDiv.innerHTML = "";

    let dealerWaarde = waardeKaarten(dealerKaarten);
    while (dealerWaarde < 17) {
        dealerKaarten.push(await kaartenOphalen());
        dealerWaarde = waardeKaarten(dealerKaarten);
    }
    for (let kaart of dealerKaarten) {
        let fotoKaart = document.createElement('img');
        fotoKaart.src = kaart.image;
        dealerKaartenDiv.appendChild(fotoKaart);
    }
    checkWinnaar();

});

function checkWinnaar () {
    let spelerWaarde = waardeKaarten(spelerKaarten);
    let dealerWaarde = waardeKaarten(dealerKaarten);


    if (spelerWaarde > 21) {
        keuzeText.textContent = 'Je hebt verloren';
        eindeSpel();
    }
    else if (dealerWaarde > 21) {
        keuzeText.textContent = 'Je hebt gewonnen!';
        eindeSpel();
    }
    else if (spelerWaarde > dealerWaarde) {
        keuzeText.textContent = 'Je hebt gewonnen!';
        eindeSpel();
    }
    else if (spelerWaarde < dealerWaarde) {
        keuzeText.textContent = 'Je hebt verloren';
        eindeSpel();
    }
    else {
        keuzeText.textContent = 'Gelijkspel';
        eindeSpel();
    }
};