// -------------- Javascript til håndtering af filtreringspanel -----------------
// -------------- og visning af spil-kort og dialogboks.        -----------------

// DOM elementer
const filterPanel = document.getElementById('filter-panel');
const overlay = document.getElementById('overlay');
const filterToggle = document.getElementById('filter-toggle');
const closeFilter = document.getElementById('close-filter');
const productsContainer = document.getElementById('products-container');
const dialog = document.getElementById('product-dialog');

// Laver stjerner ud fra et tal mellem 1 og 5
function lavStjerner(antal) {
    return '★'.repeat(antal) + '☆'.repeat(5 - antal);
}

function visSpil(spilTilVisning) {
    productsContainer.innerHTML = '';

    if (spilTilVisning.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Ingen spil fundet. Prøv at justere dine filtre.</p>';
        return;
    }

    spilTilVisning.forEach(spil => {
        const spilKort = document.createElement('div');
        spilKort.className = 'product-card';

        spilKort.innerHTML = `
            <img src="${spil.billede}" alt="${spil.titel}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${spil.titel}</h3>
                <p class="product-description">${spil.beskrivelse}</p>
                <div class="product-meta">
                    <span class="product-price">${spil.minSpillere}-${spil.maxSpillere} spillere</span>
                    <span class="product-category">${spil.spiltype}</span>
                </div>
                <p>${spil.varighed} min</p>
                <div class="product-rating">${lavStjerner(spil.popularitet)}</div>
                <button class="product-button" onclick="visSpilDialog(${spil.id})">Vis</button>
            </div>
        `;

        productsContainer.appendChild(spilKort);
    });
}

// Åbner dialogen og udfylder felterne med det valgte spil
function visSpilDialog(spilId) {
    const spil = spilListe.find(s => s.id === spilId);

    document.getElementById('dialog-image').src = spil.billede;
    document.getElementById('dialog-image').alt = spil.titel;
    document.getElementById('dialog-title').textContent = spil.titel;
    document.getElementById('dialog-description').textContent = spil.beskrivelse;
    document.getElementById('dialog-price').textContent = `${spil.minSpillere}-${spil.maxSpillere} spillere, ${spil.varighed} min`;
    document.getElementById('dialog-category').textContent = `${spil.spiltype} · ${spil.stemning}`;
    document.getElementById('dialog-rating').textContent = lavStjerner(spil.popularitet);

    dialog.showModal();
}

// Event listeners til brugergrænsefladen
filterToggle.addEventListener('click', toggleFilterPanel);
closeFilter.addEventListener('click', closeFilterPanel);
overlay.addEventListener('click', closeFilterPanel);
document.getElementById('dialog-close').addEventListener('click', () => dialog.close());

// Luk filter panel
function closeFilterPanel() {
    filterPanel.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Åbn/luk filter panel
function toggleFilterPanel() {
    filterPanel.classList.toggle('active');
    overlay.classList.toggle('active');

    if (filterPanel.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Luk filter panel med Escape
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && filterPanel.classList.contains('active')) {
        closeFilterPanel();
    }
});

// Initial visning
window.addEventListener('DOMContentLoaded', () => {
    visSpil(spilListe);
});