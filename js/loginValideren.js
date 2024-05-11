window.onload = function () {
    let naam = sessionStorage.getItem('spelerNaam');
    let email = sessionStorage.getItem('spelerEmail');
    let leeftijd = sessionStorage.getItem('spelerLeeftijd');

    if (naam == null && email == null && leeftijd < 18) {
        window.location.href = '../index.html';
    }
    
};