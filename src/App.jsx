import { Button, setBrandTheme, TextField, Card} from '@idds/react';
import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import './styles.css'
const API = 'http://localhost:3001/api/barang';
const dataAwal = [
  { kode: 'TI001', nama: 'Laptop Asus', kategori: 'Komputer', unit: 'Unit IT', tanggal: '2026-01-05', nilai: 8500000, status: 'Baik' },
  { kode: 'TI002', nama: 'Printer Epson', kategori: 'Printer', unit: 'Unit IT', tanggal: '2026-01-10', nilai: 2500000, status: 'Baik' },
  { kode: 'TI003', nama: 'Router TP-Link', kategori: 'Jaringan', unit: 'Unit IT', tanggal: '2026-01-15', nilai: 1200000, status: 'Baik' },
  { kode: 'TI004', nama: 'Monitor Samsung', kategori: 'Monitor', unit: 'Unit IT', tanggal: '2026-01-20', nilai: 1800000, status: 'Baik' },
  { kode: 'TI005', nama: 'Keyboard Logitech', kategori: 'Aksesori', unit: 'Unit IT', tanggal: '2026-01-25', nilai: 250000, status: 'Baik' },
  { kode: 'TI006', nama: 'Mouse Logitech', kategori: 'Aksesori', unit: 'Unit IT', tanggal: '2026-02-01', nilai: 150000, status: 'Baik' },
  { kode: 'TI007', nama: 'PC Desktop', kategori: 'Komputer', unit: 'Bagian Umum', tanggal: '2026-02-05', nilai: 7500000, status: 'Baik' },
  { kode: 'TI008', nama: 'Switch 24 Port', kategori: 'Jaringan', unit: 'Unit IT', tanggal: '2026-02-10', nilai: 2200000, status: 'Baik' },
  { kode: 'TI009', nama: 'Scanner Canon', kategori: 'Scanner', unit: 'Bagian Umum', tanggal: '2026-02-15', nilai: 1700000, status: 'Perawatan' },
  { kode: 'TI010', nama: 'UPS APC', kategori: 'Kelistrikan', unit: 'Unit IT', tanggal: '2026-02-20', nilai: 1300000, status: 'Baik' },
  { kode: 'TI011', nama: 'Laptop Lenovo', kategori: 'Komputer', unit: 'Bagian Umum', tanggal: '2026-03-01', nilai: 9000000, status: 'Baik' },
  { kode: 'TI012', nama: 'Access Point', kategori: 'Jaringan', unit: 'Unit IT', tanggal: '2026-03-05', nilai: 950000, status: 'Baik' },
  { kode: 'TI013', nama: 'Webcam Logitech', kategori: 'Aksesori', unit: 'Ruang Rapat', tanggal: '2026-03-10', nilai: 600000, status: 'Baik' },
  { kode: 'TI014', nama: 'Proyektor Epson', kategori: 'Multimedia', unit: 'Ruang Rapat', tanggal: '2026-03-15', nilai: 6500000, status: 'Perawatan' },
  { kode: 'TI015', nama: 'Hard Disk Eksternal', kategori: 'Penyimpanan', unit: 'Unit IT', tanggal: '2026-03-20', nilai: 1000000, status: 'Baik' },
  { kode: 'TI016', nama: 'Server', kategori: 'Server', unit: 'Pusat Data', tanggal: '2026-04-01', nilai: 25000000, status: 'Baik' },
  { kode: 'TI017', nama: 'Modem Internet', kategori: 'Jaringan', unit: 'Unit IT', tanggal: '2026-04-05', nilai: 500000, status: 'Rusak' },
  { kode: 'TI018', nama: 'Tablet', kategori: 'Komputer', unit: 'Bagian Umum', tanggal: '2026-04-10', nilai: 4000000, status: 'Baik' },
  { kode: 'TI019', nama: 'Kabel LAN', kategori: 'Jaringan', unit: 'Unit IT', tanggal: '2026-04-15', nilai: 200000, status: 'Baik' },
  { kode: 'TI020', nama: 'UPS Server', kategori: 'Kelistrikan', unit: 'Pusat Data', tanggal: '2026-04-20', nilai: 3500000, status: 'Baik' },
]

