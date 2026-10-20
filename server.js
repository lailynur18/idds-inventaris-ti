import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'idds_inventaris_ti'
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi database gagal:', err.message);
        return;
    }

    console.log('Database IDDS Inventaris TI berhasil terhubung!');
});

app.get('/api/barang', (req, res) => {
    db.query('SELECT * FROM barang', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});
app.post('/api/barang', (req, res) => {
  const { kode, nama, kategori, unit, tanggal, nilai, status } = req.body;

  const sql = `
    INSERT INTO barang (kode, nama, kategori, unit, tanggal, nilai, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [kode, nama, kategori, unit, tanggal, nilai, status],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          berhasil: false,
          pesan: err.message
        });
      }

      res.status(201).json({
        berhasil: true,
        pesan: 'Perangkat berhasil disimpan ke MySQL',
        id: result.insertId
      });
    }
  );
});
// Memeriksa apakah API inventaris aktif
app.get('/api/tes', (req, res) => {
    res.json({
        berhasil: true,
        pesan: 'API Inventaris TI aktif'
    });
});

// EDIT data barang di MySQL
app.put('/api/barang/:kode', (req, res) => {
  const kodeLama = req.params.kode;
  const {
    kode,
    nama,
    kategori,
    unit,
    tanggal,
    nilai,
    status
  } = req.body;

  const sql = `
    UPDATE barang
    SET nama = ?,
        kategori = ?,
        unit = ?,
        tanggal = ?,
        nilai = ?,
        status = ?
    WHERE kode = ?
  `;

  db.query(
    sql,
    [
      nama,
      kategori,
      unit,
      tanggal,
      Number(nilai) || 0,
      status,
      kodeLama
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ pesan: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          pesan: 'Data tidak ditemukan di MySQL.'
        });
      }

      res.json({
        berhasil: true,
        pesan: 'Data berhasil diperbarui.'
      });
    }
  );
});
// HAPUS data barang dari MySQL
app.delete('/api/barang/:kode', (req, res) => {
    db.query(
        'DELETE FROM barang WHERE kode = ?',
        [req.params.kode],
        (err, result) => {
            if (err) {
                return res.status(500).json({ pesan: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ pesan: 'Data tidak ditemukan di MySQL.' });
            }

            res.json({ berhasil: true, pesan: 'Data berhasil dihapus.' });
        }
    );
});
app.listen(3001, () => {
    console.log('Server berjalan di http://localhost:3001');
});