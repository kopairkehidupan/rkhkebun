document.addEventListener("DOMContentLoaded", () => {
  const btnToggle = document.getElementById("btn-toggle");
  const sidebar = document.querySelector(".sidebar");
  const content = document.querySelector(".content");
  const formSection = document.getElementById("form-section");
  const laporanSection = document.getElementById("laporan-section");
  const navLinks = document.querySelectorAll(".sidebar nav ul li a");
  const form = document.getElementById("form-pekerjaan");
  const toast = document.getElementById("toast");
  const toastIcon = toast.querySelector(".toast-icon");
  const toastMessage = toast.querySelector(".toast-message");

  // Buka sidebar otomatis jika layar lebar
  if (window.innerWidth > 768) {
    sidebar.classList.add("active");
  }

  // Toggle sidebar manual
  btnToggle.addEventListener("click", () => {
    console.log("Hamburger diklik");
    sidebar.classList.toggle("active");
    content.classList.toggle("sidebar-open");
  });

  // Klik di luar sidebar = tutup (untuk mobile)
  document.addEventListener("click", (event) => {
    if (
      window.innerWidth <= 768 &&
      sidebar.classList.contains("active") &&
      !sidebar.contains(event.target) &&
      !btnToggle.contains(event.target)
    ) {
      sidebar.classList.remove("active");
      content.classList.remove("sidebar-open");
    }
  });

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

      if (window.innerWidth <= 768) {
        sidebar.classList.remove("active");
        content.classList.remove("sidebar-open");
      }
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

  // Fungsi menampilkan laporan
  function loadLaporan() {
    const container = document.getElementById("laporan-container");
    container.innerHTML = "<p>Memuat data laporan...</p>";
    // Tambahkan logika fetch data di sini bila diperlukan
  }
});
