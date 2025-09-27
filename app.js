// js/app.js - Amie Sneakers Machakos

/* Sample product data
   In production you could fetch from an API; for this static site we keep it in-memory.
   Replace image paths ('images/productX.jpg') with your downloaded image files or online image URLs.
*/
const products = [
  {id:1, name:"Amie Runner X", price:9500, category:"men", brand:"Amie", img:"images/product1.jpg", desc:"Lightweight running shoe."},
  {id:2, name:"Street Retro", price:10500, category:"women", brand:"Adidas", img:"images/product2.jpg", desc:"Classic style with modern foam."},
  {id:3, name:"Sprint Lite", price:7800, category:"kids", brand:"Puma", img:"images/product3.jpg", desc:"Comfort for active kids."},
  {id:4, name:"Zoom Machakos", price:12500, category:"men", brand:"Nike", img:"images/product4.jpg", desc:"Responsive cushioning."},
  {id:5, name:"Daily Comfort", price:8900, category:"women", brand:"Amie", img:"images/product5.jpg", desc:"Everyday sneaker."},
  {id:6, name:"Urban Hike", price:11500, category:"men", brand:"Amie", img:"images/product6.jpg", desc:"Outdoor-friendly, durable."},
  {id:7, name:"Pastel Runner", price:9800, category:"women", brand:"Amie", img:"images/product7.jpg", desc:"Soft colorway, comfy sole."},
  {id:8, name:"Mini Steps", price:4500, category:"kids", brand:"Amie", img:"images/product8.jpg", desc:"Supportive and fun."},
  {id:9, name:"Limited Drop A", price:22000, category:"new", brand:"Nike", img:"images/product9.jpg", desc:"Limited release - rare."},
  {id:10, name:"Limited Drop B", price:24000, category:"new", brand:"Adidas", img:"images/product10.jpg", desc:"Collector's item."},
  {id:11, name:"Classic White", price:6800, category:"men", brand:"Amie", img:"images/product11.jpg", desc:"Minimal, clean silhouette."},
  {id:12, name:"Color Splash", price:9200, category:"women", brand:"Puma", img:"images/product12.jpg", desc:"Vibrant design."}
];

/* ---------- Utilities ---------- */
function formatKsh(n){ return 'Ksh ' + n.toLocaleString(); }

