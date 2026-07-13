/* ================= DATA PRODUK ================= */
/* Untuk mengganti gambar produk, cukup ubah nilai "img" pada tiap objek di bawah ini
   dengan path/link gambar yang diinginkan (contoh: "images/pashmina.jpg") */
const products = [
  {
    id: "pashmina-viscose",
    name: "Pashmina Viscose",
    price: 150000,
    cat: "pashmina",
    img: "https://placehold.co/300x300/e8869f/ffffff?text=Pashmina+Viscose",
  },
  {
    id: "hijab-segiempat",
    name: "Hijab Segi Empat",
    price: 65000,
    cat: "segiempat",
    img: "https://placehold.co/300x300/eda6b8/ffffff?text=Hijab+Segi+Empat",
  },
  {
    id: "hijab-instan",
    name: "Hijab Instan",
    price: 50000,
    cat: "instan",
    img: "https://placehold.co/300x300/f0b9c8/ffffff?text=Hijab+Instan",
  },
  {
    id: "abaya",
    name: "Abaya",
    price: 350000,
    cat: "abaya",
    img: "https://placehold.co/300x300/c85c78/ffffff?text=Abaya",
  },
  {
    id: "gamis-premium",
    name: "Gamis Premium",
    price: 500000,
    cat: "gamis",
    img: "https://placehold.co/300x300/d8ad6d/ffffff?text=Gamis+Premium",
  },
  {
    id: "tunik",
    name: "Tunik",
    price: 99000,
    cat: "tunik",
    img: "https://placehold.co/300x300/e8869f/ffffff?text=Tunik",
  },
  {
    id: "inner-hijab",
    name: "Inner Hijab",
    price: 35000,
    cat: "inner",
    img: "https://placehold.co/300x300/eda6b8/ffffff?text=Inner+Hijab",
  },
  {
    id: "peniti-bros",
    name: "Peniti & Bros",
    price: 25000,
    cat: "aksesoris",
    img: "https://placehold.co/300x300/d8ad6d/ffffff?text=Peniti+%26+Bros",
  },
  {
    id: "rok-islami",
    name: "Rok Islami",
    price: 165000,
    cat: "rok",
    img: "https://placehold.co/300x300/c85c78/ffffff?text=Rok+Islami",
  },
  {
    id: "scrunchie-satin",
    name: "Scrunchie Satin",
    price: 20000,
    cat: "aksesoris",
    img: "https://placehold.co/300x300/f0b9c8/ffffff?text=Scrunchie+Satin",
  },
];

let cart = {}; // {productId: qty}
let selectedPaymentMethod = null;

