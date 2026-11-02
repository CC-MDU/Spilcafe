// Her skal vi skrive vores søge-, sortering- og filtreringskoder

// Henter værdierne fra alle afkrydsede felter med et bestemt name
function hentValgte(navn) {
    return Array.from(document.querySelectorAll(`input[name="${navn}"]:checked`))
        .map(felt => felt.value);
}

function filtrerSpil() {
    let resultat = [...spilListe];

    // 1. Søgning
    const soegetekst = document.getElementById('search-input').value.toLowerCase().trim();
    if (soegetekst) {
        resultat = resultat.filter(spil =>
            spil.titel.toLowerCase().includes(soegetekst) ||
            spil.beskrivelse.toLowerCase().includes(soegetekst) ||
            spil.spiltype.toLowerCase().includes(soegetekst)
        );
    }

    // 2a. Afkrydsningsfelter: name i HTML = feltnavn i data
    const afkrydsningsFiltre = ['spiltype', 'stemning', 'sprog', 'udgave'];
    afkrydsningsFiltre.forEach(felt => {
        const valgte = hentValgte(felt);
        if (valgte.length > 0) {
            resultat = resultat.filter(spil => valgte.includes(spil[felt]));
        }
    });

    // 2b. Antal spillere: tallet skal ligge mellem min og max
    const antalSpillere = parseInt(document.getElementById('antal-spillere').value);
    if (!isNaN(antalSpillere)) {
        resultat = resultat.filter(spil =>
            antalSpillere >= spil.minSpillere && antalSpillere <= spil.maxSpillere
        );
    }

    // 2c. Maks. varighed
    const maxVarighed = parseInt(document.getElementById('max-varighed').value);
    if (!isNaN(maxVarighed)) {
        resultat = resultat.filter(spil => spil.varighed <= maxVarighed);
    }

    // 2d. Sværhedsgrad (radioknap)
    const valgtSvaerhed = document.querySelector('input[name="svaerhedsgrad"]:checked')?.value;
    if (valgtSvaerhed) {
        resultat = resultat.filter(spil => spil.svaerhedsgrad === parseInt(valgtSvaerhed));
    }

    // 3. Sortering
    const sorterEfter = document.getElementById('sorter-valg').value;

    if (sorterEfter === 'popularitet') {
        resultat.sort((a, b) => b.popularitet - a.popularitet);
    }
    if (sorterEfter === 'sværhedsgrad-stigende') {
        resultat.sort((a, b) => a.svaerhedsgrad - b.svaerhedsgrad);
    }
    if (sorterEfter === 'sværhedsgrad-faldende') {
        resultat.sort((a, b) => b.svaerhedsgrad - a.svaerhedsgrad);
    }
    if (sorterEfter === 'varighed') {
        resultat.sort((a, b) => a.varighed - b.varighed);
    }

    // 4. Vis resultatet
    visSpil(resultat);
}

// Opsætning: kører én gang, når siden loader
document.getElementById('search-input').addEventListener('input', filtrerSpil);
document.getElementById('sorter-valg').addEventListener('change', filtrerSpil);

document.getElementById('apply-filters').addEventListener('click', () => {
    filtrerSpil();
    closeFilterPanel();

document.getElementById('reset-filters').addEventListener('click', () => {
    document.querySelectorAll('#filter-panel input[type="checkbox"], #filter-panel input[type="radio"]')
        .forEach(felt => {
            felt.checked = false;
        });

    document.getElementById('antal-spillere').value = '';
    document.getElementById('max-varighed').value = '';

    filtrerSpil();
});

});
