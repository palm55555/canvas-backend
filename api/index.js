// ==========================================
// 1. DATABASE SEMENTARA (Simulasi)
// ==========================================
// Tips: Ganti kode di bawah ini dengan kode jualan aslimu biar permanen
let databaseKode = {
  "MEMBER-BARU": "2025-12-31",
  "VIP-USER": "2026-01-01",
  "DEV-TEST": "2030-12-31" 
};

export default function handler(req, res) {
  // ==========================================
  // 2. IZIN AKSES (CORS) - WAJIB
  // ==========================================
  // Ini obat untuk error "Failed to fetch / CORS" yang muncul di screenshot kamu
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request (Panggilan pembuka dari browser)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // ==========================================
  // 3. LOGIKA BACKEND (OTAKNYA)
  // ==========================================

  // A. JIKA ADMIN HAPUS DATA (DELETE)
  if (req.method === 'DELETE') {
    const body = JSON.parse(req.body);
    delete databaseKode[body.kode]; 
    return res.status(200).json({ status: 'sukses' });
  }

  // B. JIKA ADA DATA MASUK (POST)
  if (req.method === 'POST') {
    const body = JSON.parse(req.body);

    // --- SKENARIO 1: CANVAS MAU CEK KODE (LOGIN) ---
    // Ciri-cirinya: Ada kata kunci "action": "check"
    if (body.action === 'check') {
        const tglExpired = databaseKode[body.kode];
        
        // 1. Kode Tidak Ditemukan
        if (!tglExpired) {
            return res.status(200).json({ status: 'not_found' });
        }

        // 2. Cek Apakah Sudah Expired?
        const hariIni = new Date().toISOString().split('T')[0]; // Ambil tanggal hari ini (YYYY-MM-DD)
        if (hariIni > tglExpired) {
            return res.status(200).json({ status: 'expired', exp: tglExpired });
        }

        // 3. Sukses (Kode Benar & Masih Aktif)
        return res.status(200).json({ status: 'active', exp: tglExpired });
    }

    // --- SKENARIO 2: ADMIN MAU SIMPAN KODE BARU ---
    const kodeBaru = body.kode;
    // Gabungkan input terpisah menjadi format tanggal YYYY-MM-DD
    const tanggalBaru = `${body.tahun}-${body.bulan}-${body.tanggal}`;
    
    databaseKode[kodeBaru] = tanggalBaru;
    return res.status(200).json({ status: 'sukses', data: databaseKode });
  }

  // ==========================================
  // 4. TAMPILAN ADMIN PANEL (UI KEREN)
  // ==========================================
  // Bagian ini persis sama dengan yang kamu suka sebelumnya
  
  // Generate Tabel HTML dari Database
  const daftarListHTML = Object.entries(databaseKode).map(([kode, tanggal]) => {
    return `
      <div class="list-item">
        <div class="info">
          <strong>${kode}</strong>
          <span>Exp: ${tanggal}</span>
        </div>
        <div class="actions">
          <button onclick="editKode('${kode}', '${tanggal}')" class="btn-edit">Edit</button>
          <button onclick="hapusKode('${kode}')" class="btn-delete">Hapus</button>
        </div>
      </div>
    `;
  }).join('');

  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin Super Canvas</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { background-color: #0f172a; color: #e2e8f0; font-family: sans-serif; display: flex; justify-content: center; padding-top: 50px; margin: 0; min-height: 100vh; }
        .container { width: 400px; max-width: 90%; }
        .card { background-color: #1e293b; padding: 2rem; border-radius: 15px; border: 1px solid #334155; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        h2 { margin-top: 0; color: #38bdf8; text-align: center; }
        label { display: block; margin-bottom: 5px; color: #94a3b8; font-size: 0.9rem; }
        input, select { width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #475569; background-color: #0f172a; color: white; box-sizing: border-box; }
        .date-row { display: flex; gap: 10px; }
        .date-row select { margin-bottom: 15px; }
        button.main-btn { width: 100%; padding: 12px; background-color: #38bdf8; color: #0f172a; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        button.main-btn:hover { background-color: #0ea5e9; }
        
        /* List Style */
        .list-container { margin-top: 20px; }
        .list-item { background: #000; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #334155; }
        .info { display: flex; flex-direction: column; }
        .info strong { color: #fff; font-size: 1.1rem; }
        .info span { color: #22c55e; font-size: 0.85rem; }
        .actions { display: flex; gap: 5px; }
        .btn-edit { background: #facc15; color: #000; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8rem; }
        .btn-delete { background: #ef4444; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <h2>🔐 Kelola Akses</h2>
          <label>Kode Akses</label>
          <input type="text" id="kodeInput" placeholder="Contoh: USER-001">
          <label>Tanggal Expired</label>
          <div class="date-row">
            <select id="tgl">${Array.from({length: 31}, (_, i) => `<option value="${String(i+1).padStart(2,'0')}">${i+1}</option>`).join('')}</select>
            <select id="bln">
              <option value="01">Jan</option><option value="02">Feb</option><option value="03">Mar</option>
              <option value="04">Apr</option><option value="05">Mei</option><option value="06">Jun</option>
              <option value="07">Jul</option><option value="08">Ags</option><option value="09">Sep</option>
              <option value="10">Okt</option><option value="11">Nov</option><option value="12">Des</option>
            </select>
            <select id="thn">
              <option value="2025">2025</option><option value="2026">2026</option><option value="2027">2027</option>
              <option value="2028">2028</option><option value="2029">2029</option><option value="2030">2030</option>
            </select>
          </div>
          <button onclick="simpanData()" class="main-btn">💾 Simpan / Update</button>
        </div>

        <h3 style="color:#94a3b8; text-align:center;">Daftar Kode Aktif</h3>
        <div class="list-container">
          ${daftarListHTML}
        </div>
      </div>

      <script>
        const today = new Date();
        resetTanggal();

        function resetTanggal() {
          document.getElementById('tgl').value = String(today.getDate()).padStart(2, '0');
          document.getElementById('bln').value = String(today.getMonth() + 1).padStart(2, '0');
          document.getElementById('thn').value = today.getFullYear();
        }

        async function simpanData() {
          const kode = document.getElementById('kodeInput').value;
          const tanggal = document.getElementById('tgl').value;
          const bulan = document.getElementById('bln').value;
          const tahun = document.getElementById('thn').value;

          if(!kode) { alert("Isi kodenya dulu!"); return; }

          // Kita kirim data biasa (tanpa action check)
          await fetch('/api', {
            method: 'POST',
            body: JSON.stringify({ kode, tanggal, bulan, tahun })
          });
          
          location.reload(); 
        }

        async function hapusKode(kode) {
          if(confirm("Yakin mau hapus kode " + kode + "?")) {
            await fetch('/api', {
              method: 'DELETE',
              body: JSON.stringify({ kode })
            });
            location.reload();
          }
        }

        function editKode(kode, tanggalLengkap) {
          document.getElementById('kodeInput').value = kode;
          const pisah = tanggalLengkap.split('-');
          if(pisah.length === 3) {
            document.getElementById('thn').value = pisah[0];
            document.getElementById('bln').value = pisah[1];
            document.getElementById('tgl').value = pisah[2];
          }
          alert("Silakan edit tanggal di atas, lalu klik Simpan.");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      </script>
    </body>
    </html>
  `);
}
