window.onload = function () {
    let naam = sessionStorage.getItem('spelerNaam');
    let email = sessionStorage.getItem('spelerEmail');

    if (naam == null && email == null) {
        window.location.href = '../index.html';
    }
    
};