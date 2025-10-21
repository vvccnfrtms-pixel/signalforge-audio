// assets/js/main.js
const base = (path) => path.startsWith('/') ? path : path;

async function fetchProducts(){
  const res = await fetch(base('assets/data/products.json'));
  return await res.json();
}

function makeCard(p){
  const d = document.createElement('div');
  d.className='card';
  d.innerHTML = `
    <img src="${p.image}" alt="${p.title}" />
    <h4>${p.title}</h4>
    <p class="muted">${p.short}</p>
    <div style="margin-top:8px;display:flex;gap:8px;">
      <a class="btn-outline" href="product.html?id=${p.id}">View</a>
      <button class="btn" data-add="${p.id}">Buy ${p.currency}${p.price}</button>
    </div>
  `;
  return d;
}

async function renderFeatured(){
  const products = await fetchProducts();
  const featured = products.filter(p => p.featured).slice(0,6);
  const grid = document.getElementById('featured-grid') || document.getElementById('products-grid');
  if(!grid) return;
  grid.innerHTML='';
  featured.forEach(p => grid.appendChild(makeCard(p)));
}

// when on products page render all
async function renderAll(){
  const products = await fetchProducts();
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  grid.innerHTML='';
  products.forEach(p => grid.appendChild(makeCard(p)));
}

// product page
async function renderProductDetail(){
  const q = new URLSearchParams(location.search);
  const id = q.get('id');
  if(!id) return;
  const products = await fetchProducts();
  const p = products.find(x=> String(x.id) === String(id));
  const container = document.getElementById('product-detail');
  if(!p || !container){ container.innerHTML='<p>Product not found.</p>'; return; }
  container.innerHTML = `
    <div class="grid" style="grid-template-columns:1fr 1fr;align-items:start;gap:28px">
      <div>
        <img src="${p.image}" alt="${p.title}" style="width:100%;border-radius:10px" />
      </div>
      <div>
        <h1>${p.title}</h1>
        <p class="muted">${p.short}</p>
        <h3>${p.currency}${p.price}</h3>
        <p>${p.long}</p>
        <div style="margin-top:16px">
          <button class="btn" data-add="${p.id}">Buy Now</button>
          <button class="btn-outline" onclick="location.href='contact.html'">Request Custom</button>
        </div>
      </div>
    </div>
  `;
}

// attach buy buttons - powered by PayPal client-side (fallback)
function attachBuyHandlers(){
  document.body.addEventListener('click', async (e)=>{
    const id = e.target.getAttribute('data-add');
    if(!id) return;
    e.target.disabled = true;
    try {
      // Try PayPal client-side checkout (no server). This posts to PayPal cart link if configured.
      // If you want Stripe Checkout, replace this with call to your serverless endpoint that creates a Checkout Session.
      const products = await fetch('assets/data/products.json').then(r=>r.json());
      const p = products.find(x=>String(x.id)===String(id));
      if(!p) throw new Error('Product not found');
      // Simple fallback: open PayPal.me or Gumroad external link if configured
      if(p.paypal_link){
        window.open(p.paypal_link, '_blank');
      } else if (p.gumroad_link){
        window.open(p.gumroad_link, '_blank');
      } else {
        alert('Buy flow not configured. Contact hello@signalforgeaudio.com to purchase.');
      }
    } catch(err){
      console.error(err);
      alert('Unable to start checkout. See console for details.');
    } finally {
      e.target.disabled = false;
    }
  });
}

// Run appropriate renders
document.addEventListener('DOMContentLoaded', async ()=>{
  attachBuyHandlers();
  renderFeatured();
  renderAll();
  renderProductDetail();
});
