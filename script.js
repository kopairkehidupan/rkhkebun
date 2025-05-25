document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-pekerjaan");
  const toastEl = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toast = new bootstrap.Toast(toastEl);

  const menuForm = document.getElementById("menu-form");
  const menuLaporan = document.getElementById("menu-laporan");
  const formSection = document.getElementById("form-section");
  const laporanSection = document.getElementById("laporan-section");

  menuForm.addEventListener("click", (e) => {
    e.preventDefault();
    formSection.classList.remove("d-none");
    laporanSection.classList.add("d-none");
  });

  menuLaporan.addEventListener("click", (e) => {
    e.preventDefault();
    formSection.classList.add("d-none");
    laporanSection.classList.remove("d-none");
    loadLaporan();
  });

  function showToast(message, type = "success") {
    toastMessage.textContent = message;
    toastEl.classList.remove("bg-success", "bg-danger");
    toastEl.classList.add(type === "success" ? "bg-success" : "bg-danger");
    toast.show();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    fetch("https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec", {
      method: "POST",
      body: data,
    })
      .then(res => res.text())
      .then(result => {
        if (result.toLowerCase().includes("berhasil")) {
          showToast("Data berhasil disimpan", "success");
          form.reset();
        } else {
          showToast("Gagal menyimpan data", "error");
        }
      })
      .catch(error => {
        showToast("Terjadi kesalahan: " + error.message, "error");
      });
  });

  function loadLaporan() {
    const container = document.getElementById("laporan-container");
    container.innerHTML = "<p>Memuat data laporan...</p>";
    // Fetch logic dapat ditambahkan di sini
  }
});
