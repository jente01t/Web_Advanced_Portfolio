

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


// css nog aanpassen en spel verder afmaken