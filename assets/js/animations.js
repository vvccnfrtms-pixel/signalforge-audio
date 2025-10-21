document.addEventListener("DOMContentLoaded", () => {
  const featuredCards = document.querySelectorAll("#featured-grid .card");
  
  featuredCards.forEach(card => {
    // Randomly assign "Limited Stock" badge to some cards
    if(Math.random() < 0.5){ 
      const badge = document.createElement("div");
      badge.textContent = "Limited Stock!";
      badge.className = "stock-badge";
      card.appendChild(badge);
    }
  });
});
