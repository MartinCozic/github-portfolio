let mesProjets = [];
let afficherTout = false;

async function chargerProjets() {
    try {
        const response = await fetch('db/projets.json');
        mesProjets = await response.json();
        renderProjets();
    } catch (error) {
        console.error("Erreur de chargement :", error);
        document.getElementById('liste-projets').innerHTML = "<p class='hc-text-blue'>Erreur lors du chargement des cristaux de données.</p>";
    }
}

function renderProjets(skipAnimation = false) {
    const container = document.getElementById('liste-projets');
    const projetsAfffiches = afficherTout ? mesProjets : mesProjets.slice(0, 8);
    container.innerHTML = projetsAfffiches.map((p, index) =>
        `<div class="project-card project-card-visible ${skipAnimation ? '' : (index < 8 ? '' : 'reveal')}" onclick="openModal(${index})" style="animation-delay: ${index < 8 ? 0 : (index - 8) * 0.2}s">
            <div class="image-wrapper"><img src="img/${p.image}" alt="${p.titre}" class="project-image"></div>
            <div class="view-button"><div class="lock-diamond"><img src="img/lock.png" class="lock-img" alt="Débloquer"></div></div>
            <div class="project-info">
                <h3 class="project-title">${p.titre}</h3>
                <div class="project-footer"><img src="img/rp.png" class="rp-icon" alt="RP"><span class="year-text">${p.annee}</span></div>
            </div>
        </div>`
    ).join('');
    renderBoutonVoirPlus();
}

function renderBoutonVoirPlus() {
    let btnContainer = document.getElementById('voir-plus-container');
    if (!btnContainer) {
        btnContainer = document.createElement('div');
        btnContainer.id = 'voir-plus-container';
        btnContainer.style.textAlign = 'center';
        btnContainer.style.marginTop = '30px';
        document.getElementById('liste-projets').after(btnContainer);
    }
    if (mesProjets.length <= 8) {
        btnContainer.innerHTML = "";
        return;
    }
    btnContainer.innerHTML = `<button onclick="toggleProjets()" class="button is-secondary hex-btn">${afficherTout ? 'RÉDUIRE' : 'EN VOIR PLUS'}</button>`;
}

function toggleProjets() {
    if (afficherTout) {
        const cards = document.querySelectorAll('.project-card');
        const cartesASupprimer = cards.length - 8;
        setTimeout(() => {
            cards.forEach((card, index) => {
                if (index >= 8) {
                    card.style.opacity = '1';
                    setTimeout(() => {
                        card.classList.add('exit');
                        card.style.animationDelay = `${(cartesASupprimer - 1 - (index - 8)) * 0.15}s`;
                    }, 0);
                }
            });
        }, 0);
        setTimeout(() => {
            afficherTout = false;
            renderProjets(true);
            document.getElementById('liste-projets').scrollIntoView({ behavior: 'smooth' });
        }, 700);
    } else {
        afficherTout = true;
        const container = document.getElementById('liste-projets');
        container.innerHTML = mesProjets.map((p, index) =>
            `<div class="project-card ${index >= 8 ? 'reveal' : ''}" onclick="openModal(${index})" style="animation-delay: ${index >= 8 ? (index - 8) * 0.2 : 0}s">
                <div class="image-wrapper"><img src="img/${p.image}" alt="${p.titre}" class="project-image"></div>
                <div class="view-button"><div class="lock-diamond"><img src="img/lock.png" class="lock-img" alt="Débloquer"></div></div>
                <div class="project-info">
                    <h3 class="project-title">${p.titre}</h3>
                    <div class="project-footer"><img src="img/rp.png" class="rp-icon" alt="RP"><span class="year-text">${p.annee}</span></div>
                </div>
            </div>`
        ).join('');
        renderBoutonVoirPlus();
    }
}

function openModal(index) {
    const p = mesProjets[index];
    const modal = document.getElementById('project-modal');
    const modalContent = modal.querySelector('.modal-content');
    document.getElementById('modal-image').src = `img/${p.image}`;
    document.getElementById('modal-title').innerText = p.titre;
    document.getElementById('modal-description').innerText = p.description;
    document.getElementById('modal-year').innerText = p.annee;
    const actionsContainer = document.getElementById('modal-actions');
    actionsContainer.innerHTML = "";
    const btn1 = document.createElement('a');
    btn1.href = p.lien;
    btn1.target = "_blank";
    btn1.className = "button is-secondary is-tiny";
    btn1.style.textDecoration = "none";
    btn1.innerText = "VOIR LE GITHUB";
    actionsContainer.appendChild(btn1);
    if (p.lien2) {
        const btn2 = document.createElement('a');
        btn2.href = p.lien2;
        btn2.target = "_blank";
        btn2.rel = "noopener noreferrer";
        btn2.className = "button is-primary is-tiny";
        btn2.style.textDecoration = "none";
        btn2.innerText = "EN VOIR PLUS...";
        actionsContainer.appendChild(btn2);
    }
    const techContainer = document.getElementById('modal-technos');
    techContainer.innerHTML = p.technos.map(t => `<span class="hc-text-gold" style="border:1px solid var(--hex-gold); padding:2px 5px; font-size:0.7rem; margin:2px;">${t}</span>`).join('');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modalContent.classList.add('animated-border');
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.remove('animated-border');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

chargerProjets();
