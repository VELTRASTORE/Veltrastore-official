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

document.addEventListener('DOMContentLoaded', () => {
    
    // Fitur Search
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

    fetchDatabase();
});

async function fetchDatabase() {
    try {
        const docRef = doc(db, "toko", "katalog");
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
            dataProduk = snap.data().dataProduk || {};
            dataLogo = snap.data().dataLogo || {};

            const katalogContainer = document.getElementById('katalogProduk');
            if(katalogContainer) {
                katalogContainer.innerHTML = ''; 
                
                Object.keys(dataProduk).sort().forEach(namaApp => {
                    const linkLogo = dataLogo[namaApp] || 'https://via.placeholder.com/150';
                    
                    const card = document.createElement('div');
                    card.className = 'product-card'; 
                    card.setAttribute('data-name', namaApp);
                    
                    // DESAIN CARD BARU: Icon Full Width tanpa background putih
                    card.innerHTML = `
                        <div style="background:rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius:16px; text-align:center; height:100%; display:flex; flex-direction:column; cursor:pointer; transition: 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.3); overflow:hidden;"
                        onmouseover="this.style.borderColor='#ff2a75'; this.style.transform='translateY(-3px)';" 
                        onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.transform='translateY(0)';">
                            
                            <!-- GAMBAR FULL CARD MENGKOTAK -->
                            <img src="${linkLogo}" alt="${namaApp}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border-bottom: 2px solid rgba(255,42,117,0.5);">

                            <!-- NAMA APLIKASI DI BAWAHNYA -->
                            <div style="padding: 12px 10px; flex-grow: 1; display: flex; align-items: center; justify-content: center;">
                                <h3 style="font-size:1rem; color:#fff; font-weight:700; margin:0; line-height: 1.3;">${namaApp}</h3>
                            </div>
                        </div>
                    `;

                    // LOGIKA BARU: Jika Card diklik, Pindah ke halaman Order!
                    card.onclick = () => {
                        window.location.href = `order.html?app=${encodeURIComponent(namaApp)}`;
                    };

                    katalogContainer.appendChild(card);
                });
            }
        }
    } catch (error) {
        console.log("Gagal memuat database:", error);
    }
}
