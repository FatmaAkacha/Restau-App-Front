/**
 * Print receipt for an order
 * Generates a thermal printer-friendly format
 */
export function printOrderReceipt(order) {
  const receiptContent = generateReceiptHTML(order)
  
  // Create a hidden iframe for printing
  const printWindow = window.open('', '', 'width=400,height=600')
  printWindow.document.write(receiptContent)
  printWindow.document.close()
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print()
    // Close after printing (optional)
    // printWindow.close()
  }
}

function generateReceiptHTML(order) {
  const items = order.items || []
  const total = Number(order.total || 0).toFixed(2)
  const subtotal = (total - (order.delivery_fee || 0)).toFixed(2)
  
  const itemsHTML = items.map(item => {
    const lineTotal = (item.price * item.quantity).toFixed(2)
    return `
      <tr>
        <td style="text-align:left; padding:4px 0">${item.quantity}x ${item.name}</td>
        <td style="text-align:right; padding:4px 0">€${lineTotal}</td>
      </tr>
      ${item.customization_summary ? `
        <tr>
          <td colspan="2" style="text-align:left; padding:2px 0 4px 20px; font-size:11px; color:#666">
            ↳ ${item.customization_summary}
          </td>
        </tr>
      ` : ''}
      ${item.notes ? `
        <tr>
          <td colspan="2" style="text-align:left; padding:2px 0 4px 20px; font-size:11px; color:#999; font-style:italic">
            📝 ${item.notes}
          </td>
        </tr>
      ` : ''}
    `
  }).join('')

  const timestamp = new Date().toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reçu Commande #${String(order.id).padStart(3, '0')}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 80mm;
          padding: 10mm;
          background: white;
          color: #000;
        }
        
        .receipt {
          width: 100%;
        }
        
        .header {
          text-align: center;
          margin-bottom: 10px;
          border-bottom: 2px solid #000;
          padding-bottom: 8px;
        }
        
        .header h1 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .header p {
          font-size: 11px;
          color: #666;
        }
        
        .order-info {
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px dashed #000;
          font-size: 11px;
        }
        
        .order-info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        
        .order-info-label {
          font-weight: bold;
        }
        
        .items {
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px dashed #000;
        }
        
        .items table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .items td {
          padding: 4px 0;
          font-size: 12px;
        }
        
        .items tr:last-child td {
          border-bottom: 1px solid #000;
          padding-bottom: 8px;
        }
        
        .totals {
          margin-bottom: 10px;
          padding: 8px 0;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 12px;
        }
        
        .total-row.final {
          font-weight: bold;
          font-size: 14px;
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
          padding: 6px 0;
          margin: 8px 0;
        }
        
        .footer {
          text-align: center;
          font-size: 10px;
          color: #666;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px dashed #000;
        }
        
        .footer p {
          margin-bottom: 4px;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <!-- Header -->
        <div class="header">
          <h1>GOODNAAN</h1>
          <p>Commande #${String(order.id).padStart(3, '0')}</p>
        </div>
        
        <!-- Order Info -->
        <div class="order-info">
          <div class="order-info-row">
            <span class="order-info-label">Client:</span>
            <span>${order.customer_name}</span>
          </div>
          <div class="order-info-row">
            <span class="order-info-label">Tél:</span>
            <span>${order.customer_phone}</span>
          </div>
          <div class="order-info-row">
            <span class="order-info-label">Type:</span>
            <span>${order.type === 'delivery' ? 'Livraison' : 'À emporter'}</span>
          </div>
          ${order.type === 'delivery' ? `
            <div class="order-info-row">
              <span class="order-info-label">Adresse:</span>
              <span>${order.delivery_address}</span>
            </div>
          ` : ''}
          <div class="order-info-row">
            <span class="order-info-label">Date:</span>
            <span>${timestamp}</span>
          </div>
        </div>
        
        <!-- Items -->
        <div class="items">
          <table>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>
        
        <!-- Totals -->
        <div class="totals">
          ${order.delivery_fee ? `
            <div class="total-row">
              <span>Sous-total:</span>
              <span>€${subtotal}</span>
            </div>
            <div class="total-row">
              <span>Frais de livraison:</span>
              <span>€${Number(order.delivery_fee).toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="total-row final">
            <span>TOTAL:</span>
            <span>€${total}</span>
          </div>
          <div class="total-row">
            <span>Paiement:</span>
            <span>${order.payment_status === 'paid' ? '✓ Payé' : 'Espèces'}</span>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p>Merci de votre commande!</p>
          <p>Bon appétit 🍽️</p>
        </div>
      </div>
    </body>
    </html>
  `
}
