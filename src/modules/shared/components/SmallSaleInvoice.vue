<template>
  <div class="saleInvoice">
    <div class="header">
      <h1>Sales Invoice</h1>
    </div>

    <table class="subHeadTable">
      <tr>
        <td><b>Date:</b> 11 April 2023</td>
        <td><b>Time:</b> 3:00 PM</td>
      </tr>
      <tr>
        <td colspan="2"><b>Invoice ID:</b> 12345</td>
      </tr>
      <tr>
        <td colspan="2"><b>Customer Name:</b> John Doe</td>
      </tr>
    </table>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Item 1</td>
          <td>2</td>
          <td>$10.00</td>
          <td>$20.00</td>
        </tr>
        <tr>
          <td>Item 2</td>
          <td>1</td>
          <td>$15.00</td>
          <td>$15.00</td>
        </tr>
        <tr>
          <td>Item 3</td>
          <td>3</td>
          <td>$5.00</td>
          <td>$15.00</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align: right">Subtotal:</td>
          <td>$50.00</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right">Tax:</td>
          <td>$5.00</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right">Total:</td>
          <td>$55.00</td>
        </tr>
      </tfoot>
    </table>

    <div class="footer">
      <p>ProgrammerzHub ERP Solution</p>
    </div>
  </div>
</template>
<style scoped>
/* Reset styles for the page */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Set the width of the page */
.saleInvoice {
  width: 80mm;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
}

/* Set the styles for the header */
.header {
  text-align: center;
  font-weight: bold;
  margin-bottom: 5mm;
}

/* Set the styles for the table */
table {
  width: 100%;
  border-collapse: collapse;
}

/* Set the styles for the table header */
th {
  text-align: left;
  padding: 2mm;
  border-bottom: 1px solid #000;
}

/* Set the styles for the table cells */
td {
  padding: 2mm;
  border-bottom: 1px solid #000;
}

/* Set the styles for the footer */
.footer {
  text-align: center;
  margin-top: 5mm;
}
.subHeadTable td {
  padding: 1mm;
  border: 0px;
}
</style>
