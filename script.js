document.getElementById("form-pekerjaan").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const statusMessage = document.getElementById("status-message");

    fetch("https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec", { // Ganti dengan URL Web App kamu
      method: "POST",
      body: data,
    })
    .then(res => res.text())
    .then(result => {
      statusMessage.textContent = result;
      statusMessage.className = "success";
      statusMessage.style.display = "block";
      form.reset();
    })
    .catch(error => {
      statusMessage.textContent = "Gagal mengirim data: " + error;
      statusMessage.className = "error";
      statusMessage.style.display = "block";
    });
  });
