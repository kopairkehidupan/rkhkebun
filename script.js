document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector(".content");
  const formSection = document.getElementById("form-section");
  const laporanSection = document.getElementById("laporan-section");
  const navLinks = document.querySelectorAll(".nav-links a");
  const form = document.getElementById("form-pekerjaan");
  const toast = document.getElementById("toast");
  const toastIcon = toast.querySelector(".toast-icon");
  const toastMessage = toast.querySelector(".toast-message");

  // Navigasi menu
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      if (link.id === "menu-form") {
        formSection.style.display = "block";
        laporanSection.style.display = "none";
      } else if (link.id === "menu-laporan") {
        formSection.style.display = "none";
        laporanSection.style.display = "block";
        loadLaporan();
      }

      navLinks.forEach(a => a.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Fungsi menampilkan toast
  window.showToast = function (message, type = "success") {
    toastMessage.textContent = message;
    toastIcon.textContent = type === "success" ? "✔️" : "❌";
    toast.className = "toast show " + type;

    setTimeout(() => {
      toast.className = "toast " + type;
    }, 5000);
  };

  // Submit form
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
    // Tambahkan fetch ke Google Sheets jika perlu
  }
});