const kosong = {
  kode: '',
  nama: '',
  kategori: '',
  unit: '',
  tanggal: '',
  nilai: '',
  status: 'Baik',
}

export default function App() {
  const [barang, setBarang] = useState(() => {
    try {
      const tersimpan = localStorage.getItem('idds_inventaris_perangkat')
      return tersimpan ? JSON.parse(tersimpan) : dataAwal
    } catch {
      return dataAwal
    }
  })

  const [cari, setCari] = useState('')
  const [kataKunci, setKataKunci] = useState('')
  const [form, setForm] = useState(kosong)
  const [kodeEdit, setKodeEdit] = useState(null)
  const [pesan, setPesan] = useState('')

  useEffect(() => {
    localStorage.setItem('idds_inventaris_perangkat', JSON.stringify(barang))
  }, [barang])
useEffect(() => {
  fetch('http://localhost:3001/api/barang')
    .then((res) => {
      if (!res.ok) throw new Error('Gagal mengambil data SQL')
      return res.json()
    })
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setBarang(data)
      }
    })
    .catch((err) => {
      console.error('Koneksi SQL:', err.message)
    })
}, [])
  const hasil = barang.filter((item) =>
    [
      item.kode,
      item.nama,
      item.kategori,
      item.unit,
      item.tanggal,
      item.status,
    ].some((isi) =>
      String(isi ?? '')
        .toLowerCase()
        .includes(kataKunci.toLowerCase())
    )
  )

  function ubahForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function simpan(e) {
e.preventDefault();

const kode = form.kode.trim();
const nama = form.nama.trim();

if (!kode || !nama || !form.kategori || !form.unit || !form.tanggal) {
setPesan('Lengkapi semua data perangkat terlebih dahulu.');
return;
}

const duplikat = barang.some(
(item) =>
item.kode.toLowerCase() === kode.toLowerCase() &&
item.kode !== kodeEdit
);

if (duplikat) {
setPesan('Kode perangkat sudah digunakan.');
return;
}

const dataBaru = {
...form,
kode,
nama,
nilai: Number(form.nilai) || 0,
};

try {
const sedangEdit = kodeEdit !== null;

const response = await fetch(
  sedangEdit
    ? `${API}/${encodeURIComponent(kodeEdit)}`
    : API,
  {
    method: sedangEdit ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataBaru),
  }
);

const teksRespons = await response.text();
let hasilAPI = {};

try {
  hasilAPI = teksRespons ? JSON.parse(teksRespons) : {};
} catch {
  throw new Error(
    `Respons server bukan JSON. Isi respons: ${teksRespons.slice(0, 200)}`
  );
}

if (!response.ok) {
  throw new Error(
    hasilAPI.pesan || hasilAPI.error || 'Gagal menyimpan data.'
  );
}
const responseData = await fetch(API);
if (!responseData.ok) throw new Error('Gagal membaca data MySQL.');

const dataDatabase = await responseData.json();
setBarang(dataDatabase);

setPesan(sedangEdit
  ? 'Data berhasil diperbarui di MySQL.'
  : 'Data berhasil ditambahkan ke MySQL.'
);

setForm(kosong);
setKodeEdit(null);

} catch (error) {
  setPesan(`Gagal menyimpan ke MySQL: ${error.message}`);
}
}

  function editBarang(item) {
    setForm({ ...item, nilai: String(item.nilai) })
    setKodeEdit(item.kode)
    setPesan('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function hapusBarang(kode) {
  if (!window.confirm('Yakin ingin menghapus perangkat ini?')) {
    return;
  }

  try {
    const response = await fetch(
      `${API}/${encodeURIComponent(kode)}`,
      { method: 'DELETE' }
    );

    const hasilAPI = await response.json();

    if (!response.ok) {
      throw new Error(
        hasilAPI.pesan || hasilAPI.error || 'Gagal menghapus data.'
      );
    }

    const responseData = await fetch(API);

    if (!responseData.ok) {
      throw new Error('Gagal membaca data MySQL.');
    }

    const dataDatabase = await responseData.json();
    setBarang(dataDatabase);

    setPesan('Data berhasil dihapus dari MySQL.');

    if (kodeEdit === kode) {
      setForm(kosong);
      setKodeEdit(null);
    }
  } catch (error) {
    setPesan(`Gagal menghapus dari MySQL: ${error.message}`);
  }
}

  function batalEdit() {
    setForm(kosong)
    setKodeEdit(null)
    setPesan('')
  }

  function exportExcel() {
    const dataExcel = barang.map((item) => ({
      Kode: item.kode,
      Nama: item.nama,
      Kategori: item.kategori,
      Unit: item.unit,
      Tanggal: item.tanggal,
      Nilai: item.nilai,
      Status: item.status,
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataExcel)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Inventaris Perangkat TI'
    )

    XLSX.writeFile(workbook, 'Inventaris_Perangkat_TI.xlsx')
  }

  function importExcel(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, {
          type: 'array',
          cellDates: true,
        })

        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
        })

        const dataImpor = rows.map((row) => {
          const tanggal = row.Tanggal ?? row.tanggal ?? ''

          return {
            kode: String(row.Kode ?? row.kode ?? '').trim(),
            nama: String(row.Nama ?? row.nama ?? '').trim(),
            kategori: String(row.Kategori ?? row.kategori ?? '').trim(),
            unit: String(row.Unit ?? row.unit ?? '').trim(),
            tanggal:
              tanggal instanceof Date
                ? tanggal.toISOString().slice(0, 10)
                : String(tanggal).slice(0, 10),
            nilai: Number(row.Nilai ?? row.nilai ?? 0) || 0,
            status: String(row.Status ?? row.status ?? 'Baik').trim(),
          }
        }).filter((item) => item.kode && item.nama)

        if (dataImpor.length === 0) {
          setPesan('Tidak ada data valid. Periksa judul kolom Excel.')
          return
        }

        const gabungan = [...barang]

        dataImpor.forEach((item) => {
          const index = gabungan.findIndex(
            (lama) => lama.kode.toLowerCase() === item.kode.toLowerCase()
          )

          if (index >= 0) {
            gabungan[index] = item
          } else {
            gabungan.push(item)
          }
        })

        setBarang(gabungan)
        setPesan(`${dataImpor.length} data berhasil diimpor.`)
      } catch {
        setPesan('File Excel tidak dapat dibaca.')
      }
    }

    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  const rupiah = (angka) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(angka) || 0)

  const gaya = {
    halaman: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: 20,
      fontFamily: 'Arial, sans-serif',
      color: '#243247',
    },
    input: {
      width: '100%',
      padding: 10,
      boxSizing: 'border-box',
      border: '1px solid #ccd3dd',
      borderRadius: 6,
    },
    tombol: {
      padding: '10px 16px',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      background: '#2457a7',
      color: 'white',
    },
    tabel: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: 950,
    },
    sel: {
      border: '1px solid #d9e0e8',
      padding: 10,
      textAlign: 'left',
    },
  }

  return (
    <main style={gaya.halaman}>
      <h1>Inventaris Perangkat TI</h1>
      <p>Pengelolaan data inventaris perangkat teknologi informasi.</p>

      {pesan && (
        <p
          role="status"
          style={{
            padding: 12,
            background: '#e8f5e9',
            borderRadius: 6,
          }}
        >
          {pesan}
        </p>
      )}

      <section
        style={{
          padding: 18,
          marginBottom: 24,
          border: '1px solid #d9e0e8',
          borderRadius: 10,
        }}
      >
        <h2>{kodeEdit !== null ? 'Edit Perangkat' : 'Tambah Perangkat'}</h2>

        <form onSubmit={simpan}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 14,
            }}
          >
            <label>
              Kode Perangkat
              <input
                name="kode"
                value={form.kode}
                onChange={ubahForm}
                style={gaya.input}
                disabled={kodeEdit !== null}
                required
                placeholder="Contoh: TI021"
              />
            </label>

            <label>
              Nama Perangkat
              <input
                name="nama"
                value={form.nama}
                onChange={ubahForm}
                style={gaya.input}
                required
                placeholder="Nama perangkat"
              />
            </label>

            <label>
              Kategori
              <select
                name="kategori"
                value={form.kategori}
                onChange={ubahForm}
                style={gaya.input}
                required
              >
                <option value="">Pilih kategori</option>
                <option>Komputer</option>
                <option>Printer</option>
                <option>Monitor</option>
                <option>Jaringan</option>
                <option>Aksesori</option>
                <option>Scanner</option>
                <option>Kelistrikan</option>
                <option>Multimedia</option>
                <option>Penyimpanan</option>
                <option>Server</option>
                <option>Lainnya</option>
              </select>
            </label>

            <label>
              Unit / Lokasi
              <input
                name="unit"
                value={form.unit}
                onChange={ubahForm}
                style={gaya.input}
                required
                placeholder="Contoh: Unit IT"
              />
            </label>

            <label>
              Tanggal Perolehan
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={ubahForm}
                style={gaya.input}
                required
              />
            </label>

            <label>
              Nilai Perangkat (Rp)
              <input
                type="number"
                name="nilai"
                value={form.nilai}
                onChange={ubahForm}
                style={gaya.input}
                min="0"
                placeholder="Contoh: 5000000"
              />
            </label>

            <label>
              Status
              <select
                name="status"
                value={form.status}
                onChange={ubahForm}
                style={gaya.input}
              >
                <option>Baik</option>
                <option>Perawatan</option>
                <option>Rusak</option>
              </select>
            </label>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 18,
              flexWrap: 'wrap',
            }}
          >
            <button type="submit" style={gaya.tombol}>
              {kodeEdit !== null ? 'Simpan Perubahan' : 'Tambah Perangkat'}
            </button>

            {kodeEdit !== null && (
              <button
                type="button"
                onClick={batalEdit}
                style={{ ...gaya.tombol, background: '#667085' }}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2>Daftar Inventaris Perangkat TI</h2>

        <p>
          Total perangkat: <strong>{barang.length}</strong>
          {' | '}
          Total nilai: <strong>{rupiah(barang.reduce(
            (total, item) => total + (Number(item.nilai) || 0),
            0
          ))}</strong>
        </p>

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 14,
            }}
          >
            <input
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setKataKunci(cari.trim())
              }}
              placeholder="Cari kode, nama, kategori, unit..."
              style={{ ...gaya.input, maxWidth: 400 }}
            />

            <button
              type="button"
              onClick={() => setKataKunci(cari.trim())}
              style={gaya.tombol}
            >
              Cari
            </button>

            <button
              type="button"
              onClick={() => {
                setCari('')
                setKataKunci('')
              }}
              style={{ ...gaya.tombol, background: '#667085' }}
            >
              Reset
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={exportExcel}
              style={gaya.tombol}
            >
              Export Excel
            </button>

            <label
              style={{
                ...gaya.tombol,
                display: 'inline-block',
              }}
            >
              Import Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={importExcel}
                hidden
              />
            </label>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={gaya.tabel}>
            <thead>
              <tr style={{ background: '#edf2f8' }}>
                {[
                  'No',
                  'Kode',
                  'Nama Perangkat',
                  'Kategori',
                  'Unit',
                  'Tanggal',
                  'Nilai',
                  'Status',
                  'Aksi',
                ].map((judul) => (
                  <th key={judul} style={gaya.sel}>
                    {judul}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {hasil.length === 0 ? (
                <tr>
                  <td colSpan="9" style={gaya.sel}>
                    Data perangkat tidak ditemukan.
                  </td>
                </tr>
              ) : (
                hasil.map((item, index) => (
                  <tr key={item.kode}>
                    <td style={gaya.sel}>{index + 1}</td>
                    <td style={gaya.sel}>{item.kode}</td>
                    <td style={gaya.sel}>{item.nama}</td>
                    <td style={gaya.sel}>{item.kategori}</td>
                    <td style={gaya.sel}>{item.unit}</td>
                    <td style={gaya.sel}>{item.tanggal}</td>
                    <td style={gaya.sel}>{rupiah(item.nilai)}</td>
                    <td style={gaya.sel}>{item.status}</td>
                    <td style={gaya.sel}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => editBarang(item)}
                          style={{
                            ...gaya.tombol,
                            background: '#16804a',
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => hapusBarang(item.kode)}
                          style={{
                            ...gaya.tombol,
                            background: '#c62828',
                          }}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}