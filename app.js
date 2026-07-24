import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

let dataProduk = {};
let dataLogo = {};

document.addEventListener('DOMContentLoaded', async () => {
    
    // ==========================================
    // 1. SINKRONISASI & PENCETAK OTOMATIS
    // ==========================================
    try {
        const docRef = doc(db, "toko", "katalog");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            dataProduk = snap.data().dataProduk || {};
            dataLogo = snap.data().dataLogo || {};
            console.log("✅ Database terhubung!");

            // Cari area penampung di HTML
            const katalogContainer = document.getElementById('katalogProduk');
            
            if(katalogContainer) {
                katalogContainer.innerHTML = ''; // Hapus tulisan loading
                
                // Mulai mencetak kotak produk satu per satu
                Object.keys(dataProduk).sort().forEach(namaApp => {
                    const linkLogo = dataLogo[namaApp] || 'https://via.placeholder.com/150';
                    
                    const card = document.createElement('div');
                    card.className = 'product-card'; 
                    card.setAttribute('data-name', namaApp);
                    
                    // Desain kotak produk
                    card.innerHTML = `
                        <div style="background:rgba(255,255,255,0.05); border: 1px solid rgba(255,42,117,0.3); border-radius:15px; padding:15px; text-align:center; height:100%; display:flex; flex-direction:column; justify-content:space-between; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                            <img src="${linkLogo}" alt="${namaApp}" style="width:80px; height:80px; object-fit:cover; border-radius:15px; margin: 0 auto 15px auto; border: 1px solid #ff2a75;">
                            <h3 style="font-size:1.1rem; color:#fff; font-weight:bold; margin-bottom:15px;">${namaApp}</h3>
                            <button class="btn-pilih" data-product="${namaApp}" style="background:#ff2a75; color:#fff; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%;">Pilih Paket</button>
                        </div>
                    `;
                    katalogContainer.appendChild(card);
                });
            }
        }
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }

    // ==========================================
    // 2. FITUR PENCARIAN (SEARCH)
    // ==========================================
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                const title = card.getAttribute('data-name').toLowerCase();
                if(title.includes(term)) { card.style.display = "block"; } 
                else { card.style.display = "none"; }
            });
        });
    }

    // ==========================================
    // 3. LOGIKA POP-UP CHECKOUT 
    // ==========================================
    const orderModal = document.getElementById('orderModal');
    const closeModal = document.getElementById('closeModal');
    const variantList = document.getElementById('variantList');
    const modalProductName = document.getElementById('modalProductName');
    const btnCheckout = document.getElementById('btnCheckout');

    // Gunakan deteksi klik Global agar tombol yang baru dicetak bisa dipencet
    document.body.addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-pilih')) {
            if(!orderModal) return;
            
            const productName = e.target.getAttribute('data-product');
            modalProductName.innerText = productName;
            variantList.innerHTML = ''; 

            const varians = dataProduk[productName];
            
            if (varians && varians.length > 0) {
                varians.forEach((varian, index) => {
                    const checked = index === 0 ? 'checked' : ''; 
                    const html = `
                        <label class="variant-card click-target" style="display:flex; justify-content:space-between; background:rgba(0,0,0,0.5); padding:15px; border-radius:10px; margin-bottom:10px; border:1px solid #ff2a75; cursor:pointer;">
                            <div>
                                <input type="radio" name="varian" value="${varian.nama}" ${checked} data-harga="${varian.harga}">
                                <span class="variant-name" style="margin-left:10px; font-weight:bold; color:white;">${varian.nama}</span>
                            </div>
                            <span class="variant-price" style="color:#2ed573; font-weight:bold;">${varian.harga}</span>
                        </label>
                    `;
                    variantList.innerHTML += html;
                });
            }
            orderModal.classList.add('show');
        }
    });

    if(closeModal && orderModal) {
        closeModal.addEventListener('click', () => { orderModal.classList.remove('show'); });
        orderModal.addEventListener('click', (e) => { if (e.target === orderModal) { orderModal.classList.remove('show'); } });
    }

    if(btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            const namaProduk = modalProductName.innerText;
            const inputVarian = document.querySelector('input[name="varian"]:checked');
            
            if (!inputVarian) { return alert('Silakan pilih varian paket!'); }

            const varianPilihan = inputVarian.value;
            const hargaPilihan = inputVarian.getAttribute('data-harga');
            const inputPayment = document.querySelector('input[name="payment"]:checked');
            const metodePembayaran = inputPayment ? inputPayment.value : 'Belum dipilih';

            const pesan = `Halo Veltrastoreid! 👋%0ASaya mau order layanan premium dengan detail berikut:%0A%0A📱 *Produk:* ${namaProduk}%0A⏱️ *Varian:* ${varianPilihan}%0A🏷️ *Harga:* ${hargaPilihan}%0A💳 *Metode Bayar:* ${metodePembayaran}%0A%0AMohon totalan dan instruksi pembayarannya ya, Kak! Terima kasih.`;
            
            window.open(`https://wa.me/6285166497792?text=${pesan}`, '_blank');
        });
    }
});
