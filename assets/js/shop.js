// assets/js/shop.js
// Placeholder helpers for serverless Stripe integration or PayPal/Gumroad fallbacks.
// This file contains examples and comments for future scaling to Stripe Checkout.

async function createStripeSession(productId){
  // Example POST to your serverless endpoint which creates a Stripe Checkout session.
  // Serverless endpoint (not included) should call Stripe APIs and return { id: sessionId, url: sessionUrl }
  const res = await fetch('/.netlify/functions/create-checkout-session', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ productId })
  });
  if(!res.ok) throw new Error('Failed to create session');
  return await res.json();
}

// Example: call and redirect to stripe checkout
async function checkoutWithStripe(productId){
  try{
    const session = await createStripeSession(productId);
    if(session.url) window.location = session.url;
  } catch(e){
    console.error(e);
    alert('Stripe checkout not configured. Use PayPal or contact us to buy.');
  }
}

// For now, the site uses direct links (PayPal/Gumroad) stored in products.json