function formatRp(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

/* ================= RENDER KATALOG ================= */
function renderCatalog() {
  document.querySelectorAll(".grid").forEach((g) => (g.innerHTML = ""));
  products.forEach((p) => {
    const grid = document.querySelector(`.grid[data-grid="${p.cat}"]`);
    if (!grid) return;
    const card = document.createElement("div");
    card.className = "card";
    card.id = "product-" + p.id;
    card.innerHTML = `
      <div class="imgbox"><img src="${p.img}" alt="${p.name}"></div>
      <div class="card-body">
        <h4>${p.name}</h4>
        <div class="price">${formatRp(p.price)}</div>
        <div class="qty-row">
          <button onclick="changeTempQty('${p.id}',-1)">-</button>
          <span id="tempqty-${p.id}">1</span>
          <button onclick="changeTempQty('${p.id}',1)">+</button>
        </div>
        <button class="add-btn" onclick="addToCart('${
          p.id
        }')">+ Tambah ke Keranjang</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

const tempQty = {};
function changeTempQty(id, delta) {
  tempQty[id] = Math.max(1, (tempQty[id] || 1) + delta);
  document.getElementById("tempqty-" + id).textContent = tempQty[id];
}

function addToCart(id) {
  const qty = tempQty[id] || 1;
  cart[id] = (cart[id] || 0) + qty;
  tempQty[id] = 1;
  document.getElementById("tempqty-" + id).textContent = 1;
  renderCart();
  flashCart();
}

function flashCart() {
  const btn = document.querySelector(".cart-btn");
  btn.style.transform = "scale(1.15)";
  setTimeout(() => (btn.style.transform = "scale(1)"), 180);
}

/* ================= CART PANEL ================= */
function toggleCart() {
  document.getElementById("cartPanel").classList.toggle("open");
  document.getElementById("cartOverlay").classList.toggle("show");
}

function renderCart() {
  const itemsWrap = document.getElementById("cartItems");
  const ids = Object.keys(cart).filter((id) => cart[id] > 0);
  let total = 0;
  let count = 0;

  if (ids.length === 0) {
    itemsWrap.innerHTML =
      '<div class="cart-empty">Keranjang masih kosong ðŸ©·<br>Yuk pilih produk favoritmu dulu!</div>';
  } else {
    itemsWrap.innerHTML = ids
      .map((id) => {
        const p = products.find((x) => x.id === id);
        const qty = cart[id];
        const subtotal = p.price * qty;
        total += subtotal;
        count += qty;
        return `
        <div class="cart-item">
          <img src="${p.img}" alt="${p.name}">
          <div class="info">
            <h5>${p.name}</h5>
            <div class="price">${formatRp(p.price)} x ${qty} = ${formatRp(
          subtotal
        )}</div>
            <div class="ctrl">
              <button onclick="cartQty('${id}',-1)">-</button>
              <span>${qty}</span>
              <button onclick="cartQty('${id}',1)">+</button>
              <button class="remove" onclick="removeFromCart('${id}')">Hapus</button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  document.getElementById("cartTotal").textContent = formatRp(total);
  document.getElementById("cartCount").textContent = count;
  renderOrderSummary();
}

function cartQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

function resetCart() {
  cart = {};
  renderCart();
}

function goCheckout() {
  toggleCart();
  document
    .getElementById("order-section")
    .scrollIntoView({ behavior: "smooth" });
}

/* ================= ORDER SUMMARY IN FORM ================= */
function renderOrderSummary() {
  const wrap = document.getElementById("orderCartSummary");
  const ids = Object.keys(cart).filter((id) => cart[id] > 0);
  if (ids.length === 0) {
    wrap.innerHTML =
      '<div style="opacity:.7;">Belum ada produk di keranjang.</div>';
    return;
  }
  let total = 0;
  wrap.innerHTML =
    ids
      .map((id) => {
        const p = products.find((x) => x.id === id);
        const qty = cart[id];
        const subtotal = p.price * qty;
        total += subtotal;
        return `<div class="row"><span>${p.name} x${qty}</span><span>${formatRp(
          subtotal
        )}</span></div>`;
      })
      .join("") +
    `<div class="row" style="border-top:1px solid var(--pink-soft);margin-top:6px;padding-top:8px;font-weight:700;"><span>Total</span><span>${formatRp(
      total
    )}</span></div>`;
}

/* ================= PEMBAYARAN ================= */
function selectPayment(el) {
  document
    .querySelectorAll(".pay-opt")
    .forEach((o) => o.classList.remove("selected"));
  el.classList.add("selected");
  selectedPaymentMethod = el.dataset.method;
}

function submitOrder() {
  const name = document.getElementById("ordName").value.trim();
  const phone = document.getElementById("ordPhone").value.trim();
  const address = document.getElementById("ordAddress").value.trim();
  const msg = document.getElementById("formMsg");
  const ids = Object.keys(cart).filter((id) => cart[id] > 0);

  if (!name || !phone || !address) {
    msg.textContent = "Mohon lengkapi semua data pemesan terlebih dahulu.";
    msg.style.display = "block";
    return;
  }
  if (ids.length === 0) {
    msg.textContent =
      "Keranjang masih kosong, silakan pilih produk dulu ya ðŸ©·";
    msg.style.display = "block";
    return;
  }
  if (!selectedPaymentMethod) {
    msg.textContent = "Silakan pilih metode pembayaran terlebih dahulu.";
    msg.style.display = "block";
    return;
  }
  msg.style.display = "none";

  let total = 0;
  ids.forEach((id) => {
    const p = products.find((x) => x.id === id);
    total += p.price * cart[id];
  });

  openPaymentModal(selectedPaymentMethod, total);
}

function openPaymentModal(method, total) {
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  if (method === "Cash") {
    title.textContent = "ðŸ’µ Pembayaran Cash";
    body.innerHTML = `
      <p style="font-size:13.5px;color:var(--text);margin-bottom:10px;">Pembayaran cash dapat dilakukan secara COD atau saat mengambil pesanan langsung di toko kami.</p>
      <div class="total">${formatRp(total)}</div>
      <p class="note">Total yang harus dibayarkan saat transaksi.</p>
    `;
  } else if (method === "QRIS") {
    title.textContent = "ðŸ“± Pembayaran QRIS";
    const qrData = encodeURIComponent(
      "MaharaniFashion-Pembayaran-Total-" + total
    );
    body.innerHTML = `
      <img class="qr" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrData}" alt="QR Code Pembayaran">
      <div class="total">${formatRp(total)}</div>
      <p class="note">Scan QR code di atas menggunakan aplikasi e-wallet/mobile banking untuk membayar.</p>
    `;
  } else if (method === "DANA") {
    title.textContent = "ðŸ’™ Pembayaran DANA";
    body.innerHTML = `
      <div class="logo logo-dana" style="margin:0 auto 14px;">D</div>
      <p style="font-size:13px;color:var(--text);margin-bottom:6px;">Transfer ke nomor DANA berikut:</p>
      <div class="acc">083821158065</div>
      <div class="total">${formatRp(total)}</div>
      <p class="note">Setelah transfer, kirim bukti pembayaran melalui WhatsApp kami.</p>
    `;
  }
  document.getElementById("modalOverlay").classList.add("show");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("show");
}

/* ================= HERO SLIDER ================= */
let slideIndex = 0;
const totalSlides = 3;
function renderDots() {
  const dotsWrap = document.getElementById("sliderDots");
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  for (let i = 0; i < totalSlides; i++) {
    const d = document.createElement("div");
    d.className = "dot" + (i === slideIndex ? " active" : "");
    dotsWrap.appendChild(d);
  }
}
function slideMove(dir) {
  slideIndex = (slideIndex + dir + totalSlides) % totalSlides;
  const track = document.getElementById("slidesTrack");
  if (track) track.style.transform = `translateX(-${slideIndex * 100}%)`;
  renderDots();
}
renderDots();
setInterval(() => slideMove(1), 6000);

function goToProduct(id) {
  const el = document.getElementById("product-" + id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("highlight");
    setTimeout(() => el.classList.remove("highlight"), 2200);
  }
}

/* ================= SEARCH ================= */
function doSearch() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  if (!q) return;
  const found = products.find((p) => p.name.toLowerCase().includes(q));
  if (found) {
    goToProduct(found.id);
  } else {
    alert("Produk tidak ditemukan. Coba kata kunci lain ya ðŸ©·");
  }
}

/* ================= SIDEBAR (MOBILE) ================= */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}
document.querySelectorAll(".cat-link").forEach((a) => {
  a.addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("open");
  });
});

/* ================= INIT ================= */
renderCatalog();
renderCart();
