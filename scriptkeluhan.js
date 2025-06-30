// ==== KELUHAN FORM HANDLING ====
const keluhanForm = document.getElementById("form-keluhan");
if (keluhanForm) {
  keluhanForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const formData = new FormData(keluhanForm);
    const kebun = formData.get("kebun");
    const divisi = formData.get("divisi");
    const blok = formData.get("blok");
    const pemanen = formData.get("pemanen");
    const pp = formData.get("pp");
    const tanggal = formData.get("tanggal");
    const keluhan = formData.get("keluhan");
    const fotoKeluhan = formData.get("foto_keluhan");
    
    const perbaikan = formData.getAll("perbaikan[]");
    const tanggalPerbaikan = formData.getAll("tanggal_perbaikan[]");
    const fotoPerbaikan = formData.getAll("foto_perbaikan[]");
    
    // Prepare data for submission
    const data = {
      kebun,
      divisi,
      blok,
      pemanen,
      pp,
      tanggal,
      keluhan,
      foto_keluhan: fotoKeluhan.name,
      perbaikan: perbaikan.map((desc, i) => ({
        deskripsi: desc,
        tanggal: tanggalPerbaikan[i],
        foto: fotoPerbaikan[i]?.name || ""
      }))
    };
    
    // Here you would typically send this data to your server/Google Apps Script
    // For example:
    fetch("YOUR_GOOGLE_APPS_SCRIPT_URL", {
      method: "POST",
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
      showToast("Keluhan berhasil disimpan", "success");
      keluhanForm.reset();
    })
    .catch(err => {
      showToast("Gagal menyimpan keluhan: " + err.message, "error");
    });
  });
}
