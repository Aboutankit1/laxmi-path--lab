const PDFDocument = require("pdfkit");

// Generates a lab report PDF as a Buffer
const generateReportPDF = ({ labInfo, patient, test, results, verifiedBy }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    doc
      .fontSize(18)
      .fillColor("#0F6D5E")
      .text(labInfo?.labName || "Laxmi Path Lab", { align: "center" });
    doc
      .fontSize(10)
      .fillColor("#555")
      .text(labInfo?.address || "", { align: "center" });
    doc.moveDown();
    doc
      .strokeColor("#0F6D5E")
      .lineWidth(1)
      .moveTo(40, doc.y)
      .lineTo(555, doc.y)
      .stroke();
    doc.moveDown();

    doc
      .fontSize(12)
      .fillColor("#111")
      .text(`Patient: ${patient?.name || ""}`);
    doc.text(`Patient ID: ${patient?.patientId || ""}`);
    doc.text(`Age/Gender: ${patient?.age || "-"} / ${patient?.gender || "-"}`);
    doc.text(`Test: ${test?.name || ""} (${test?.testCode || ""})`);
    doc.moveDown();

    doc.fontSize(13).text("Test Results", { underline: true });
    doc.moveDown(0.5);

    (results || []).forEach((r) => {
      doc
        .fontSize(11)
        .fillColor(r.flag && r.flag !== "Normal" ? "#C0392B" : "#111")
        .text(
          `${r.parameter}: ${r.value} ${r.unit || ""}  (Normal: ${r.normalRange || "-"})  ${r.flag || ""}`,
        );
    });

    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor("#555")
      .text(`Verified by: ${verifiedBy || "Lab In-charge"}`);
    doc.text(`Generated on: ${new Date().toLocaleString()}`);

    doc.end();
  });
};

// Generates an invoice PDF as a Buffer - SIMPLIFIED VERSION
const generateInvoicePDF = ({ labInfo, invoice, patient }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Ensure all numbers are valid
      const inv = invoice || {};
      const subTotal = Number(inv.subTotal) || 0;
      const discount = Number(inv.discount) || 0;
      const gstPercent = Number(inv.gstPercent) || 0;
      const gstAmount = Number(inv.gstAmount) || 0;
      const grandTotal = Number(inv.grandTotal) || 0;
      const paidAmount = Number(inv.paidAmount) || 0;
      const dueAmount = Number(inv.dueAmount) || 0;

      // ===== HEADER =====
      doc
        .fontSize(22)
        .fillColor("#0F6D5E")
        .font("Helvetica-Bold")
        .text(labInfo?.labName || "Laxmi Path Lab");
      doc
        .fontSize(9)
        .fillColor("#666")
        .font("Helvetica")
        .text(labInfo?.address || "")
        .text(labInfo?.phone || "");
      doc.moveDown(0.5);
      doc
        .strokeColor("#0F6D5E")
        .lineWidth(2)
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .stroke();
      doc.moveDown(0.5);

      // Invoice title and metadata
      doc
        .fontSize(14)
        .fillColor("#0F6D5E")
        .font("Helvetica-Bold")
        .text("INVOICE");
      doc.fontSize(9).fillColor("#333").font("Helvetica");
      doc.text(`Invoice #: ${inv.invoiceNumber || "N/A"}`);
      doc.text(`Date: ${new Date(inv.createdAt).toLocaleDateString()}`);
      doc.moveDown(0.5);

      // Bill To Section
      doc
        .fontSize(10)
        .fillColor("#0F6D5E")
        .font("Helvetica-Bold")
        .text("Bill To:");
      doc
        .fontSize(10)
        .fillColor("#000")
        .font("Helvetica")
        .text(patient?.name || "N/A");
      doc
        .fontSize(9)
        .fillColor("#666")
        .text(`ID: ${patient?.patientId || "N/A"}`)
        .text(`Mobile: ${patient?.mobile || "N/A"}`);
      doc.moveDown(0.5);

      // Items Table Header
      const headerY = doc.y;
      doc.rect(40, headerY, 515, 20).fill("#0F6D5E");
      doc.fontSize(9).fillColor("white").font("Helvetica-Bold");
      doc.text("Description", 50, headerY + 5);
      doc.text("Qty", 300, headerY + 5);
      doc.text("Rate", 380, headerY + 5);
      doc.text("Amount", 460, headerY + 5, { align: "right" });
      doc.moveDown(1.6);

      // Items
      doc.fontSize(9).fillColor("#333").font("Helvetica");
      (inv.items || []).forEach((item, i) => {
        const amount = (item.price || 0) * (item.quantity || 1);
        const rowY = doc.y;
        if (i % 2 === 0) doc.rect(40, rowY - 3, 515, 18).fill("#F9F9F9");
        doc.text(item.name || item.test?.name || "Service", 50, rowY);
        doc.text(`${item.quantity || 1}`, 300, rowY);
        doc.text(`₹${Number(item.price || 0).toFixed(2)}`, 380, rowY);
        doc.text(`₹${amount.toFixed(2)}`, 460, rowY, { align: "right" });
        doc.moveDown(1.2);
      });

      doc.moveDown(0.3);

      // Totals
      doc
        .strokeColor("#DDD")
        .lineWidth(0.5)
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .stroke();
      doc.moveDown(0.4);

      const rightCol = 380;
      doc.fontSize(9).fillColor("#666").font("Helvetica");
      doc
        .text("Subtotal:", rightCol)
        .text(`₹${subTotal.toFixed(2)}`, 460, doc.y - 14, { align: "right" });

      if (discount > 0) {
        doc.moveDown(0.4);
        doc
          .text("Discount:", rightCol)
          .text(`₹${discount.toFixed(2)}`, 460, doc.y - 14, { align: "right" });
      }

      if (gstPercent > 0) {
        doc.moveDown(0.4);
        doc
          .text(`GST (${gstPercent}%):`, rightCol)
          .text(`₹${gstAmount.toFixed(2)}`, 460, doc.y - 14, {
            align: "right",
          });
      }

      // Grand Total Box
      doc.moveDown(0.4);
      const totalY = doc.y;
      doc.rect(350, totalY, 205, 25).fill("#0F6D5E");
      doc.fontSize(11).fillColor("white").font("Helvetica-Bold");
      doc
        .text("Grand Total:", 360, totalY + 6)
        .text(`₹${grandTotal.toFixed(2)}`, 460, totalY + 6, { align: "right" });

      doc.moveDown(2);

      // Payment Info
      doc
        .fontSize(9)
        .fillColor("#333")
        .font("Helvetica-Bold")
        .text("Payment Summary");
      doc.fontSize(8).fillColor("#666").font("Helvetica");
      doc.text(`Paid: ₹${paidAmount.toFixed(2)}`);
      doc
        .fontSize(9)
        .fillColor(dueAmount > 0 ? "#D00" : "#0A0")
        .font("Helvetica-Bold");
      doc.text(`Due: ₹${dueAmount.toFixed(2)}`);

      doc.moveDown(1.5);

      // Footer
      doc
        .fontSize(8)
        .fillColor("#999")
        .font("Helvetica")
        .text("Thank you for your business!", { align: "center" });
      doc
        .fontSize(7)
        .fillColor("#BBB")
        .text(`Generated: ${new Date().toLocaleString()}`, { align: "center" });

      doc.end();
    } catch (error) {
      console.error("[PDF Generation Error]", error);
      reject(error);
    }
  });
};

module.exports = { generateReportPDF, generateInvoicePDF };
