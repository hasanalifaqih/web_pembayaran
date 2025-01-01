let daftarBarang = [];
let editingIndex = -1;

function tambahBarang() {
    const namaBarang = document.getElementById('namaBarang').value;
    const hargaBarang = document.getElementById('hargaBarang').value;
    
    if (namaBarang && hargaBarang) {
        daftarBarang.push({
            nama: namaBarang,
            harga: parseFloat(hargaBarang)
        });
        
        document.getElementById('namaBarang').value = '';
        document.getElementById('hargaBarang').value = '';
        
        tampilkanDaftarBarang(daftarBarang);
    }
}

function mulaiEdit(index) {
    editingIndex = index;
    tampilkanDaftarBarang(daftarBarang);
}

function batalEdit() {
    editingIndex = -1;
    tampilkanDaftarBarang(daftarBarang);
}

function simpanEdit(index) {
    const newNama = document.getElementById(`editNama${index}`).value;
    const newHarga = document.getElementById(`editHarga${index}`).value;
    
    if (newNama && newHarga) {
        daftarBarang[index] = {
            nama: newNama,
            harga: parseFloat(newHarga)
        };
        editingIndex = -1;
        tampilkanDaftarBarang(daftarBarang);
    }
}

function cariBarang() {
    const searchTerm = document.getElementById('searchBarang').value.toLowerCase();
    const filteredBarang = daftarBarang.filter(barang => 
        barang.nama.toLowerCase().includes(searchTerm)
    );
    tampilkanDaftarBarang(filteredBarang);
}

function tampilkanDaftarBarang(barangList) {
    const container = document.getElementById('barangList');
    container.innerHTML = '';
    
    barangList.forEach((barang, index) => {
        const div = document.createElement('div');
        div.className = `barang-item ${editingIndex === index ? 'edit-mode' : ''}`;
        
        if (editingIndex === index) {
            div.innerHTML = `
                <div class="barang-info">
                    <input type="text" id="editNama${index}" value="${barang.nama}" placeholder="Nama Barang">
                    <input type="number" id="editHarga${index}" value="${barang.harga}" placeholder="Harga">
                </div>
                <div class="edit-controls">
                    <button class="save-btn" onclick="simpanEdit(${index})">Simpan</button>
                    <button class="cancel-btn" onclick="batalEdit()">Batal</button>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="barang-info">
                    ${barang.nama} - Rp ${barang.harga.toLocaleString()}
                </div>
                <button class="edit-btn" onclick="mulaiEdit(${index})">Edit</button>
            `;
        }
        container.appendChild(div);
    });
}

function hitungTotal() {
    const totalBarang = daftarBarang.reduce((sum, item) => sum + item.harga, 0);
    const hargaAdmin = parseFloat(document.getElementById('hargaAdmin').value) || 0;
    return totalBarang + hargaAdmin;
}

function buatStruk() {
    const idTransaksi = document.getElementById('idTransaksi').value;
    const nomorTujuan = document.getElementById('nomorTujuan').value;
    const hargaAdmin = parseFloat(document.getElementById('hargaAdmin').value) || 0;
    
    if (!idTransaksi || !nomorTujuan || daftarBarang.length === 0) {
        alert('Mohon lengkapi semua data!');
        return;
    }

    const totalHarga = hitungTotal();
    const date = new Date().toLocaleDateString('id-ID');
    const time = new Date().toLocaleTimeString('id-ID');

    const strukHTML = `
        <div class="center-text">
            <h3>STRUK PEMBAYARAN</h3>
            <p>ID: ${idTransaksi}</p>
            <p>${date} ${time}</p>
        </div>
        <div class="divider"></div>
        <p>Nomor Tujuan: ${nomorTujuan}</p>
        <div class="divider"></div>
        ${daftarBarang.map(item => `
            <p>${item.nama}<br>Rp ${item.harga.toLocaleString()}</p>
        `).join('')}
        <div class="divider"></div>
        <p>Biaya Admin: Rp ${hargaAdmin.toLocaleString()}</p>
        <p><strong>Total: Rp ${totalHarga.toLocaleString()}</strong></p>
        <div class="divider"></div>
        <div class="center-text">
            <p>Terima Kasih</p>
            <p>Simpan struk ini sebagai bukti pembayaran yang sah</p>
        </div>
    `;

    const preview = document.getElementById('preview');
    preview.innerHTML = strukHTML;
    preview.style.display = 'block';

    // Persiapkan canvas untuk cetakGambar
    renderKeCanvas();
}

function renderKeCanvas() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const preview = document.getElementById('preview');

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';

    // Render preview content to canvas
    ctx.font = '12px Courier New';
    const lines = preview.innerText.split('\n');
    let y = 30;
    
    lines.forEach(line => {
        if (line.trim()) {
            ctx.fillText(line, 20, y);
            y += 20;
        }
    });
}

function cetakGambar() {
    const canvas = document.getElementById('canvas');
    if (canvas.toBlob) {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'struk_pembayaran.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    } else {
        alert('Maaf, browser Anda tidak mendukung fitur ini');
    }
}

function resetForm() {
    document.getElementById('formData').reset();
    daftarBarang = [];
    editingIndex = -1;
    tampilkanDaftarBarang(daftarBarang);
    document.getElementById('searchBarang').value = '';
    document.getElementById('preview').style.display = 'none';
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}