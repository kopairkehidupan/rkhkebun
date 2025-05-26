document.addEventListener("DOMContentLoaded", () => {
  // ==== FORM RKH ====
  const form = document.getElementById("form-pekerjaan");
  const toast = document.getElementById("toast");

  if (form && toast) {
    const toastIcon = toast.querySelector(".toast-icon");
    const toastMessage = toast.querySelector(".toast-message");

    function showToast(message, type = "success") {
      toastMessage.textContent = message;
      toastIcon.textContent = type === "success" ? "✔️" : "❌";
      toast.className = "toast show " + type;

      setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => {
          toast.className = "toast " + type;
        }, 400);
      }, 5000);
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
            showToast("Data disimpan", "success");
            form.reset();
          } else {
            showToast("Gagal menyimpan data", "error");
          }
        })
        .catch(error => {
          showToast("Terjadi kesalahan: " + error.message, "error");
        });
    });
  }

  // ==== LAPORAN RKH ====
  const btnCari = document.getElementById("btn-cari");
  const bulanInput = document.getElementById("bulan");
  const tbody = document.querySelector("#tabel-laporan tbody");

  if (btnCari && bulanInput && tbody) {
    btnCari.addEventListener("click", () => {
      const bulan = bulanInput.value;
      if (!bulan) {
        alert("Silakan pilih bulan terlebih dahulu");
        return;
      }

      fetch(`https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec?bulan=${bulan}`)
        .then(res => res.json())
        .then(data => {
          tbody.innerHTML = "";

          if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="text-center">Tidak ada data untuk bulan ini</td></tr>`;
          } else {
            data.forEach((item, index) => {
              tbody.innerHTML += `
                <tr>
                  <td>${item.tanggal}</td>
                  <td>${item.kebun}</td>
                  <td>${item.divisi}</td>
                  <td>${item.jenis}</td>
                  <td>${item.blok}</td>
                  <td>${item.volume}</td>
                  <td>${item.hk}</td>
                  <td>${item.pengawas}</td>
                  <td><button class="btn btn-sm btn-danger btn-hapus" data-index="${index}">Hapus</button></td>
                </tr>`;
            });

            // Pasang listener ke tombol hapus
            document.querySelectorAll(".btn-hapus").forEach(button => {
              button.addEventListener("click", () => {
                const konfirmasi = confirm("Yakin ingin menghapus data ini?");
                if (!konfirmasi) return;

                const index = button.getAttribute("data-index");

                fetch(`https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec?hapus=${bulan}&index=${index}`, {
                  method: "GET",
                })
                  .then(res => res.text())
                  .then(msg => {
                    alert(msg);
                    btnCari.click(); // Refresh data setelah hapus
                  })
                  .catch(err => {
                    console.error("Gagal menghapus data:", err);
                    alert("Terjadi kesalahan saat menghapus.");
                  });
              });
            });
          }
        })
        .catch(err => {
          console.error("Gagal mengambil data:", err);
          alert("Terjadi kesalahan saat mengambil data.");
        });
    });
  }
});
