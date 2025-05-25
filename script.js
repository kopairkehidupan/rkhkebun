document.getElementById('form-pekerjaan').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const data = new FormData(this);
  let output = '<h3>Data Tersimpan:</h3><ul>';
  for (let [key, value] of data.entries()) {
    output += `<li><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</li>`;
  }
  output += '</ul>';
  
  document.getElementById('output').innerHTML = output;
});
