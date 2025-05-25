document.getElementById("form-pekerjaan").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    fetch("https://script.google.com/macros/s/AKfycbywkqNEpDPrgDw5RdYhIivwjnEX7kjpKjWwfBuM20D-vrrbR7yQGL45qXQKrE2GSo3Khw/exec", { // Ganti dengan URL Web App kamu
      method: "POST",
      body: data,
    })
    .then(res => res.text())
    .then(result => {
      alert(result);
      form.reset();
    })
    .catch(error => {
      alert("Gagal mengirim data: " + error);
    });
  });
