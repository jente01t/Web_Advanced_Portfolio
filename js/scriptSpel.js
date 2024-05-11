'use strict';


let spelerNaam = document.getElementById('spelerNaam');
let dealerNaam = document.getElementById('dealerNaam');
let dealerKaartenDiv = document.getElementById('dealerKaartenDiv');
let spelerKaartenDiv = document.getElementById('spelerKaartenDiv');
let dealerDiv = document.getElementById('dealerDiv');
let spelerDiv = document.getElementById('spelerDiv');
let hitBtn = document.getElementById('hit');
let standBtn = document.getElementById('stand');
let keuzeText = document.getElementById('keuzeText');
let keuzes = document.getElementById('keuzes');
let NieuwSpelBtn = document.getElementById('NieuwSpel');
const achterKaart = "https://www.deckofcardsapi.com/static/img/back.png";
let geldBetButton = document.getElementById('geldBetButton');
let clearGeldButton = document.getElementById('clearGeldButton');
let betHoeveelheid = document.getElementById('betHoeveelheid');
let geldButtons = document.getElementById('geldButtons');
let geld1 = document.getElementById('geld1');
let geld5 = document.getElementById('geld5');
let geld10 = document.getElementById('geld10');
let geld25 = document.getElementById('geld25');
let geld50 = document.getElementById('geld50');
let geld100 = document.getElementById('geld100');
let geld500 = document.getElementById('geld500');
let allIn = document.getElementById('allIn');
let statsButton = document.getElementById('statsButton');
let statsBox = document.getElementById('statsBox');


let storedName = localStorage.getItem('spelerNaam'); //Local storage
console.log(storedName);
spelerNaam.textContent = storedName; //element aanpassen


let dealerKaarten = [];
let spelerKaarten = [];
let spelerGeld = 1000;
let hoeveelheid = 0;
let spelerWins = 0;
let spelerWinstPercentage = 0;
let dealerWins = 0;
let dealerWinstPercentage = 0;
let aantalgames = 0;
let balansStats = 0;

keuzes.style.display = 'none';
dealerDiv.style.display = 'none';
spelerDiv.style.display = 'none';


//functies voor de inzet van geld
geld1.addEventListener('click', function () {
    hoeveelheid += 1;
    betHoeveelheid.textContent = "Inzet: €" + hoeveelheid;
});

geld5.addEventListener('click', function () {
    hoeveelheid += 5;
    betHoeveelheid.textContent = "Inzet: €" + hoeveelheid;
});

geld10.addEventListener('click', function () {
    hoeveelheid += 10;
    betHoeveelheid.textContent = "Inzet: €" + hoeveelheid;
});

geld25.addEventListener('click', function () {
    hoeveelheid += 25;
    betHoeveelheid.textContent = "Inzet: €" + hoeveelheid;
});

geld50.addEventListener('click', function () {
    hoeveelheid += 50;
    betHoeveelheid.textContent = "Inzet: €" + hoeveelheid;
});

geld100.addEventListener('click', function () {
    hoeveelheid += 100;
    betHoeveelheid.textContent = "Inzet: €" + hoeveelheid;
});

geld500.addEventListener('click', function () {
    hoeveelheid += 500;
    betHoeveelheid.textContent = "Inzet: €" + hoeveelheid;
});

allIn.addEventListener('click', function () {
    hoeveelheid = spelerGeld;
    betHoeveelheid.textContent = "Inzet: €" + hoeveelheid;
});


// eventlisteners voor de inzet van geld
geldBetButton.addEventListener('click', function () {
    if (hoeveelheid <= spelerGeld && hoeveelheid > 0) {
        spelerGeld -= hoeveelheid;
        document.getElementById('spelerGeld').textContent = "Geld: €" + spelerGeld;
        dealKaarten();
        geldBetButton.style.display = 'none';
        clearGeldButton.style.display = 'none';
        geld1.style.display = 'none';
        geld5.style.display = 'none';
        geld10.style.display = 'none';
        geld25.style.display = 'none';
        geld50.style.display = 'none';
        geld100.style.display = 'none';
        geld500.style.display = 'none';
        allIn.style.display = 'none';
        keuzes.style.display = 'flex';
        dealerDiv.style.display = 'block';
        spelerDiv.style.display = 'block';
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oeps...',
            text: "Je hebt niet genoeg geld of je hebt een ongeldige inzet!"
        });
    }
});


