async function chargerStatsPromo() {
  try {
    const response = await fetch("db/stats.json");
    const data = await response.json();

    const positionRelative = (data.rang / data.total_promo) * 100;

    const statsContainer = document.querySelector(".hero-stats");

    const rankHTML = `
            <div class="stats-details">
                <div class="stat-item">
                    <span class="hc-text-gold stat-label">POSITION :</span> 
                    <span class="hc-text-blue stat-value">#${data.rang} / ${data.total_promo} (TOP ${Math.round(positionRelative)}%)</span>
                </div>
                <div class="stat-item">
                    <span class="hc-text-gold stat-label">MOYENNE :</span> 
                    <span class="hc-text-blue stat-value stat-moyenne">${data.moyenne} / 20</span>
                </div>
                <div class="stat-item stat-sync">
                    Dernière synchronisation : ${data.derniere_maj}
                </div>
            </div>
        `;

    statsContainer.innerHTML = rankHTML;
  } catch (error) {
    console.error("Erreur lors de la récupération des stats", error);
  }
}

chargerStatsPromo();
