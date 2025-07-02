function saveInvoiceDataToLocalStorage() {
  const data = {
    clientName: document.getElementById("clientName").value,
    clientAddress: document.getElementById("clientAddress").value,
    clientPhone: document.getElementById("clientPhone").value,
    clientEmail: document.getElementById("clientEmail").value,
    invoiceNumber: document.getElementById("invoiceNumber").value,
    invoiceDate: document.getElementById("invoiceDate").value,
    dueDate: document.getElementById("dueDate").value,
    notes: document.getElementById("notes").value,
    items: Array.from(document.querySelectorAll("#itemsBody tr")).map(row => ({
      description: row.querySelector(".desc").value,
      quantity: row.querySelector(".qty").value,
      unitPrice: row.querySelector(".price").value
    }))
  };
  localStorage.setItem("invoiceData", JSON.stringify(data));
}

function loadInvoiceDataFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("invoiceData"));
  if (!data) return;
  document.getElementById("clientName").value = data.clientName || "";
  document.getElementById("clientAddress").value = data.clientAddress || "";
  document.getElementById("clientPhone").value = data.clientPhone || "";
  document.getElementById("clientEmail").value = data.clientEmail || "";
  document.getElementById("invoiceNumber").value = data.invoiceNumber || "";
  document.getElementById("invoiceDate").value = data.invoiceDate || "";
  document.getElementById("dueDate").value = data.dueDate || "";
  document.getElementById("notes").value = data.notes || "";
  // Clear existing items
  const tbody = document.getElementById("itemsBody");
  tbody.innerHTML = "";
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>Hours</td>
        <td><input type="text" class="desc" placeholder="Item description" value="${item.description}"></td>
        <td><input type="number" class="qty" value="${item.quantity}" onchange="updateTotals()"></td>
        <td><input type="number" class="price" value="${item.unitPrice}" onchange="updateTotals()"></td>
        <td class="lineTotal">$0.00</td>
        <td>
          <button onclick="removeItem(this)">Remove</button>
          <button onclick="duplicateItem(this)">Duplicate</button>
        </td>
      `;
      tbody.appendChild(row);
    });
    updateTotals();
  }
}

function formatCurrency(value) {
  let newvalue = new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
  }).format(value);

  console.log(newvalue);
  return newvalue;
}
function addItem(existingRow = null) {
  const tbody = document.getElementById("itemsBody");
  const row = document.createElement("tr");

  const description = existingRow
    ? existingRow.querySelector(".desc").value
    : "";
  const quantity = existingRow ? existingRow.querySelector(".qty").value : 1;
  const unitPrice = existingRow ? existingRow.querySelector(".price").value : 0;

  row.innerHTML = `
  <td>Hours</td>
      <td><input type="text" class="desc" placeholder="Item description" value="${description}"></td>
      <td><input type="number" class="qty" value="${quantity}" onchange="updateTotals()"></td>
      <td><input type="number" class="price" value="${unitPrice}" onchange="updateTotals()"></td>
      <td class="lineTotal">$0.00</td>
      <td>
        <button onclick="removeItem(this)">Remove</button>
        <button onclick="duplicateItem(this)">Duplicate</button>
      </td>
    `;

  tbody.appendChild(row);
  updateTotals();
}

function duplicateItem(btn) {
  const row = btn.closest("tr");
  addItem(row);
}

function removeItem(btn) {
  btn.closest("tr").remove();
  updateTotals();
}

function updateTotals() {
  const rows = document.querySelectorAll("#itemsBody tr");
  let subtotal = 0;
  rows.forEach((row) => {
    const qty = parseFloat(row.querySelector(".qty").value) || 0;
    const price = parseFloat(row.querySelector(".price").value) || 0;
    const total = qty * price;
    row.querySelector(".lineTotal").textContent = formatCurrency(total);
    subtotal += total;
  });

  const taxRate = parseFloat(document.getElementById("taxRate").value) || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const totalAmount = subtotal + taxAmount;

  document.getElementById("subtotal").textContent = `$${formatCurrency(
    subtotal
  )}`;
  document.getElementById("taxAmount").textContent = `$ ${formatCurrency(
    taxAmount
  )}`;
  document.getElementById("totalAmount").textContent = `$${formatCurrency(
    totalAmount
  )}`;
}

function generatePreview() {
  const invoicePreview = document.getElementById("invoicePreview");
  const clientName = document.getElementById("clientName").value;
  const clientAddress = document.getElementById("clientAddress").value;
  const clientPhone = document.getElementById("clientPhone").value;
  const clientEmail = document.getElementById("clientEmail").value;

  const invoiceNumber = document.getElementById("invoiceNumber").value;
  const invoiceDate = document.getElementById("invoiceDate").value;
  const dueDate = document.getElementById("dueDate").value;

  const notes = document.getElementById("notes").value;

  let itemsHtml = "";
  const rows = document.querySelectorAll("#itemsBody tr");
  rows.forEach((row) => {
    const desc = row.querySelector(".desc").value;
    const qty = row.querySelector(".qty").value;
    const price = row.querySelector(".price").value;
    const lineTotal = row.querySelector(".lineTotal").textContent;
    itemsHtml += `
        <tr>
          <td>Hours</td>
          <td>${desc}</td>
          <td>${qty}</td>
          <td>$${formatCurrency(price)}</td>
          <td>$${lineTotal}</td>
        </tr>
      `;
  });

  invoicePreview.innerHTML = `

  <hr style="margin: 20px 0;">
  <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
  <!-- Left (Client Info) -->
  <div style="width: 48%;">
  
    <p>
      ${clientName}<br>
      ${clientAddress}<br>
      ${clientPhone}<br>
      ${clientEmail}
    </p>
  </div>

  <!-- Right (Invoice Info) -->
  <div style="width: 48%; text-align: right;">
    <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
    <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
    <p><strong>Due Date:</strong> ${dueDate}</p>
  </div>
