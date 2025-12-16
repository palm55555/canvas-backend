let codes = {
  "NESA": "2025-12-12"
}

export default function handler(req, res) {
  // ======================
  // 1️⃣ HALAMAN ADMIN
  // ======================
  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/html")
    return res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Admin License Panel</title>
  <style>
    body {
      font-family: Arial;
      background: #111;
      color: #eee;
      padding: 40px;
    }
    input, button {
      padding: 10px;
      margin-top: 10px;
      width: 100%;
      font-size: 16px;
    }
    button {
      background: #4CAF50;
      border: none;
      cursor: pointer;
    }
    .box {
      max-width: 400px;
      margin: auto;
      background: #1e1e1e;
      padding: 20px;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="box">
    <h2>Admin Kode Akses</h2>
    <form method="POST">
      <label>Kode</label>
      <input name="code" placeholder="Contoh: NESA" required />

      <label>Berlaku sampai</label>
      <input type="date" name="date" required />

      <button>Simpan / Update</button>
    </form>

    <pre>${JSON.stringify(codes, null, 2)}</pre>
  </div>
</body>
</html>
    `)
  }

  // ======================
  // 2️⃣ SIMPAN DARI ADMIN
  // ======================
  if (req.method === "POST" && !req.headers["x-client-check"]) {
    const body = req.body
    codes[body.code] = body.date

    return res.redirect("/api")
  }

  // ======================
  // 3️⃣ CEK DARI CANVAS
  // ======================
  if (req.method === "POST" && req.headers["x-client-check"]) {
    const { code } = req.body

    if (!codes[code]) {
      return res.json({ status: "DENY", reason: "NOT_FOUND" })
    }

    const today = new Date().toISOString().slice(0, 10)

    if (today > codes[code]) {
      return res.json({ status: "DENY", reason: "EXPIRED" })
    }

    return res.json({
      status: "ACTIVE",
      valid_until: codes[code]
    })
  }

  return res.status(404).end()
}
