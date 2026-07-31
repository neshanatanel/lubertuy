// script.js - SweetBite Café

// ===== DATA PRODUK =====
const products = [
    {
        id: 1,
        name: 'Chicken Katsu',
        category: 'makanan',
        price: 25000,
        desc: 'Renyah, juicy, favorit!',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&h=150&fit=crop'
    },
    {
        id: 2,
        name: 'Spaghetti Carbonara',
        category: 'makanan',
        price: 28000,
        desc: 'Creamy pasta with pancetta',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1645112411342-9665a3c7b4e3?w=200&h=150&fit=crop'
    },
    {
        id: 3,
        name: 'Beef Burger',
        category: 'makanan',
        price: 22000,
        desc: 'Beef patty, cheese, fresh veg',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1568901346375-23c1d3c6e1fe?w=200&h=150&fit=crop'
    },
    {
        id: 4,
        name: 'French Fries',
        category: 'makanan',
        price: 15000,
        desc: 'Golden crispy with sauce',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=150&fit=crop'
    },
    {
        id: 5,
        name: 'Strawberry Cake',
        category: 'dessert',
        price: 20000,
        desc: 'Cake lembut dengan stroberi',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=150&fit=crop'
    },
    {
        id: 6,
        name: 'Chocolate Brownies',
        category: 'dessert',
        price: 18000,
        desc: 'Fudgy brownies dark choco',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&h=150&fit=crop'
    },
    {
        id: 7,
        name: 'Mochi',
        category: 'dessert',
        price: 15000,
        desc: 'Kenyal, manis, isian kacang',
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&h=150&fit=crop'
    },
    {
        id: 8,
        name: 'Pudding Caramel',
        category: 'dessert',
        price: 17000,
        desc: 'Puding lembut saus karamel',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1587312047223-2aa94efb077c?w=200&h=150&fit=crop'
    },
    {
        id: 9,
        name: 'Strawberry Milk',
        category: 'minuman',
        price: 18000,
        desc: 'Susu segar dengan stroberi',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&h=150&fit=crop'
    },
    {
        id: 10,
        name: 'Matcha Latte',
        category: 'minuman',
        price: 20000,
        desc: 'Matcha creamy, rasa khas',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1529892485617-25f63cd7b2c9?w=200&h=150&fit=crop'
    },
    {
        id: 11,
        name: 'Chocolate Milk',
        category: 'minuman',
        price: 18000,
        desc: 'Susu coklat manis & creamy',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=200&h=150&fit=crop'
    },
    {
        id: 12,
        name: 'Lemon Tea',
        category: 'minuman',
        price: 12000,
        desc: 'Teh lemon segar dan manis',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=150&fit=crop'
    }
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('sweetbite_cart')) || [];
let currentCategory = 'all';
let searchQuery = '';

// ===== DOM ELEMENTS =====
const grid = document.getElementById('productGrid');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const modal = document.getElementById('checkoutModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const toastContainer = document.getElementById('toastContainer');

// ===== RENDER PRODUCTS =====
function renderProducts() {
    let filtered = products;
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #a08787;">
                Tidak ada produk yang ditemukan 😢
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map(p => {
        const fullStars = Math.floor(p.rating);
        const halfStar = p.rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        const stars = '⭐'.repeat(fullStars) + (halfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
        
        return `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <h3>${p.name}</h3>
                <div class="desc">${p.desc}</div>
                <div class="price">Rp${p.price.toLocaleString()}</div>
                <div class="rating">${stars}</div>
                <button class="btn-add" data-id="${p.id}">Tambah ke Keranjang</button>
            </div>
        `;
    }).join('');
    
    // Event listener untuk tombol tambah ke keranjang
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            addToCart(id);
        });
    });
}

// ===== CART FUNCTIONS =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    saveCart();
    showToast('Berhasil ditambahkan ke keranjang 💕');
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function changeQuantity(index, delta) {
    if (cart[index].qty + delta <= 0) {
        removeFromCart(index);
        return;
    }
    cart[index].qty += delta;
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('sweetbite_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;
    renderCartItems();
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                Keranjangmu masih kosong 🥺💕<br>
                Yuk pilih makanan favoritmu!
            </div>
        `;
        cartTotalEl.textContent = 'Total: Rp0';
        checkoutBtn.disabled = true;
        return;
    }
    
    checkoutBtn.disabled = false;
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <strong>${item.name}</strong><br>
                    Rp${item.price.toLocaleString()} × ${item.qty}
                    <div style="font-size:0.9rem; color:#b36b80;">
                        Subtotal: Rp${subtotal.toLocaleString()}
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-qty-minus" data-index="${index}">−</button>
                    <span>${item.qty}</span>
                    <button class="cart-qty-plus" data-index="${index}">+</button>
                    <button class="cart-remove" data-index="${index}" style="background:none; border:none; font-size:1.2rem; cursor:pointer;">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsList.innerHTML = html;
    cartTotalEl.textContent = `Total: Rp${total.toLocaleString()}`;
    
    // Event listeners untuk cart items
    document.querySelectorAll('.cart-qty-plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            changeQuantity(idx, 1);
        });
    });
    
    document.querySelectorAll('.cart-qty-minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            changeQuantity(idx, -1);
        });
    });
    
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            removeFromCart(idx);
        });
    });
}

// ===== TOAST =====
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

// ===== EVENT LISTENERS =====

// Category buttons
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.dataset.category;
        renderProducts();
    });
});

// Search
document.getElementById('searchInput').addEventListener('input', function() {
    searchQuery = this.value;
    renderProducts();
});

// Cart toggle
document.getElementById('cartToggle').addEventListener('click', () => {
    cartPanel.classList.toggle('open');
});

closeCartBtn.addEventListener('click', () => {
    cartPanel.classList.remove('open');
});

// Hero order button
document.getElementById('heroOrderBtn').addEventListener('click', () => {
    document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
});

// Checkout button
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) return;
    modal.classList.add('show');
});

// Close modal
modal.addEventListener('click', function(e) {
    if (e.target === this) {
        modal.classList.remove('show');
    }
});

// Checkout form
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('custName').value.trim();
    const wa = document.getElementById('custWa').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    
    if (!name || !wa || !address) {
        showToast('Harap lengkapi data pesanan!');
        return;
    }
    
    // Success
    modal.classList.remove('show');
    cart = [];
    saveCart();
    updateCartUI();
    cartPanel.classList.remove('open');
    
    // Reset form
    this.reset();
    
    // Show success popup
    alert('🎉 Pesanan Berhasil!\nTerima kasih sudah memesan di SweetBite Café 💕\nTunggu pesananmu sampai!');
    showToast('Pesanan berhasil 💕');
});

// ===== INIT =====
renderProducts();
updateCartUI();
