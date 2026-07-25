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
                    
                    // PERBAIKAN LOGO: object-fit: cover dan hapus background putih
                    card.innerHTML = `
                        <div style="background:rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius:16px; padding:15px; text-align:center; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; cursor:pointer; transition: 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"
                        onmouseover="this.style.borderColor='#ff2a75'" onmouseout="this.style.borderColor='rgba(255,255,255,0.1)'">
                            
                            <div style="width: 75px; height: 75px; border-radius: 18px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(255, 42, 117, 0.2);">
                                <img src="${linkLogo}" alt="${namaApp}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 18px;">
                            </div>

                            <h3 style="font-size:1.05rem; color:#fff; font-weight:600; margin:0;">${namaApp}</h3>
                        </div>
                    `;

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
