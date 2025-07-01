document.addEventListener("DOMContentLoaded", () => {
  // Toast notification
  const toast = document.getElementById("toast");
  
  function showToast(message, type = "success") {
    toast.querySelector(".toast-message").textContent = message;
    toast.querySelector(".toast-icon").textContent = type === "success" ? "✔️" : "❌";
    toast.className = `toast show ${type === "error" ? "error" : ""}`;
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }

  // Preview image
  document.getElementById("foto_keluhan").addEventListener("change", function(e) {
    const preview = document.getElementById("preview-keluhan");
    const previewImg = document.getElementById("preview-keluhan-img");
    
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        preview.style.display = "block";
        previewImg.src = e.target.result;
      }
      
      reader.readAsDataURL(this.files[0]);
    }
  });

  // Tambah input perbaikan
  document.getElementById("btn-tambah").addEventListener("click", () => {
    const wrapper = document.getElementById("perbaikan-wrapper");
    const lastGroup = wrapper.querySelector(".perbaikan-group:last-child");
    
    const clone = lastGroup.cloneNode(true);
    clone.querySelectorAll("input").forEach(input => input.value = "");
    clone.querySelectorAll("textarea").forEach(textarea => textarea.value = "");
    clone.querySelector(".preview-perbaikan").style.display = "none";
    
    // Rotate alert colors
    const colors = ["alert-primary", "alert-success", "alert-info", "alert-warning"];
    const currentColor = Array.from(clone.classList).find(cls => cls.startsWith("alert-"));
    const nextColor = colors[(colors.indexOf(currentColor) + 1] || colors[0];
    
    clone.classList.remove(currentColor);
    clone.classList.add(nextColor);
    
    wrapper.appendChild(clone);
    
    // Add preview for new file input
    clone.querySelector("input[type='file']").addEventListener("change", function(e) {
      const preview = this.closest(".perbaikan-group").querySelector(".preview-perbaikan");
      const img = preview.querySelector("img");
      
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          preview.style.display = "block";
          img.src = e.target.result;
        }
        
        reader.readAsDataURL(this.files[0]);
      }
    });
  });

  // Hapus input perbaikan
  document.getElementById("perbaikan-wrapper").addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-hapus-input")) {
      const groups = document.querySelectorAll(".perbaikan-group");
      if (groups.length > 1) {
        e.target.closest(".perbaikan-group").remove();
      } else {
        showToast("Minimal harus ada 1 perbaikan", "error");
      }
    }
  });

  // Form submission
  document.getElementById("form-keluhan").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Menyimpan...';
    
    try {
      // Convert files to base64
      const files = {
        foto_keluhan: await fileToBase64(formData.get("foto_keluhan")),
        foto_perbaikan: []
      };
      
      // Convert all perbaikan files
      const fotoPerbaikanFiles = formData.getAll("foto_perbaikan[]");
      for (let i = 0; i < fotoPerbaikanFiles.length; i++) {
        if (fotoPerbaikanFiles[i].size > 0) {
          files.foto_perbaikan.push(await fileToBase64(fotoPerbaikanFiles[i]));
        } else {
          files.foto_perbaikan.push(null);
        }
      }
      
      // Prepare data
      const data = {
        kebun: formData.get("kebun"),
        divisi: formData.get("divisi"),
        blok: formData.get("blok"),
        pemanen: formData.get("pemanen"),
        pp: formData.get("pp"),
        tanggal: formData.get("tanggal"),
        keluhan: formData.get("keluhan"),
        perbaikan: formData.getAll("perbaikan[]"),
        tanggal_perbaikan: formData.getAll("tanggal_perbaikan[]"),
        files: files
      };
      
      // Send to Google Apps Script
      const response = await fetch("https://script.google.com/macros/s/AKfycbzpf3tKfxTKMLUH_JN5zG0OiqgVlXzY2MER40uQGCgCSptjsSsazHhdLF8FTNyTdKJlTw/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast("Data berhasil disimpan");
        form.reset();
        document.querySelectorAll(".preview-perbaikan, #preview-keluhan").forEach(el => {
          el.style.display = "none";
        });
      } else {
        throw new Error(result.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(error.message, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Simpan";
    }
  });
  
  // Helper function to convert file to base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file || file.size === 0) {
        resolve(null);
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  }
});
