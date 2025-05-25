document.addEventListener("DOMContentLoaded", () => {
  const btnToggle = document.getElementById("btn-toggle");
  const sidebar = document.getElementById("sidebarMenu");
  const content = document.querySelector(".content");
  const formSection = document.getElementById("form-section");
  const laporanSection = document.getElementById("laporan-section");
  const navLinks = document.querySelectorAll(".nav-link");
  const form = document.getElementById("form-pekerjaan");
  const toastEl = document.getElementById("liveToast");
  const toast = new bootstrap.Toast(toastEl);

  // Toggle sidebar (untuk mobile)
  btnToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show");
  });

  // Navigasi menu
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach(a => a.classList.remove("active"));
      link.classList.add("active");

      if (link.id === "menu-form") {
        formSection.style.display = "block";
        laporanSection.style.display = "none";
      } else {
        formSection.style.display = "none";
        laporanSection.style.display = "block";
        loadLaporan();
      }

      if (window.innerWidth <= 768) {
        sidebar.classList.remove("show");
      }
    });
  });

  // Form submit
  form.addEventListener("submit", (e) => {
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
          toastEl.querySelector(".toast-body").textContent = "Data berhasil disimpan";
          toastEl.classList.remove("text-bg-danger");
          toastEl.classList.add("text-bg-success");
          toast.show();
          form.reset();
        } else {
          toastEl.querySelector(".toast-body").textContent = "Gagal menyimpan data";
          toastEl.classList.remove("text-bg-success");
          toastEl.classList.add("text-bg-danger");
          toast.show();
        }
      })
      .catch(error => {
        toastEl.querySelector(".toast-body").textContent = "Terjadi kesalahan: " + error.message;
        toastEl.classList.remove("text-bg-success");
        toastEl.classList.add("text-bg-danger");
        toast.show();
      });
  });

  // Fungsi load laporan
  function loadLaporan() {
    const container = document.getElementById("laporan-container");
    container.innerHTML = "<p class='text-muted'>Memuat data laporan...</p>";
    // Tambahkan fetch jika ingin ambil data dari backend
  }
});
