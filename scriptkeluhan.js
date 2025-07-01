document.addEventListener("DOMContentLoaded", () => {
  const keluhanForm = document.getElementById("form-keluhan");
  const toast = document.getElementById("toast");
  const toastIcon = toast?.querySelector(".toast-icon");
  const toastMessage = toast?.querySelector(".toast-message");

  // Toast notification function
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

  // === TAMBAH INPUT PERBAIKAN ===
  document.getElementById("btn-tambah")?.addEventListener("click", () => {
    const wrapper = document.getElementById("perbaikan-wrapper");
    const lastGroup = wrapper?.querySelector(".perbaikan-group:last-child");

    if (!lastGroup) {
      showToast("Tidak ada entri yang bisa digandakan!", "error");
      return;
    }

    const clone = lastGroup.cloneNode(true);
    clone.querySelectorAll("input").forEach(input => input.value = "");
    clone.querySelectorAll("textarea").forEach(textarea => textarea.value = "");

    const alertClasses = [
      ["alert", "alert-primary"],
      ["alert", "alert-success"],
      ["alert", "alert-info"],
      ["alert", "alert-danger"],
      ["alert", "alert-warning"]
    ];

    clone.classList.remove("alert", "alert-primary", "alert-success", "alert-info", "alert-danger", "alert-warning");

    const allGroups = wrapper.querySelectorAll(".perbaikan-group");
    const colorIndex = allGroups.length % alertClasses.length;
    clone.classList.add(...alertClasses[colorIndex]);

    wrapper.appendChild(clone);
  });

  // === HAPUS INPUT PERBAIKAN ===
  document.getElementById("perbaikan-wrapper")?.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-hapus-input")) {
      const group = e.target.closest(".perbaikan-group");
      if (document.querySelectorAll(".perbaikan-group").length > 1) {
        group.remove();
      } else {
        showToast("Minimal 1 perbaikan harus ada", "error");
      }
    }
  });

  // === SUBMIT FORM KELUHAN ===
  if (keluhanForm) {
    keluhanForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const formData = new FormData(keluhanForm);
      const data = {
        kebun: formData.get("kebun"),
        divisi: formData.get("divisi"),
        blok: formData.get("blok"),
        pemanen: formData.get("pemanen"),
        pp: formData.get("pp"),
        tanggal: formData.get("tanggal"),
        keluhan: formData.get("keluhan"),
        foto_keluhan: formData.get("foto_keluhan").name,
        perbaikan: [],
        tanggal_perbaikan: [],
        foto_perbaikan: []
      };
      
      // Get all repair entries
      const perbaikanInputs = document.querySelectorAll('[name="perbaikan[]"]');
      perbaikanInputs.forEach((input, index) => {
        data.perbaikan.push(input.value);
        data.tanggal_perbaikan.push(document.querySelectorAll('[name="tanggal_perbaikan[]"]')[index].value);
        const fotoInput = document.querySelectorAll('[name="foto_perbaikan[]"]')[index];
        data.foto_perbaikan.push(fotoInput.files[0]?.name || "");
      });
      
      // Send to Google Apps Script
      fetch("https://script.google.com/macros/s/AKfycbzpf3tKfxTKMLUH_JN5zG0OiqgVlXzY2MER40uQGCgCSptjsSsazHhdLF8FTNyTdKJlTw/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
      .then(res => res.text())
      .then(response => {
        showToast("Keluhan berhasil disimpan", "success");
        keluhanForm.reset();
      })
      .catch(err => {
        showToast("Gagal menyimpan keluhan: " + err.message, "error");
      });
    });
  }
});
