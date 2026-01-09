let data = JSON.parse(localStorage.getItem("fabricData")) || [];

function saveAll() {
  localStorage.setItem("fabricData", JSON.stringify(data));
}

function addEntry() {
  const lot = document.getElementById("lot").value.trim();
  const pcs = Number(document.getElementById("pcs").value);
  const meter = Number(document.getElementById("meter").value);

 if (!lot || pcs === 0 || meter === 0) {

    alert("Please enter valid Lot, Pcs and Meter");
    return;
  }

  data.push({ lot, pcs, meter });
  saveAll();
  render();

  document.getElementById("lot").value = "";
  document.getElementById("pcs").value = "";
  document.getElementById("meter").value = "";
}

function render() {
  const tb = document.getElementById("tableBody");
  tb.innerHTML = "";

  data.forEach(d => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${d.lot}</td>
      <td>${d.pcs}</td>
      <td>${d.meter}</td>
    `;
    tb.appendChild(row);
  });
}

render();
