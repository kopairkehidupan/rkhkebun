// Fungsi untuk menampilkan toast
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const icon = toast.querySelector(".toast-icon");
  const msg = toast.querySelector(".toast-message");

  msg.textContent = message;
  icon.textContent = type === "success" ? "✔️" : "❌";
  toast.className = "toast show " + type;

  setTimeout(() => {
    toast.className = "toast " + type;
  }, 5000);
}

// Navigasi antara form dan laporan
document.getElementById("menu-form").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("form-section").style.display = "block";
  document.getElementById("laporan-section").style.display = "none";
  this.classList.add("active");
  document.getElementById("menu-laporan").classList.remove("active");
});

document.getElementById("menu-laporan").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("form-section").style.display = "none";
  document.getElementById("laporan-section").style.display = "block";
  this.classList.add("active");
  document.getElementById("menu-form").classList.remove("active");
  loadLaporan();
});

// Fungsi untuk memuat laporan (contoh statis)
function loadLaporan() {
  const container = document.getElementById("laporan-container");
  container.innerHTML = "<p>Memuat data laporan...</p>";
  // Tambahkan pengambilan data dari Google Sheets jika sudah siap
}

// Penanganan pengiriman formulir
document.getElementById("form-pekerjaan").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
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

const btnToggle = document.getElementById("btn-toggle");
const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");

btnToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  content.classList.toggle("sidebar-open");
});

document.querySelectorAll(".sidebar nav ul li a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Navigasi antar section seperti yang sudah ada
    if (link.id === "menu-form") {
      document.getElementById("form-section").style.display = "block";
      document.getElementById("laporan-section").style.display = "none";
    } else if (link.id === "menu-laporan") {
      document.getElementById("form-section").style.display = "none";
      document.getElementById("laporan-section").style.display = "block";
      loadLaporan();
    }

    // Atur kelas active di menu
    document.querySelectorAll(".sidebar nav ul li a").forEach(a => a.classList.remove("active"));
    link.classList.add("active");

    // Jika di layar kecil, sembunyikan sidebar setelah klik menu
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active");
      content.classList.remove("sidebar-open");
    }
  });
});

