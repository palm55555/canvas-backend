// DATABASE SEMENTARA (Simulasi)
let databaseKode = {
  "CONTOH": "2025-12-31" 
};

export default function handler(req, res) {
  // 1. JIKA ADMIN MENGIRIM DATA BARU (POST)
  if (req.method === 'POST') {
    const body = JSON.parse(req.body);
    const kodeBaru = body.kode;
    // Gabungkan Tanggal-Bulan-Tahun jadi format YYYY-MM-DD
    const tanggalBaru = `${body.tahun}-${body.bulan}-${body.tanggal}`;

    databaseKode[kodeBaru] = tanggalBaru;
    return res.status(200).json({ status: 'sukses', data: databaseKode });
  }

  // 2. TAMPILAN ADMIN PANEL (UI)
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin Akses Canvas</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          background-color: #0f172a;
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
          width: 380px; /* Sedikit lebih lebar */
          text-align: center;
          border: 1px solid #334155;
        }
        h2 { margin-bottom: 20px; color: #38bdf8; }
        label { display: block; text-align: left; margin-bottom: 5px; font-size: 0.9rem; color: #94a3b8; }
        
        input, select {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #475569;
          background-color: #0f172a;
          color: white;
          font-size: 1rem;
        }
        
        /* Baris Khusus Tanggal (Biar sejajar 3 kolom) */
        .date-row {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }
        .date-row select {
          margin-bottom: 0; /* Hapus margin bawah karena sudah ada di row */
          padding: 10px;
        }

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
          margin-top: 10px;
        }
        button:hover { background-color: #0ea5e9; }

        .output {
          margin-top: 20px;
          text-align: left;
          background: #000;
          padding: 10px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 0.85rem;
          color: #22c55e;
        }
      </style>
    </head>
    <body>

      <div class="card">
        <h2>🔐 Admin Panel v2</h2>
        
        <label>Kode Akses Baru</label>
        <input type="text" id="kodeInput" placeholder="Contoh: PREMIUM-USER">

        <label>Berlaku Sampai</label>
        <div class="date-row">
          <select id="tgl">
            ${Array.from({length: 31}, (_, i) => `<option value="${String(i+1).padStart(2,'0')}">${i+1}</option>`).join('')}
          </select>
          
          <select id="bln">
            <option value="01">Januari</option>
            <option value="02">Februari</option>
            <option value="03">Maret</option>
            <option value="04">April</option>
            <option value="05">Mei</option>
            <option value="06">Juni</option>
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>

          <select id="thn">
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
          </select>
        </div>

        <button onclick="simpanData()">Simpan Akses</button>

        <div class="output" id="hasil">Data Database:<br>${JSON.stringify(databaseKode)}</div>
      </div>

      <script>
        // Set tanggal hari ini saat dibuka
        const today = new Date();
        document.getElementById('tgl').value = String(today.getDate()).padStart(2, '0');
        document.getElementById('bln').value = String(today.getMonth() + 1).padStart(2, '0');
        document.getElementById('thn').value = today.getFullYear();

        async function simpanData() {
          const kode = document.getElementById('kodeInput').value;
          const tanggal = document.getElementById('tgl').value;
          const bulan = document.getElementById('bln').value;
          const tahun = document.getElementById('thn').value;

          if(!kode) { alert("Kode belum diisi bos!"); return; }

          const res = await fetch('/api', {
            method: 'POST',
            body: JSON.stringify({ kode, tanggal, bulan, tahun })
          });

          const json = await res.json();
          document.getElementById('hasil').innerHTML = "✅ Tersimpan:<br>" + JSON.stringify(json.data, null, 2);
          alert("Akses " + kode + " berhasil dibuat!");
        }
      </script>
    </body>
    </html>
  `);
}
