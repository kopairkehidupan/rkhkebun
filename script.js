document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-pekerjaan");
  const toast = document.getElementById("toast");
  const toastIcon = toast?.querySelector(".toast-icon");
  const toastMessage = toast?.querySelector(".toast-message");

  // Fungsi toast universal
  function showToast(message, type = "success", onClick = null) {
    if (!toast) return;

    toastMessage.textContent = message;
    toastIcon.textContent = type === "success" ? "✔️" : type === "error" ? "❌" : "⚠️";
    toast.className = "toast show " + type;

    if (onClick) {
      toast.onclick = () => {
        toast.classList.remove("show");
        onClick();
        toast.onclick = null;
      };
    } else {
      setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => {
          toast.className = "toast " + type;
        }, 400);
      }, 4000);
    }
  }

  document.getElementById("btn-tambah").addEventListener("click", () => {
    const wrapper = document.getElementById("pekerjaan-wrapper");
    const lastGroup = wrapper.querySelector(".pekerjaan-group:last-child");
    const clone = lastGroup.cloneNode(true);
  
    clone.querySelectorAll("input").forEach(input => input.value = "");
    clone.querySelector(".btn-hapus").addEventListener("click", () => clone.remove());
  
    wrapper.appendChild(clone);
  });
  
  document.querySelectorAll(".btn-hapus-input").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".pekerjaan-group");
      if (document.querySelectorAll(".pekerjaan-group").length > 1) {
        group.remove();
      } else {
        showToast("Minimal 1 pekerjaan harus ada", "error");
      }
    });
  });

  // ==== FORM RKH ====
  if (form && toast) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
    
      const formData = new FormData(form);
    
      const kebun = formData.get("kebun");
      const divisi = formData.get("divisi");
      const tanggal = formData.get("tanggal");
    
      const jenis = formData.getAll("jenis[]");
      const blok = formData.getAll("blok[]");
      const luas = formData.getAll("luas[]");
      const volume = formData.getAll("volume[]");
      const hk = formData.getAll("hk[]");
      const bahan = formData.getAll("bahan[]");
      const pengawas = formData.getAll("penanggung_jawab[]");
    
      let promises = [];
    
      for (let i = 0; i < jenis.length; i++) {
        const data = new URLSearchParams({
          kebun,
          divisi,
          tanggal,
          jenis: jenis[i],
          blok: blok[i],
          luas: luas[i],
          volume: volume[i],
          hk: hk[i],
          bahan: bahan[i],
          penanggung_jawab: pengawas[i],
        });
    
        promises.push(
          fetch("https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec", {
            method: "POST",
            body: data,
          }).then(res => res.text())
        );
      }
    
      Promise.all(promises)
        .then(() => {
          showToast("Semua data berhasil disimpan", "success");
          form.reset();
        })
        .catch(err => {
          showToast("Gagal menyimpan: " + err.message, "error");
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
        showToast("Silakan pilih bulan terlebih dahulu", "error");
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
                  <td><button class="btn btn-sm btn-danger btn-hapus-laporan" data-index="${index}">Hapus</button></td>
                </tr>`;
            });

            // Listener tombol hapus
            document.querySelectorAll(".btn-hapus-laporan").forEach(button => {
            button.addEventListener("click", () => {
              const index = button.getAttribute("data-index");
              const bulan = bulanInput.value;
          
              showToast("Tekan disini untuk konfirmasi hapus data", "confirm", () => {
                fetch(`https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec?hapus=${bulan}&index=${index}`, {
                  method: "GET",
                })
                  .then(res => res.text())
                  .then(msg => {
                    showToast(msg, "success");
                    btnCari.click(); // refresh data
                  })
                  .catch(err => {
                    console.error("Gagal menghapus data:", err);
                    showToast("Terjadi kesalahan saat menghapus", "error");
                  });
              });
            });
          });
          }
        })
        .catch(err => {
          console.error("Gagal mengambil data:", err);
          showToast("Terjadi kesalahan saat mengambil data", "error");
        });
    });
  }
});
