/**
 * Print utility for 80mm thermal printer receipts
 * Formats order tickets for kitchen/delivery staff
 */

export function printOrderReceipt(order) {
  const printWindow = window.open(
    "",
    "_blank",
    "width=400,height=700"
  );

  if (!printWindow) {
    alert("Veuillez autoriser les fenêtres pop-up pour imprimer.");
    return;
  }

  const html = generateReceiptHTML(order);

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  // Fermer la fenêtre après l'impression
  printWindow.onafterprint = () => {
    printWindow.close();
  };
}


/**
 * Generate receipt HTML formatted for 80mm width thermal printer
 * 80mm = ~30 characters per line at default font
 */

function generateReceiptHTML(order) {
  const timestamp = new Date(
    order.created_at || Date.now()
  ).toLocaleString("fr-FR");

  const orderNumber = String(order.id).padStart(5, "0");

  // Échapper les caractères HTML pour éviter les erreurs
  // si les noms ou les notes contiennent des caractères spéciaux.
  const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  const money = (value) =>
    `${Number(value || 0).toFixed(2)} €`;

  const separator = `<div class="separator">
    --------------------------------
  </div>`;

  const itemsHTML = (order.items || []).map((item) => {
    const quantity = Number(item.quantity || 0);
    const total = Number(item.price || 0) * quantity;

    return `
      <div class="item">
        <div class="item-name">
          ${quantity} x ${escapeHTML(item.name)}
        </div>
        <div class="item-price">
          ${money(total)}
        </div>

        ${
          item.customization_summary
            ? `<div class="detail">
                ${escapeHTML(item.customization_summary)}
              </div>`
            : ""
        }

        ${
          item.notes
            ? `<div class="detail">
                Note : ${escapeHTML(item.notes)}
              </div>`
            : ""
        }
      </div>
    `;
  }).join("");

  const deliveryFee = Number(order.delivery_fee || 0);
  const total = Number(order.total || 0);
  const subtotal = total - deliveryFee;

  const orderType =
    order.type === "delivery"
      ? "LIVRAISON"
      : "A EMPORTER";

  const paymentStatus =
    order.payment_status === "paid"
      ? "PAIEMENT : PAYE"
      : "PAIEMENT : A LA RECEPTION";

  return `<!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    >

    <title>Commande #${orderNumber}</title>

    <style>

@page {
  size: 80mm auto;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html,
body {
  width: 80mm;
  margin: 0 !important;
  padding: 0 !important;
  background: white;
  color: black;
}

body {
  font-family: "Courier New", monospace;
  font-size: 12px;
  line-height: 1.25;
  font-weight: normal;
}

.receipt {
  width: 72mm;
  margin: 0;
  padding: 3mm 2mm 5mm;
}

.header {
  text-align: left;
  border: none;
  margin: 0 0 12px;
  padding: 0;
}

.header-title {
  font-size: 12px;
  font-weight: normal;
  margin-bottom: 0;
}

.order-number {
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0;
  margin: 0;
}

.timestamp {
  font-size: 11px;
  color: black;
  margin-top: 5px;
}

.customer-info {
  margin: 8px 0;
  border: none;
  padding: 0;
}

.customer-name,
.customer-phone {
  font-size: 12px;
  font-weight: normal;
  overflow-wrap: anywhere;
}

.order-type {
  background: white;
  color: black;
  padding: 0;
  margin: 8px 0;
  text-align: left;
  font-size: 12px;
  font-weight: normal;
}

.section-title {
  font-size: 12px;
  font-weight: normal;
  text-transform: none;
  margin: 8px 0 4px;
  padding: 0;
  border: none;
}

.divider {
  text-align: left;
  margin: 6px 0;
  color: black;
}

.items {
  margin: 4px 0;
  padding-bottom: 4px;
  border-bottom: none;
}

.item-line {
  display: block;
  margin: 4px 0;
  font-size: 12px;
}

.qty,
.name,
.price {
  display: inline;
  font-weight: normal;
  text-align: left;
}

.item-detail,
.item-note {
  margin-left: 4mm;
  font-size: 11px;
  color: black;
}

.address,
.notes {
  font-size: 12px;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.totals {
  margin: 8px 0;
  padding-top: 0;
  border-top: none;
}

.total-row {
  display: flex;
  justify-content: space-between;
  gap: 3mm;
  margin: 4px 0;
  font-size: 12px;
}

.total-row.final {
  font-size: 12px;
  font-weight: normal;
  border-top: none;
  padding-top: 0;
  margin-top: 5px;
}

.payment-info {
  background: white;
  padding: 0;
  text-align: left;
  font-size: 12px;
  font-weight: normal;
}

.footer {
  text-align: left;
  margin-top: 10px;
  font-size: 11px;
  border-top: none;
  padding-top: 0;
}

.tear-line {
  display: none;
}

@media print {
  html,
  body {
    width: 80mm !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .receipt {
    width: 72mm;
    margin: 0;
    padding: 2mm 2mm 4mm;
  }
}
    </style>
  </head>

  <body>
    <div class="receipt">

      <div class="center">
        <div class="title">TICKET DE COMMANDE</div>
        <div class="order-number">N° ${orderNumber}</div>
        <div class="timestamp">${escapeHTML(timestamp)}</div>
      </div>

      ${separator}

      <div class="customer">
        <strong>CLIENT :</strong>
        ${escapeHTML(order.customer_name)}
      </div>

      <div class="customer">
        <strong>TEL :</strong>
        ${escapeHTML(order.customer_phone)}
      </div>

      <div class="center" style="margin-top: 8px">
        <strong>${orderType}</strong>
      </div>

      ${
        order.type === "delivery"
          ? `
            ${separator}
            <div class="section-title">
              ADRESSE DE LIVRAISON
            </div>
            <div class="address">
              ${escapeHTML(order.delivery_address)}
            </div>
          `
          : ""
      }

      ${separator}

      <div class="section-title">ARTICLES</div>

      ${itemsHTML || "<div>Aucun article</div>"}

      ${separator}

      <div class="total-row">
        <span>Sous-total :</span>
        <span>${money(subtotal)}</span>
      </div>

      ${
        deliveryFee > 0
          ? `
            <div class="total-row">
              <span>Livraison :</span>
              <span>${money(deliveryFee)}</span>
            </div>
          `
          : ""
      }

      <div class="total-row grand-total">
        <span>TOTAL :</span>
        <span>${money(total)}</span>
      </div>

      ${separator}

      <div class="payment">
        ${paymentStatus}
      </div>

      ${
        order.scheduled_time
          ? `
            <div class="scheduled">
              COMMANDE PROGRAMMEE<br>
              ${escapeHTML(
                new Date(order.scheduled_time)
                  .toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
              )}
            </div>
          `
          : ""
      }

      ${
        order.notes
          ? `
            ${separator}
            <div class="section-title">NOTES</div>
            <div class="notes">${escapeHTML(order.notes)}</div>
          `
          : ""
      }

      ${separator}

      <div class="footer">
        Merci pour votre commande !
      </div>

    </div>
  </body>
  </html>`;
}
