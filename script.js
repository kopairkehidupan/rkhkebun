document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-pekerjaan");
  const toast = document.getElementById("toast");
  const toastIcon = toast?.querySelector(".toast-icon");
  const toastMessage = toast?.querySelector(".toast-message");
  const progressWrapper = document.getElementById("progress-wrapper");
  const progressBar = document.getElementById("progress-bar");

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

  // ==== TAMBAH INPUT PEKERJAAN ====
  document.getElementById("btn-tambah")?.addEventListener("click", () => {
    const wrapper = document.getElementById("pekerjaan-wrapper");
    const lastGroup = wrapper?.querySelector(".pekerjaan-group:last-child");

    if (!lastGroup) {
      showToast("Tidak ada entri yang bisa digandakan!", "error");
      return;
    }

    const clone = lastGroup.cloneNode(true);
    clone.querySelectorAll("input").forEach(input => input.value = "");

    const alertClasses = [
      ["alert", "alert-primary"],
      ["alert", "alert-success"],
      ["alert", "alert-info"],
      ["alert", "alert-danger"],
      ["alert", "alert-warning"]
    ];

    clone.classList.remove("alert", "alert-primary", "alert-success", "alert-info", "alert-danger", "alert-warning");

    const allGroups = wrapper.querySelectorAll(".pekerjaan-group");
    const colorIndex = allGroups.length % alertClasses.length;
    clone.classList.add(...alertClasses[colorIndex]);

    wrapper.appendChild(clone);
  });

  // ==== HAPUS INPUT PEKERJAAN ====
  document.getElementById("pekerjaan-wrapper")?.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-hapus-input")) {
      const group = e.target.closest(".pekerjaan-group");
      if (document.querySelectorAll(".pekerjaan-group").length > 1) {
        group.remove();
      } else {
        showToast("Minimal 1 pekerjaan harus ada", "error");
      }
    }
  });

  // ==== SUBMIT FORM ====
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
  const tanggalMulaiInput = document.getElementById("tanggalMulai");
  const tanggalAkhirInput = document.getElementById("tanggalAkhir");
  const tbody = document.querySelector("#tabel-laporan tbody");

  if (btnCari && tbody) {
    btnCari.addEventListener("click", () => {
      const bulan = bulanInput.value;
      const mulai = tanggalMulaiInput.value;
      const akhir = tanggalAkhirInput.value;

      let url = "";

      if (mulai && akhir && !bulan) {
        url = `https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec?tanggal_mulai=${mulai}&tanggal_akhir=${akhir}`;
      } else if (bulan && !mulai && !akhir) {
        url = `https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec?bulan=${bulan}`;
      } else if (!bulan && (!mulai || !akhir)) {
        showToast("Silakan pilih bulan atau rentang tanggal dengan lengkap", "error");
        return;
      } else {
        url = `https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec?tanggal_mulai=${mulai}&tanggal_akhir=${akhir}`;
      }

      progressWrapper.style.display = "block";
      progressBar.style.width = "0%";
      progressBar.textContent = "0%";
      progressBar.setAttribute("aria-valuenow", "0");

      fetch(url)
        .then(res => res.json())
        .then(data => {
          tbody.innerHTML = "";

          if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="11" class="text-center">Tidak ada data ditemukan</td></tr>`;
            progressWrapper.style.display = "none";
            return;
          }

          let totalLuas = 0;
          let totalVolume = 0;
          let totalHK = 0;

          data.forEach((item, index) => {
            const percent = Math.floor(((index + 1) / data.length) * 100);
            progressBar.style.width = `${percent}%`;
            progressBar.textContent = `${percent}%`;
            progressBar.setAttribute("aria-valuenow", percent);

            const luasVal = parseFloat(item.luas) || 0;
            const volumeVal = parseFloat(item.volume) || 0;
            const hkVal = parseFloat(item.hk) || 0;

            totalLuas += luasVal;
            totalVolume += volumeVal;
            totalHK += hkVal;

            tbody.innerHTML += `
              <tr>
                <td>${item.tanggal}</td>
                <td>${item.kebun}</td>
                <td>${item.divisi}</td>
                <td>${item.jenis}</td>
                <td>${item.blok}</td>
                <td class="text-end">${item.luas}</td>
                <td class="text-end">${item.volume}</td>
                <td class="text-end">${item.hk}</td>
                <td>${item.bahan}</td>
                <td>${item.pengawas}</td>
                <td><button class="btn btn-sm btn-danger btn-hapus-laporan" data-index="${index}">Hapus</button></td>
              </tr>`;
          });

          // Tambahkan baris total
          tbody.innerHTML += `
            <tr class="table-success fw-bold">
              <td colspan="5" class="text-end">Total</td>
              <td class="text-end">${totalLuas.toFixed(2)}</td>
              <td class="text-end">${totalVolume.toFixed(2)}</td>
              <td class="text-end">${totalHK.toFixed(2)}</td>
              <td colspan="3"></td>
            </tr>`;

          setTimeout(() => {
            progressWrapper.style.display = "none";
          }, 400);

          // Event hapus
          document.querySelectorAll(".btn-hapus-laporan").forEach(button => {
            button.addEventListener("click", () => {
              const index = button.getAttribute("data-index");

              showToast("Tekan disini untuk konfirmasi hapus data", "confirm", () => {
                let hapusUrl = "";

                if (mulai && akhir && (!bulan || bulan === "")) {
                  hapusUrl = `https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec?hapus_tanggal=${mulai}&akhir=${akhir}&index=${index}`;
                } else if (bulan && (!mulai || !akhir)) {
                  hapusUrl = `https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec?hapus=${bulan}&index=${index}`;
                } else {
                  hapusUrl = `https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec?hapus_tanggal=${mulai}&akhir=${akhir}&index=${index}`;
                }

                fetch(hapusUrl)
                  .then(res => res.text())
                  .then(msg => {
                    showToast(msg, "success");
                    btnCari.click(); // Refresh
                  })
                  .catch(err => {
                    console.error("Gagal menghapus data:", err);
                    showToast("Terjadi kesalahan saat menghapus", "error");
                  });
              });
            });
          });
        })
        .catch(err => {
          console.error("Gagal mengambil data:", err);
          showToast("Terjadi kesalahan saat mengambil data", "error");
          progressWrapper.style.display = "none";
        });
    });
  }
});