</div>

    <div style="text-align:left; margin-bottom:20px;">
    <h1>Teacher David's Academy </h1>
    <p>Teacherdavidacademy@outlook.com<br>+57 313 209-7884
<br>Pereira, Risaralda<br></p>
  </div>

  <table style="width:100%; margin-top:20px; border-collapse: collapse;">
    <thead style="background-color: #f0f0f0;">
      <tr>
       <th style="border:1px solid #ddd; padding:8px;">Item</th>
        <th style="border:1px solid #ddd; padding:8px;">Description</th>
        <th style="border:1px solid #ddd; padding:8px;">Qty</th>
        <th style="border:1px solid #ddd; padding:8px;">Unit Price</th>
        <th style="border:1px solid #ddd; padding:8px;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div style="margin-top: 20px; text-align:right;">
    <h4>Subtotal: ${document.getElementById("subtotal").textContent}</h4>
    <h4>Tax: ${document.getElementById("taxAmount").textContent}</h4>
    <h2>Total: ${document.getElementById("totalAmount").textContent}</h2>
  </div>

  <div style="margin-top:30px;">
    <p><strong>Notes:</strong></p>
    <p>${notes}</p>
  </div>`;

  invoicePreview.style.display = "block"; // <- MAKE SURE it's visible
  invoicePreview.style.visibility = "visible"; // <- Also visibility
  invoicePreview.style.position = "relative";
}

function downloadPDF() {
  generatePreview();
  const element = document.getElementById("invoicePreview");

  const opt = {
    margin: 0.5,
    filename: "invoice.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.offsetWidth,
    },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save();
}

[
  "clientName",
  "clientAddress",
  "clientPhone",
  "clientEmail",
  "invoiceNumber",
  "invoiceDate",
  "dueDate",
  "notes",
].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("input", saveInvoiceDataToLocalStorage);
});

// Add event delegation for item changes in the table
const itemsBody = document.getElementById("itemsBody");
itemsBody.addEventListener("input", function (e) {
  if (
    e.target.classList.contains("desc") ||
    e.target.classList.contains("qty") ||
    e.target.classList.contains("price")
  ) {
    saveInvoiceDataToLocalStorage();
  }
});

window.addEventListener("DOMContentLoaded", loadInvoiceDataFromLocalStorage);