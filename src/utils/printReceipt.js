/**
 * Print utility for 80mm thermal printer receipts
 * Formats order tickets for kitchen/delivery staff
 */

export function printOrderReceipt(order) {
  const printWindow = window.open('', '', 'width=600,height=800')
  
  // Generate receipt HTML optimized for 80mm thermal printer
  const html = generateReceiptHTML(order)
  
  printWindow.document.write(html)
  printWindow.document.close()
  
  // Auto-print after content loads
  printWindow.onload = () => {
    printWindow.print()
    // Close window after printing
    setTimeout(() => printWindow.close(), 250)
  }
}

/**
 * Generate receipt HTML formatted for 80mm width thermal printer
 * 80mm = ~30 characters per line at default font
 */
function generateReceiptHTML(order) {
  const timestamp = new Date(order.created_at).toLocaleString('fr-FR')
  const orderNumber = String(order.id).padStart(5, '0')
  
  // Format items with quantities and notes
  const itemsHTML = order.items.map(item => {
    let itemLine = `<div class="item-line">
      <span class="qty">${item.quantity}×</span>
      <span class="name">${item.name}</span>
      <span class="price">€${(item.price * item.quantity).toFixed(2)}</span>
    </div>`
    
    if (item.customization_summary) {
      itemLine += `<div class="item-detail">→ ${item.customization_summary}</div>`
    }
    
    if (item.notes) {
      itemLine += `<div class="item-note">📝 ${item.notes}</div>`
    }
    
    return itemLine
  }).join('')
  
  // Format order type and payment info
  const orderType = order.type === 'delivery' ? 'LIVRAISON 🚚' : 'À EMPORTER 🏃'
  const paymentStatus = order.payment_status === 'paid' 
    ? 'PAIEMENT: ✅ PAYÉ'
    : 'PAIEMENT: 💵 À LA RÉCEPTION'
  
  // Format address if delivery
  const addressHTML = order.type === 'delivery' 
    ? `<div class="section-title">ADRESSE DE LIVRAISON</div>
       <div class="address">${order.delivery_address}</div>
       <div class="divider">─────────────────────</div>`
    : ''
  
  // Format notes if present
  const notesHTML = order.notes 
    ? `<div class="section-title">NOTES SPÉCIALES</div>
       <div class="notes">${order.notes}</div>
       <div class="divider">─────────────────────</div>`
    : ''
  
  // Build complete receipt
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket de Commande #${orderNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 80mm;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      background: white;
      padding: 0;
      margin: 0;
    }
    
    .receipt {
      width: 80mm;
      padding: 5mm;
      background: white;
      color: black;
    }
    
    .header {
      text-align: center;
      margin-bottom: 3mm;
      border-bottom: 2px dashed #000;
      padding-bottom: 3mm;
    }
    
    .header-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 2mm;
    }
    
    .order-number {
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 2px;
      margin: 2mm 0;
    }
    
    .timestamp {
      font-size: 10px;
      color: #333;
    }
    
    .customer-info {
      margin: 3mm 0;
      border-bottom: 1px solid #000;
      padding-bottom: 2mm;
    }
    
    .customer-name {
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 1mm;
    }
    
    .customer-phone {
      font-size: 11px;
    }
    
    .order-type {
      background: #000;
      color: white;
      padding: 2mm;
      margin: 2mm 0;
      text-align: center;
      font-size: 13px;
      font-weight: bold;
    }
    
    .section-title {
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 2mm;
      margin-bottom: 1mm;
      border-bottom: 1px solid #000;
      padding-bottom: 1mm;
    }
    
    .divider {
      text-align: center;
      margin: 1mm 0;
      color: #666;
    }
    
    .items {
      margin: 2mm 0;
      border-bottom: 2px solid #000;
      padding-bottom: 2mm;
    }
    
    .item-line {
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
      gap: 2mm;
      margin: 1mm 0;
      align-items: baseline;
      font-size: 12px;
    }
    
    .qty {
      font-weight: bold;
      text-align: left;
    }
    
    .name {
      text-align: left;
      word-wrap: break-word;
      word-break: break-word;
    }
    
    .price {
      font-weight: bold;
      text-align: right;
    }
    
    .item-detail {
      margin-left: 5mm;
      font-size: 10px;
      color: #333;
      font-style: italic;
    }
    
    .item-note {
      margin-left: 5mm;
      font-size: 10px;
      color: #555;
    }
    
    .address {
      font-size: 11px;
      margin-bottom: 1mm;
      word-wrap: break-word;
      word-break: break-word;
      line-height: 1.4;
    }
    
    .notes {
      font-size: 11px;
      margin-bottom: 1mm;
      word-wrap: break-word;
      word-break: break-word;
      line-height: 1.4;
    }
    
    .totals {
      margin: 2mm 0;
      border-top: 2px solid #000;
      padding-top: 2mm;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 1mm 0;
      font-size: 12px;
    }
    
    .total-row.subtotal {
      font-weight: normal;
    }
    
    .total-row.delivery {
      font-weight: normal;
      font-size: 11px;
    }
    
    .total-row.final {
      font-size: 14px;
      font-weight: bold;
      border-top: 1px solid #000;
      padding-top: 1mm;
      margin-top: 2mm;
    }
    
    .payment-info {
      text-align: center;
      margin: 2mm 0;
      font-size: 11px;
      font-weight: bold;
      padding: 1mm;
      background: #f0f0f0;
    }
    
    .footer {
      text-align: center;
      margin-top: 3mm;
      font-size: 10px;
      border-top: 1px dashed #000;
      padding-top: 2mm;
    }
    
    .tear-line {
      text-align: center;
      margin: 3mm 0;
      color: #999;
      font-size: 9px;
      letter-spacing: 2px;
    }
    
    @media print {
      body {
        width: 80mm;
        margin: 0;
        padding: 0;
      }
      .receipt {
        width: 80mm;
        margin: 0;
        padding: 5mm;
      }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <!-- Header -->
    <div class="header">
      <div class="header-title">TICKET DE COMMANDE</div>
      <div class="order-number">#${orderNumber}</div>
      <div class="timestamp">${timestamp}</div>
    </div>
    
    <!-- Customer Info -->
    <div class="customer-info">
      <div class="customer-name">${order.customer_name}</div>
      <div class="customer-phone">📞 ${order.customer_phone}</div>
    </div>
    
    <!-- Order Type Badge -->
    <div class="order-type">${orderType}</div>
    
    <!-- Address if Delivery -->
    ${addressHTML}
    
    <!-- Items -->
    <div class="section-title">ARTICLES</div>
    <div class="items">
      ${itemsHTML}
    </div>
    
    <!-- Notes if Present -->
    ${notesHTML}
    
    <!-- Totals -->
    <div class="totals">
      <div class="total-row subtotal">
        <span>Sous-total:</span>
        <span>€${(order.total - (order.delivery_fee || 0)).toFixed(2)}</span>
      </div>
      ${order.delivery_fee ? `<div class="total-row delivery">
        <span>Frais de livraison:</span>
        <span>€${Number(order.delivery_fee).toFixed(2)}</span>
      </div>` : ''}
      <div class="total-row final">
        <span>TOTAL:</span>
        <span>€${Number(order.total).toFixed(2)}</span>
      </div>
    </div>
    
    <!-- Payment Info -->
    <div class="payment-info">${paymentStatus}</div>
    
    <!-- Scheduled Time if Present -->
    ${order.scheduled_for ? `<div style="text-align: center; font-size: 11px; margin: 2mm 0; padding: 1mm; background: #fff3cd;">
      <strong>Horaire prévu:</strong><br>
      ${new Date(order.scheduled_for).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
    </div>` : ''}
    
    <!-- Footer -->
    <div class="footer">
      Merci pour votre commande!
      <div class="tear-line">✂ ✂ ✂ ✂ ✂ ✂</div>
    </div>
  </div>
</body>
</html>`
}
