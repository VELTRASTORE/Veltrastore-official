// Mengimpor sistem Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Kunci Rahasia Firebase Web Veltrastore Milikmu
const firebaseConfig = {
    apiKey: "AIzaSyCZ9JmZRYU3i9_mrYsZPj7nr566wR7VQ78",
    authDomain: "veltra-store-694e1.firebaseapp.com",
    projectId: "veltra-store-694e1",
    storageBucket: "veltra-store-694e1.firebasestorage.app",
    messagingSenderId: "601493638172",
    appId: "1:601493638172:web:12d9153c605d9b6e9863d9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variabel untuk menampung data dari database
let dataProduk = {};

document.addEventListener('DOMContentLoaded', async () => {
    
    // ==========================================
    // 1. SINKRONISASI DATA DARI FIREBASE 
    // ==========================================
    try {
        const docRef = doc(db, "toko", "katalog");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            dataProduk = snap.data().dataProduk;
            console.log("✅ Database berhasil terhubung ke halaman utama!");
        } else {
            console.log("⚠️ Database kosong. Pastikan sudah klik Upload di admin.html");
        }
    } catch (error) {
        console.error("Gagal mengambil data dari database:", error);
    }

    // ==========================================
    // 2. LOGIKA TAMPILAN WEBSITE BAWAAN
    // ==========================================
    const hamburger = document.getElementById('hamburgerMenu');
    const navDropdown = document.getElementById('navDropdown');
    if(hamburger && navDropdown) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); 
            hamburger.classList.toggle('active');
            navDropdown.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navDropdown.contains(e.target)) {
                hamburger.classList.remove('active');
                navDropdown.classList.remove('open');
            }
        });
    }

    const faqItems = document.querySelectorAll('.faq-item');
    if(faqItems.length > 0) {
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                const currentActive = document.querySelector('.faq-item.active-faq');
                if (currentActive && currentActive !== item) {
                    currentActive.classList.remove('active-faq');
                }
                item.classList.toggle('active-faq');
            });
        });
    }

    const revealElements = document.querySelectorAll('.scroll-reveal');
    if(revealElements.length > 0) {
        const observerOptions = { root: null, threshold: 0.1, rootMargin: "0px 0px 0px 0px" };
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('appear'); } 
                else { entry.target.classList.remove('appear'); }
            });
        }, observerOptions);
        revealElements.forEach(element => scrollObserver.observe(element));
    }

    // ==========================================
    // 3. LOGIKA HALAMAN PRODUK & PENCARIAN
    // ==========================================
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const placeholders = ["Cari Netflix...", "Cari CapCut...", "Cari Spotify...", "Cari Canva..."];
        let i = 0;
        setInterval(() => {
            searchInput.setAttribute("placeholder", placeholders[i]);
            i = (i + 1) % placeholders.length;
        }, 2000);

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                const title = card.getAttribute('data-name').toLowerCase();
                if(title.includes(term)) { card.style.display = "flex"; } 
                else { card.style.display = "none"; }
            });
        });
    }

    const pills = document.querySelectorAll('.pill');
    if (pills.length > 0) {
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const filter = pill.getAttribute('data-filter');
                const cards = document.querySelectorAll('.product-card');

                cards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });
    }

    // ==========================================
    // 4. CHECKOUT POP-UP MENGGUNAKAN DATA FIREBASE
    // ==========================================
    const orderModal = document.getElementById('orderModal');
    const closeModal = document.getElementById('closeModal');
    const variantList = document.getElementById('variantList');
    const modalProductName = document.getElementById('modalProductName');
    const btnCheckout = document.getElementById('btnCheckout');

    if (orderModal) {
        document.querySelectorAll('.btn-pilih').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productName = e.target.getAttribute('data-product');
                modalProductName.innerText = productName;
                variantList.innerHTML = ''; 

                // Menarik data varian dan harga langsung dari database Firebase
                const varians = dataProduk[productName];
                
                if (varians && varians.length > 0) {
                    varians.forEach((varian, index) => {
                        const checked = index === 0 ? 'checked' : ''; 
                        const html = `
                            <label class="variant-card click-target">
                                <input type="radio" name="varian" value="${varian.nama}" ${checked} data-harga="${varian.harga}">
                                <span class="variant-name">${varian.nama}</span>
                                <span class="variant-price">${varian.harga}</span>
                            </label>
                        `;
                        variantList.innerHTML += html;
                    });
                } else {
                    variantList.innerHTML = `<p style="color:#ff2a75; font-size:0.9rem; text-align:center;">Varian sedang diupdate atau belum tersedia. Coba refresh halaman!</p>`;
                }

                orderModal.classList.add('show');
            });
        });

        closeModal.addEventListener('click', () => { orderModal.classList.remove('show'); });
        orderModal.addEventListener('click', (e) => { if (e.target === orderModal) { orderModal.classList.remove('show'); } });

        btnCheckout.addEventListener('click', () => {
            const namaProduk = modalProductName.innerText;
            const inputVarian = document.querySelector('input[name="varian"]:checked');
            
            if (!inputVarian) {
                alert('Silakan pilih varian paket terlebih dahulu!');
                return;
            }

            const varianPilihan = inputVarian.value;
            const hargaPilihan = inputVarian.getAttribute('data-harga');
            
            // Ambil metode pembayaran (pastikan elemennya ada)
            const inputPayment = document.querySelector('input[name="payment"]:checked');
            const metodePembayaran = inputPayment ? inputPayment.value : 'Belum dipilih';

            const pesan = `Halo Veltrastoreid! 👋%0ASaya mau order layanan premium dengan detail berikut:%0A%0A📱 *Produk:* ${namaProduk}%0A⏱️ *Varian:* ${varianPilihan}%0A🏷️ *Harga:* ${hargaPilihan}%0A💳 *Metode Bayar:* ${metodePembayaran}%0A%0AMohon totalan dan instruksi pembayarannya ya, Kak! Terima kasih.`;
            
            const urlWA = `https://wa.me/6285166497792?text=${pesan}`;
            window.open(urlWA, '_blank');
        });
    }
});
