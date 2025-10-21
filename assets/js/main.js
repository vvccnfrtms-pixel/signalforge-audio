// main.js
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;

  const products = [
    {name:"Classic Overdrive", img:"assets/img/gallery1.jpg", link:"products.html"},
    {name:"Vintage Delay", img:"assets/img/gallery2.jpg", link:"products.html"},
    {name:"Fuzz Destroyer", img:"assets/img/gallery3.jpg", link:"products.html"},
    {name:"Reverb Tank", img:"assets/img/gallery4.jpg", link:"products.html"}
  ];

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<a href="${p.link}"><img src="${p.img}" alt="${p.name}"><h4>${p.name}</h4></a>`;
    grid.appendChild(card);
  });
});
