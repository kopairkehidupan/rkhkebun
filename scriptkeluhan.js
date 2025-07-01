document.addEventListener("DOMContentLoaded", () => {
  // Toast notification function
  function showToast(message, type = "success", onClick = null) {
    const toast = document.getElementById("toast");
    const toastIcon = toast?.querySelector(".toast-icon");
    const toastMessage = toast?.querySelector(".toast-message");
    
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

  // Image preview functionality
  function setupImagePreview(input, previewId) {
    const preview = document.getElementById(previewId);
    input.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
          if (!preview) {
            const newPreview = document.createElement('img');
            newPreview.id = previewId;
            newPreview.className = 'preview-image';
            newPreview.src = e.target.result;
            input.parentNode.appendChild(newPreview);
          } else {
            preview.src = e.target.result;
          }
        }
        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  // Add repair entry
  document.getElementById("btn-tambah")?.addEventListener("click", () => {
    const wrapper = document.getElementById("perbaikan-wrapper");
    const lastGroup = wrapper?.querySelector(".perbaikan-group:last-child");
    if (!lastGroup) return;

    const clone = lastGroup.cloneNode(true);
    clone.querySelectorAll("input").forEach(input => {
      input.value = "";
      if (input.type === 'file') {
        input.nextElementSibling?.remove(); // Remove preview if exists
      }
    });
    clone.querySelectorAll("textarea").forEach(textarea => textarea.value = "");

    const colors = ["primary", "success", "info", "danger", "warning"];
    const colorIndex = wrapper.querySelectorAll(".perbaikan-group").length % colors.length;
    clone.className = `perbaikan-group border rounded p-3 mb-3 alert alert-${colors[colorIndex]}`;

    wrapper.appendChild(clone);
    setupImagePreview(clone.querySelector('[name="foto_perbaikan[]"]'), `preview-perbaikan-${Date.now()}`);
  });

  // Remove repair entry
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

  // Form submission
  const keluhanForm = document.getElementById("form-keluhan");
  if (keluhanForm) {
    // Setup image previews
    setupImagePreview(document.getElementById("foto_keluhan"), 'preview-keluhan');
    document.querySelector('[name="foto_perbaikan[]"]') && 
      setupImagePreview(document.querySelector('[name="foto_perbaikan[]"]'), 'preview-perbaikan');

    keluhanForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Menyimpan...';

      try {
        const formData = new FormData(this);
        const data = {
          kebun: formData.get("kebun"),
          divisi: formData.get("divisi"),
          blok: formData.get("blok"),
          pemanen: formData.get("pemanen"),
          pp: formData.get("pp"),
          tanggal: formData.get("tanggal"),
          keluhan: formData.get("keluhan"),
          perbaikan: []
        };

        // Process complaint photo
        const fotoKeluhan = formData.get("foto_keluhan");
        if (fotoKeluhan.size > 0) {
          data.foto_keluhan = {
            name: fotoKeluhan.name,
            type: fotoKeluhan.type,
            base64: await toBase64(fotoKeluhan)
          };
        }

        // Process repair entries
        const perbaikanInputs = Array.from(document.querySelectorAll('[name="perbaikan[]"]'));
        for (let i = 0; i < perbaikanInputs.length; i++) {
          const perbaikanEntry = {
            deskripsi: perbaikanInputs[i].value,
            tanggal: document.querySelectorAll('[name="tanggal_perbaikan[]"]')[i].value,
          };

          const fotoPerbaikan = document.querySelectorAll('[name="foto_perbaikan[]"]')[i].files[0];
          if (fotoPerbaikan) {
            perbaikanEntry.foto = {
              name: fotoPerbaikan.name,
              type: fotoPerbaikan.type,
              base64: await toBase64(fotoPerbaikan)
            };
          }

          data.perbaikan.push(perbaikanEntry);
        }

        // Submit data
        const response = await fetch("https://script.google.com/macros/s/AKfycbzpf3tKfxTKMLUH_JN5zG0OiqgVlXzY2MER40uQGCgCSptjsSsazHhdLF8FTNyTdKJlTw/exec", {
         method: "POST",
         mode: "no-cors", // Add this line
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(data)
         });

        const result = await response.text();
        showToast("Keluhan berhasil disimpan", "success");
        keluhanForm.reset();
        document.querySelectorAll('.preview-image').forEach(img => img.remove());
      } catch (err) {
        console.error("Error:", err);
        showToast("Gagal menyimpan keluhan: " + err.message, "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Simpan";
      }
    });
  }

  // Convert file to base64
  async function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }
});
