document.addEventListener('DOMContentLoaded', () => {

    // 1. MENU COMPACT NAVBAR
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

    // 2. FAQ (index.html)
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

    // 3. SCROLL REVEAL 
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
    // LOGIKA KHUSUS HALAMAN PRODUK (produk.html)
    // ==========================================
    
    // A. Efek Search Bar Mengetik Otomatis
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const placeholders = ["Cari Netflix...", "Cari CapCut...", "Cari Spotify...", "Cari Canva..."];
        let i = 0;
        setInterval(() => {
            searchInput.setAttribute("placeholder", placeholders[i]);
            i = (i + 1) % placeholders.length;
        }, 2000);

        // Filter Pencarian
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

    // B. Filter Kategori (Menu Geser)
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

    // C. DATABASE PRODUK & HARGA (UPDATE TERBARU - TANPA SINGKATAN)
    const dataProduk = {
        "AIO DRAMA": [{nama: "Private 3 Hari", harga: "Rp 27.000"}, {nama: "Private 7 Hari", harga: "Rp 23.000"}, {nama: "Private 1 Bulan", harga: "Rp 32.000"}],
        "Bstation": [{nama: "Sharing 1 Bulan", harga: "Rp 19.000"}, {nama: "Sharing 3 Bulan", harga: "Rp 28.000"}, {nama: "Sharing 1 Tahun", harga: "Rp 21.000"}],
        "CATCHPLAY": [{nama: "Sharing (1 Bulan)", harga: "Rp 18.000"}, {nama: "Private (1 Bulan)", harga: "Rp 27.000"}],
        "CRUNCHYROLL": [{nama: "Sharing (1 Bulan)", harga: "Rp 19.000"}, {nama: "Private (1 Bulan)", harga: "Rp 30.000"}],
        "DISNEY": [{nama: "Sharing 7 Hari (6 User)", harga: "Rp 28.000"}, {nama: "Sharing 1 Bulan (6 User)", harga: "Rp 27.000"}],
        "Dramabox": [{nama: "Sharing (1 Bulan)", harga: "Rp 26.000"}, {nama: "Private (1 Bulan)", harga: "Rp 100.000"}],
        "Gagaoolala": [{nama: "Sharing (1 Bulan, 5 User)", harga: "Rp 27.500"}],
        "Hbo Max": [{nama: "Sharing 1 Bulan (6 User Standar, Tidak Mendukung TV)", harga: "Rp 28.000"}, {nama: "Sharing 1 Bulan (8 User Ultimate, Semua Perangkat)", harga: "Rp 30.000"}],
        "IQIYI": [{nama: "Sharing 1 Bulan (6 User Standar)", harga: "Rp 18.000"}, {nama: "Sharing 1 Bulan (6 User Premium)", harga: "Rp 19.500"}, {nama: "Private 1 Bulan Standar", harga: "Rp 27.000"}, {nama: "Private 1 Bulan Premium", harga: "Rp 35.000"}],
        "Loklok": [{nama: "Sharing 1 Bulan (4 User Basic)", harga: "Rp 23.000"}, {nama: "Sharing 1 Bulan (4 User Standar)", harga: "Rp 28.000"}, {nama: "Private 1 Bulan Basic", harga: "Rp 48.000"}, {nama: "Private 1 Bulan Standar", harga: "Rp 71.000"}],
        "MANGO TV": [{nama: "Sharing (1 Bulan)", harga: "Rp 26.000"}],
        "MELOLO": [{nama: "Sharing (1 Bulan)", harga: "Rp 20.000"}],
        "NETFLIX": [
            {nama: "Sharing 1 Profil 2 User (1 Bulan)", harga: "Rp 26.000"}, {nama: "Sharing 1 Profil 2 User (2 Bulan)", harga: "Rp 42.000"},
            {nama: "Sharing 1 Profil 2 User (3 Bulan)", harga: "Rp 58.000"}, {nama: "Sharing 1 Profil 1 User (1 Bulan)", harga: "Rp 41.500"},
            {nama: "Sharing 1 Profil 1 User (2 Bulan)", harga: "Rp 73.000"}, {nama: "Sharing 1 Profil 1 User (3 Bulan)", harga: "Rp 104.000"},
            {nama: "Semi Private (1 Bulan)", harga: "Rp 43.000"}, {nama: "Semi Private (2 Bulan)", harga: "Rp 76.000"},
            {nama: "Semi Private (3 Bulan)", harga: "Rp 110.000"}, {nama: "Private (1 Bulan, Pre Order)", harga: "Rp 175.000"}
        ],
        "VIDIO": [{nama: "Sharing Platinum 1 Bulan (Khusus Mobile)", harga: "Rp 22.500"}, {nama: "Sharing Platinum 1 Bulan (Semua Perangkat)", harga: "Rp 29.000"}, {nama: "Private Platinum 1 Bulan (Khusus Mobile)", harga: "Rp 34.000"}, {nama: "Private Platinum 1 Bulan (Semua Perangkat)", harga: "Rp 47.000"}],
        "Viki Plus": [{nama: "Sharing (1 Bulan)", harga: "Rp 26.500"}],
        "Viu": [{nama: "Private Anti Limit (1 Bulan)", harga: "Rp 17.000"}, {nama: "Private Anti Limit (3 Bulan)", harga: "Rp 18.000"}, {nama: "Private Anti Limit (6 Bulan)", harga: "Rp 19.000"}, {nama: "Private Anti Limit (1 Tahun)", harga: "Rp 19.500"}, {nama: "Private Anti Limit (Selamanya)", harga: "Rp 20.000"}],
        "We Tv": [{nama: "Sharing 1 Bulan (6 User)", harga: "Rp 19.500"}, {nama: "Sharing 1 Bulan (3 User)", harga: "Rp 28.500"}, {nama: "Private 1 Bulan", harga: "Rp 34.000"}],
        "Youku": [{nama: "Sharing 1 Bulan", harga: "Rp 19.500"}, {nama: "Private 1 Bulan", harga: "Rp 35.000"}],
        "YOUTUBE": [{nama: "Individual Plan Google Workspace (1 Bulan)", harga: "Rp 31.000"}],

        "APPLE MUSIC": [{nama: "Melalui Link iOS (1 Bulan)", harga: "Rp 25.500"}],
        "SPOTIFY": [{nama: "Family Plan Full Garansi (1 Bulan)", harga: "Rp 24.500"}, {nama: "Individual Plan Full Garansi (1 Bulan)", harga: "Rp 23.000"}, {nama: "Individual Plan Tanpa Garansi (2 Bulan)", harga: "Rp 28.000"}],

        "Alight Motion": [{nama: "Private 1 Tahun Android (Akun dari Seller)", harga: "Rp 17.000"}, {nama: "Private 1 Tahun iOS (Akun dari Seller)", harga: "Rp 19.000"}, {nama: "Private 1 Tahun iOS & Android (Akun dari Pembeli)", harga: "Rp 20.000"}],
        "Capcut": [{nama: "Private Individual Plan (5 Hari)", harga: "Rp 26.000"}, {nama: "Private Individual Plan (1 Minggu)", harga: "Rp 27.500"}],
        "Lightroom": [{nama: "Sharing (1 Tahun)", harga: "Rp 28.000"}],
        "Meitu": [{nama: "Private (7 Hari)", harga: "Rp 26.000"}],
        "Picsart": [{nama: "Sharing 1 Bulan (3 User)", harga: "Rp 26.000"}, {nama: "Private 1 Bulan", harga: "Rp 26.000"}],
        "Remini Web": [{nama: "Sharing 1 Bulan (3 User)", harga: "Rp 19.500"}, {nama: "Private 1 Bulan", harga: "Rp 23.000"}],
        "VSCO": [{nama: "Sharing 1 Tahun (Khusus Android)", harga: "Rp 27.500"}, {nama: "Sharing 1 Tahun (Khusus iOS)", harga: "Rp 30.000"}],
        "Wink": [{nama: "Private (1 Bulan)", harga: "Rp 25.500"}],

        "CHAT GPT": [{nama: "Sharing 1 Bulan Plan Go (6 User)", harga: "Rp 30.000"}, {nama: "Private 1 Bulan Plan Go", harga: "Rp 65.000"}],
        "GEMINI AI": [{nama: "Undangan + Penyimpanan 5 TB (1 Bulan)", harga: "Rp 27.500"}],
        "GROK AI": [{nama: "Private (3 Hari)", harga: "Rp 20.000"}],
        "GRAMMARLY": [{nama: "Sharing 1 Bulan (6 User)", harga: "Rp 19.000"}, {nama: "Private 1 Bulan", harga: "Rp 33.000"}],
        "CAMSCANNER": [{nama: "Sharing 1 Bulan", harga: "Rp 19.500"}, {nama: "Private 1 Bulan", harga: "Rp 25.000"}],
        "CANVA": [{nama: "Member Full Garansi 7 Hari", harga: "Rp 15.300"}, {nama: "Member Full Garansi 1 Bulan", harga: "Rp 15.500"}, {nama: "Member Full Garansi 2 Bulan", harga: "Rp 15.900"}, {nama: "Member Full Garansi 3 Bulan", harga: "Rp 16.500"}, {nama: "Member Full Garansi 6 Bulan", harga: "Rp 17.500"}, {nama: "Member Full Garansi 1 Tahun", harga: "Rp 25.500"}, {nama: "Designer (1 Bulan)", harga: "Rp 16.000"}, {nama: "Head/Owner (1 Bulan)", harga: "Rp 26.500"}],
        "MS365": [{nama: "Family Plan (1 Bulan)", harga: "Rp 20.000"}],
        "WPS PRO": [{nama: "Sharing (1 Bulan)", harga: "Rp 20.000"}],
        "ZOOM": [{nama: "Private (Kapasitas 100 Peserta, 7 Hari)", harga: "Rp 25.500"}],

        "DUOLINGO": [{nama: "Private (1 Bulan)", harga: "Rp 19.000"}],
        "FIZZO": [{nama: "Sharing (1 Bulan)", harga: "Rp 20.000"}],
        "SCRIBD": [{nama: "Sharing 1 Bulan", harga: "Rp 17.500"}, {nama: "Private 1 Bulan", harga: "Rp 28.000"}],
        "WATTPAD": [{nama: "Sharing 1 Bulan", harga: "Rp 19.000"}, {nama: "Private 1 Bulan", harga: "Rp 20.500"}],
        "AMAZON PRIME": [{nama: "Sharing 1 Bulan (4 User)", harga: "Rp 18.000"}, {nama: "Sharing 1 Bulan (2 User)", harga: "Rp 20.000"}, {nama: "Private 1 Bulan", harga: "Rp 29.000"}],
        "iCLOUD+": [{nama: "Family 2 TB (2 Bulan)", harga: "Rp 85.000"}],
        "TELEPREM": [{nama: "Login Akun 1 Bulan (Nomor Indonesia)", harga: "Rp 67.000"}, {nama: "Login Akun 1 Bulan (Nomor Luar Negeri)", harga: "Rp 68.000"}]
    };

    // D. SISTEM CHECKOUT POP-UP
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

                const varians = dataProduk[productName];
                
                if (varians) {
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
                }

                orderModal.classList.add('show');
            });
        });

        closeModal.addEventListener('click', () => { orderModal.classList.remove('show'); });
        orderModal.addEventListener('click', (e) => { if (e.target === orderModal) { orderModal.classList.remove('show'); } });

        // Tombol Checkout Arah WA
        btnCheckout.addEventListener('click', () => {
            const namaProduk = modalProductName.innerText;
            const inputVarian = document.querySelector('input[name="varian"]:checked');
            
            if (!inputVarian) {
                alert('Silakan pilih varian paket terlebih dahulu!');
                return;
            }

            const varianPilihan = inputVarian.value;
            const hargaPilihan = inputVarian.getAttribute('data-harga');
            const metodePembayaran = document.querySelector('input[name="payment"]:checked').value;

            const pesan = `New Order🛎%0A Infomasi Pesanan📌:%0A%0A📱 *Produk:* ${namaProduk}%0A⏱️ *Varian:* ${varianPilihan}%0A🏷️ *Harga:* ${hargaPilihan}%0A💳 *Metode Bayar:* ${metodePembayaran}%0A%0AOrder.`;
            
            const urlWA = `https://wa.me/6285166497792?text=${pesan}`;
            window.open(urlWA, '_blank');
        });
    }
});
