// ------- CONFIG -------
const WHATSAPP_NUMBER = "33600000000"; // ← remplace par ton numéro

// ------- PANIER (localStorage) -------
const CART_KEY = "tifawinee_cart_v1";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product, qty=1) {
  const cart = loadCart();
  const idx = cart.findIndex(i => i.id === product.id);
  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, qty });
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = loadCart().filter(i => i.id !== id);
  saveCart(cart);
}

function setQty(id, qty) {
  const cart = loadCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, qty|0);
  saveCart(cart);
}

function clearCart() { saveCart([]); }

function cartCount() { return loadCart().reduce((n,i)=>n+i.qty,0); }

function updateCartBadge() {
  const el = document.querySelector("[data-cart-badge]");
  if (!el) return;
  const n = cartCount();
  el.textContent = n;
  el.classList.toggle("hidden", n === 0);
}

// ------- PRIX / TOTAL -------
function parsePrice(p) {
  // "49,00 €" -> 49.00
  const num = (p+"").replace(/[^\d,.-]/g,"").replace(",",".");
  return parseFloat(num || "0");
}
function formatPrice(n) {
  return new Intl.NumberFormat("fr-FR", { style:"currency", currency:"EUR" }).format(n);
}
function cartTotal() {
  return loadCart().reduce((sum,i)=> sum + parsePrice(i.price)*i.qty, 0);
}

// ------- WHATSAPP -------
function buildWhatsAppText() {
  const cart = loadCart();
  if (!cart.length) return "Bonjour, je souhaite passer une commande.";
  const lines = [];
  lines.push("Salam/Bonjour, je souhaite commander :");
  lines.push("");
  cart.forEach((i,idx)=>{
    lines.push(`${idx+1}. ${i.title} ×${i.qty} — ${i.price}`);
  });
  lines.push("");
  lines.push(`Total : ${formatPrice(cartTotal())}`);
  lines.push("");
  lines.push("Nom :");
  lines.push("Adresse de livraison :");
  lines.push("Téléphone :");
  return lines.join("\n");
}

function openWhatsAppWithCart() {
  const txt = encodeURIComponent(buildWhatsAppText());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${txt}`;
  window.open(url, "_blank");
}

// synchro badge à l’arrivée sur la page
document.addEventListener("DOMContentLoaded", updateCartBadge);
