document.getElementById("form-pekerjaan").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const statusMessage = document.getElementById("status-message");

    fetch("https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec", { // Ganti dengan URL Web App kamu
      method: "POST",
      body: data,
    })
    .then(res => res.text())
    .then(result => {
      if (result.toLowerCase().includes("berhasil")) {
        showToast("✅ Data berhasil disimpan", "success");
        form.reset();
      } else {
        showToast("⚠️ Gagal menyimpan data", "error");
      }
    })
    .catch(error => {
      showToast("❌ Terjadi kesalahan: " + error.message, "error");
    });
  });