/* ---------- Render products on pages ---------- */
/*
  On pages, add a container:
  <div class="product-grid" data-category="men"></div>
  or data-category="all" to show everything
*/
function renderProducts(){
  const grids = document.querySelectorAll('.product-grid');
  grids.forEach(grid => {
    const cat = grid.dataset.category || 'all';
    const filtered = (cat === 'all') ? products : (cat === 'new' ? products.filter(p=> ['new'].includes(p.category) || p.category==='new' : products.filter(p=>p.category === cat));
    // NOTE: the above uses 'new' category explicitly; you can change logic per your page
  });

  // we'll use a safer approach below
  grids.forEach(grid => {
    const cat = grid.dataset.category || 'all';
    let items;
    if(cat === 'all') items = products;
    else if(cat === 'new') items = products.filter(p => p.category === 'new');
    else items = products.filter(p => p.category === cat);

    grid.innerHTML = items.map(p => `
      <article class="product" data-id="${p.id}">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">${formatKsh(p.price)}</p>
        <p class="muted">${p.brand}</p>
        <p>${p.desc}</p>
        <div class="row">
          <button class="btn add-cart" data-id="${p.id}">Add to cart</button>
          <a class="btn" href="contact.html">Reserve</a>
        </div>
      </article>
    `).join('');
  });
}

/* ---------- Cart (localStorage) ---------- */
function getCart(){ return JSON.parse(localStorage.getItem('amie_cart') || '[]'); }
function saveCart(cart){ localStorage.setItem('amie_cart', JSON.stringify(cart)); updateCartCount(); }
function addToCart(id){
  const p = products.find(x => x.id === Number(id));
  if(!p) return;
  const cart = getCart();
  const found = cart.find(i => i.id === p.id);
  if(found) found.qty++;
  else cart.push({id:p.id, name:p.name, price:p.price, img:p.img, qty:1});
  saveCart(cart);
  showCartModal(); // quick feedback
}
function updateCartCount(){
  const count = getCart().reduce((s,i) => s + i.qty, 0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = count;
}
function renderCartItems(){
  const container = document.getElementById('cart-list');
  if(!container) return;
  const cart = getCart();
  if(cart.length === 0){ container.innerHTML = '<p class="center">Your cart is empty.</p>'; return; }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div style="flex:1">
        <strong>${item.name}</strong>
        <div>${formatKsh(item.price)} × ${item.qty}</div>
      </div>
      <div>
        <button class="cart-minus" data-id="${item.id}">−</button>
        <button class="cart-plus" data-id="${item.id}">+</button>
      </div>
    </div>
  `).join('') + `<hr><p><strong>Total: ${formatKsh(cart.reduce((s,i)=>s+i.price*i.qty,0))}</strong></p>`;
}

/* ---------- Cart modal open/close ---------- */
function showCartModal(){
  const modal = document.getElementById('cart-modal');
  if(!modal) return;
  modal.classList.add('open');
  renderCartItems();
}
function hideCartModal(){
  const modal = document.getElementById('cart-modal');
  if(!modal) return;
  modal.classList.remove('open');
}

/* ---------- DOM events ---------- */
document.addEventListener('DOMContentLoaded', ()=>{

  // render products wherever there's .product-grid
  renderProducts();
  updateCartCount();

  // global click handler for add to cart buttons
  document.body.addEventListener('click', (e)=>{
    if(e.target.matches('.add-cart')){
      const id = e.target.dataset.id;
      addToCart(id);
    }
    if(e.target.matches('#cart-toggle')){
      showCartModal();
    }
    if(e.target.matches('#cart-close')){
      hideCartModal();
    }
    if(e.target.matches('.cart-plus')){
      const id = Number(e.target.dataset.id);
      const cart = getCart();
      const item = cart.find(i => i.id === id);
      if(item){ item.qty++; saveCart(cart); renderCartItems(); updateCartCount(); }
    }
    if(e.target.matches('.cart-minus')){
      const id = Number(e.target.dataset.id);
      let cart = getCart();
      const idx = cart.findIndex(i => i.id === id);
      if(idx > -1){
        cart[idx].qty--;
        if(cart[idx].qty <= 0) cart.splice(idx,1);
        saveCart(cart); renderCartItems(); updateCartCount();
      }
    }
  });

  // nav toggle (mobile)
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if(navToggle && nav) navToggle.addEventListener('click', ()=> nav.classList.toggle('open'));

  // contact form validation
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      const msgEl = document.getElementById('form-msg');
      if(!name || !email || !message){
        msgEl.textContent = 'Please fill all fields.'; msgEl.style.color='crimson'; return;
      }
      if(!/\S+@\S+\.\S+/.test(email)){ msgEl.textContent = 'Invalid email.'; msgEl.style.color='crimson'; return; }
      msgEl.textContent = 'Thanks! We received your message (demo).'; msgEl.style.color='green';
      contactForm.reset();
    });
  }

  // simple slider (home)
  const slider = document.getElementById('home-slider');
  if(slider){
    const slides = Array.from(slider.querySelectorAll('.slide'));
    let idx = 0;
    slides.forEach((s,i)=>{ s.style.position='absolute'; s.style.left = (i*100)+'%'; s.style.top='0'; s.style.width='100%';});
    function go(n){ slides.forEach((s,i)=> s.style.transform = `translateX(${(i-n)*100}%)`); }
    go(idx);
    document.getElementById('slider-next')?.addEventListener('click', ()=>{ idx=(idx+1)%slides.length; go(idx); });
    document.getElementById('slider-prev')?.addEventListener('click', ()=>{ idx=(idx-1+slides.length)%slides.length; go(idx); });
    setInterval(()=>{ idx=(idx+1)%slides.length; go(idx); }, 6000);
  }

  // cart close when clicking outside
  document.addEventListener('click', (e)=> {
    const modal = document.getElementById('cart-modal');
    if(modal && !modal.contains(e.target) && !e.target.matches('#cart-toggle')) {
      modal.classList.remove('open');
    }
  });

});