// eventlistener voor het clearen van de inzet van geld
clearGeldButton.addEventListener('click', function () {
    hoeveelheid = 0;
    betHoeveelheid.textContent = "Inzet: €" + hoeveelheid;
});


// functie voor deck van kaarten op te halen
async function kaartenOphalen() {
    let response = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=1');
    let data = await response.json(); //JSON manipuleren en weergeven
    return data.cards[0];
};

// functie voor kaarten uit te delen aan speler en dealer
async function dealKaarten () {              
    const [kaart1, kaart2, ...overgeblevenKaarten] = await Promise.all([ //spread operator
        kaartenOphalen(),
        kaartenOphalen(),
        kaartenOphalen(),
        kaartenOphalen()
    ]);

    spelerKaarten.push(kaart1, kaart2);
    dealerKaarten.push(...overgeblevenKaarten); //rest operator

    toonkaarten();
    toonTotaleWaardeSpeler();
    verwijderWaardenDealer();
}



// functie om kaarten te tonen op het scherm
function toonkaarten () {
    dealerKaartenDiv.innerHTML = "";
    spelerKaartenDiv.innerHTML = "";

    for (let kaart of dealerKaarten) { //Iteration over een array
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
    toonTotaleWaardeSpeler ();
}

// functie om de waarde van de kaarten te berekenen
function waardeKaarten(kaarten, isDealer) {
    let waarde = 0;
    let azen = 0;

    for (let i = 0; i < kaarten.length; i++) {
        let kaart = kaarten[i];
        if (kaart.value === "ACE") {
                waarde += 11;
                azen += 1;
        } else if (kaart.value === "KING" || kaart.value === "QUEEN" || kaart.value === "JACK") {
                waarde += 10;
        } else {
                waarde += parseInt(kaart.value);
        }
    }

    while (waarde > 21 && azen > 0) {
        waarde -= 10;
        azen -= 1;
    }
    return waarde;
}


// eventlisteners voor hit, stand en nieuw spel
hitBtn.addEventListener('click', async function () {
    spelerKaarten.push(await kaartenOphalen());
    toonkaarten();
    let spelerWaarde = waardeKaarten(spelerKaarten, false);
    if (spelerWaarde > 21) {
        checkWinnaar();
    }
    toonTotaleWaardeSpeler ();
});

standBtn.addEventListener('click', async function () {
    keuzeText.textContent = 'De dealer is aan de beurt';
    dealerKaartenDiv.innerHTML = "";

    let dealerWaarde = waardeKaarten(dealerKaarten, true);
    while (dealerWaarde < 17) {
        dealerKaarten.push(await kaartenOphalen());
        dealerWaarde = waardeKaarten(dealerKaarten, true);
    }
    for (let kaart of dealerKaarten) {
        let fotoKaart = document.createElement('img');
        fotoKaart.src = kaart.image;
        dealerKaartenDiv.appendChild(fotoKaart);
    }
    toonTotaleWaardeSpeler ();
    toonTotaleWaardeDealer ();
    checkWinnaar();
});


// functie voor einde van het spel
function eindeSpel () {
    hitBtn.style.display = 'none';
    standBtn.style.display = 'none';
    NieuwSpelBtn.style.display = 'block';
};


// functie om de totale waarde van de kaarten te tonen
function toonTotaleWaardeSpeler () {
    let spelerWaarde = waardeKaarten(spelerKaarten, false);
    

    let spelerNaamWaarde = `${storedName} (Waarde: ${spelerWaarde})`;
    
    spelerNaam.textContent = spelerNaamWaarde;
   
}

function toonTotaleWaardeDealer () {
    let dealerWaarde = waardeKaarten(dealerKaarten, true);
    let dealerNaamWaarde = `Dealer (Waarde: ${dealerWaarde})`;
    dealerNaam.textContent = dealerNaamWaarde;
}

function verwijderWaardenDealer () {
    dealerNaam.textContent = "Dealer";

}


// functie om te controleren wie de winnaar is
function checkWinnaar () {
    let [spelerWaarde, dealerWaarde] = [waardeKaarten(spelerKaarten, false), waardeKaarten(dealerKaarten, true)]; // destructuring
    aantalgames += 1;


    if (spelerWaarde > 21) {
        keuzeText.textContent = 'Je hebt verloren';
        dealerWins += 1;
        updateStats();
        opslaanStats();
        eindeSpel();
    }
    else if (dealerWaarde > 21) {
        keuzeText.textContent = 'Je hebt gewonnen!';
        spelerGeld += hoeveelheid * 2;
        document.getElementById('spelerGeld').textContent = "Geld: €" + spelerGeld;
        spelerWins += 1;
        updateStats();
        opslaanStats();
        eindeSpel();
    }
    else if (spelerWaarde > dealerWaarde) {
        keuzeText.textContent = 'Je hebt gewonnen!';
        spelerGeld += hoeveelheid * 2;
        document.getElementById('spelerGeld').textContent = "Geld: €" + spelerGeld;
        spelerWins += 1;
        updateStats();
        opslaanStats();
        eindeSpel();
    }
    else if (spelerWaarde < dealerWaarde) {
        keuzeText.textContent = 'Je hebt verloren';
        dealerWins += 1;
        updateStats();
        opslaanStats();
        eindeSpel();
    }
    else {
        keuzeText.textContent = 'Gelijkspel';
        spelerGeld += hoeveelheid;
        document.getElementById('spelerGeld').textContent = "Geld: €" + spelerGeld;
        eindeSpel();
    }
};


// functie om stats op te slaan
function opslaanStats () {
    localStorage.setItem('stats', JSON.stringify({
        spelerWins: spelerWins,
        spelerWinstPercentage: spelerWinstPercentage,
        dealerWins: dealerWins,
        dealerWinstPercentage: dealerWinstPercentage,
        aantalgames: aantalgames,
        balansStats: balansStats
    }))
}

// functie om stats te updaten
function updateStats () {
    if (aantalgames > 0) {
        spelerWinstPercentage = Math.round((spelerWins / aantalgames) * 100);
        dealerWinstPercentage = Math.round((dealerWins / aantalgames) * 100);
    }
    balansStats = (spelerGeld - 1000).toFixed(2);
}

// functie om stats te laden
function laadStats () {
    let stats = localStorage.getItem('stats');
    if (stats) {
        stats = JSON.parse(stats);
        spelerWins = stats.spelerWins;
        spelerWinstPercentage = stats.spelerWinstPercentage;
        dealerWins = stats.dealerWins;
        dealerWinstPercentage = stats.dealerWinstPercentage;
        aantalgames = stats.aantalgames;
        balansStats = stats.balansStats;
    }
}


// eventlistener voor statsBox te tonen
statsButton.addEventListener('mouseenter', function () {
    laadStats();
    let statsText = `Speler wins:  ${spelerWins}<br>`
    statsText += `Speler winpercentage:  ${spelerWinstPercentage}%<br>`
    statsText += `Dealer wins:  ${dealerWins}<br>`
    statsText += `Dealer winpercentage:  ${dealerWinstPercentage}%<br>`
    statsText += `Aantal games:  ${aantalgames}<br>`
    statsText += `Balans:  €${balansStats}<br>`
    statsBox.innerHTML = statsText;
    statsBox.style.display = 'block';
});


// eventlistener voor satsBox weg te halen 
statsButton.addEventListener('mouseleave', function () {
    statsBox.style.display = 'none';
});


// eventlistener voor nieuw spel
NieuwSpelBtn.addEventListener('click', function () {
    dealerKaarten = [];
    spelerKaarten = [];
    betHoeveelheid.textContent = "Inzet: €" + hoeveelheid;
    keuzeText.textContent = 'Wat wil je doen?';
    hitBtn.style.display = 'block';
    standBtn.style.display = 'block';
    NieuwSpelBtn.style.display = 'none';
    keuzes.style.display = 'none';
    dealerDiv.style.display = 'none';
    spelerDiv.style.display = 'none';
    geldBetButton.style.display = 'inline-block';
    clearGeldButton.style.display = 'inline-block';
    geld1.style.display = 'inline-block';
    geld5.style.display = 'inline-block';
    geld10.style.display = 'inline-block';
    geld25.style.display = 'inline-block';
    geld50.style.display = 'inline-block';
    geld100.style.display = 'inline-block';
    geld500.style.display = 'inline-block';
    allIn.style.display = 'inline-block';
});


// mobiele versie mmaken