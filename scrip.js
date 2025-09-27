// ========== NAV TOGGLE ==========
const menuBtn = document.querySelector('#menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// ========== IMAGE SLIDER ==========
let slideIndex = 0;
function showSlides() {
  const slides = document.querySelectorAll('.slide');
  slides.forEach((slide, i) => {
    slide.style.display = (i === slideIndex) ? 'block' : 'none';
  });
  slideIndex = (slideIndex + 1) % slides.length;
  setTimeout(showSlides, 3000); // Change every 3s
}
showSlides();

// ========== FORM VALIDATION ==========
function validateForm(event) {
  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  if (name === "" || email === "") {
    alert("Please fill all required fields!");
    event.preventDefault();
  }
}
const form = document.querySelector('form');
if (form) form.addEventListener('submit', validateForm);

// ========== SEARCH FUNCTIONALITY ==========
const searchInput = document.querySelector('#search');
if (searchInput) {
  searchInput.addEventListener('keyup', function() {
    const filter = searchInput.value.toLowerCase();
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
      const text = product.textContent.toLowerCase();
      product.style.display = text.includes(filter) ? "block" : "none";
    });
  });
}

// ========== ADD TO CART ==========
let cart = [];
function addToCart(product, price) {
  cart.push({ product, price });
  updateCart();
}
function updateCart() {
  const cartList = document.querySelector('#cart-list');
  const total = document.querySelector('#total');
  if (cartList && total) {
    cartList.innerHTML = "";
    let sum = 0;
    cart.forEach(item => {
      let li = document.createElement("li");
      li.textContent = `${item.product} - Ksh ${item.price}`;
      cartList.appendChild(li);
      sum += item.price;
    });
    total.textContent = "Total: Ksh " + sum;
  }
}

// ========== SCROLL TO TOP ==========
const scrollBtn = document.querySelector('#scroll-top');
window.addEventListener('scroll', () => {
  scrollBtn.style.display = (window.scrollY > 200) ? "block" : "none";
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== SCROLL ANIMATIONS ==========
const animatedItems = document.querySelectorAll('.animate');
window.addEventListener('scroll', () => {
  animatedItems.forEach(item => {
    const itemTop = item.getBoundingClientRect().top;
    if (itemTop < window.innerHeight - 50) {
      item.classList.add('visible');
    }
  });
});
