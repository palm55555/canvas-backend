// DATABASE SEMENTARA (Simulasi)
// Nanti kode yang kamu buat akan muncul di bawah sini
let databaseKode = {
  "CONTOH": "2025-12-31" 
};

export default function handler(req, res) {
  // 1. JIKA ADMIN MENGIRIM DATA BARU (POST)
  if (req.method === 'POST') {
    const body = JSON.parse(req.body);
    const kodeBaru = body.kode;
    const tanggalBaru = body.tanggal;

    // Simpan ke database sementara
    databaseKode[kodeBaru] = tanggalBaru;

    return res.status(200).json({ status: 'sukses', data: databaseKode });
  }

  // 2. JIKA ORANG BUKA LINK (GET) -> TAMPILKAN PANEL KEREN
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin Akses Canvas</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          background-color: #0f172a; /* Warna Gelap Premium */
          color: #e2e8f0;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background-color: #1e293b;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          width: 350px;
          text-align: center;
          border: 1px solid #334155;
        }
        h2 { margin-bottom: 20px; color: #38bdf8; }
        label { display: block; text-align: left; margin-bottom: 5px; font-size: 0.9rem; color: #94a3b8; }
        
        /* Kotak Input yang Besar & Empuk */
        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #475569;
          background-color: #0f172a;
          color: white;
          font-size: 1rem;
          box-sizing: border-box; /* Agar padding tidak merusak lebar */
        }
        input:focus { outline: 2px solid #38bdf8; border-color: transparent; }

        /* Tombol yang Enak Ditekan */
        button {
          width: 100%;
          padding: 12px;
          background-color: #38bdf8;
          color: #0f172a;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: 0.2s;
        }
        button:hover { background-color: #0ea5e9; }

        /* Hasil Data di Bawah */
        .output {
          margin-top: 20px;
          text-align: left;
          background: #000;
          padding: 10px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 0.85rem;
          color: #22c55e;
          min-height: 50px;
        }
      </style>
    </head>
    <body>

      <div class="card">
        <h2>🔐 Admin Panel</h2>
        
        <label>Kode Akses Baru</label>
        <input type="text" id="kodeInput" placeholder="Misal: VIP-MEMBER">

        <label>Berlaku Sampai</label>
        <input type="date" id="tanggalInput">

        <button onclick="simpanData()">Simpan Akses</button>

        <div class="output" id="hasil">Data saat ini:<br>${JSON.stringify(databaseKode)}</div>
      </div>

      <script>
        async function simpanData() {
          const kode = document.getElementById('kodeInput').value;
          const tanggal = document.getElementById('tanggalInput').value;

          if(!kode || !tanggal) { alert("Isi dulu dong bos!"); return; }

          const res = await fetch('/api', {
            method: 'POST',
            body: JSON.stringify({ kode, tanggal })
          });

          const json = await res.json();
          document.getElementById('hasil').innerHTML = "✅ Berhasil Disimpan:<br>" + JSON.stringify(json.data, null, 2);
          alert("Kode " + kode + " berhasil dibuat!");
        }
      </script>
    </body>
    </html>
  `);
}
