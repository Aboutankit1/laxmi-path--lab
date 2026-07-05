const PDFDocument = require("pdfkit");

// Generates a lab report PDF as a Buffer
const generateReportPDF = ({ labInfo, patient, test, results, verifiedBy }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    doc.fontSize(18).fillColor("#0F6D5E").text(labInfo?.labName || "Laxmi Path Lab", { align: "center" });
    doc.fontSize(10).fillColor("#555").text(labInfo?.address || "", { align: "center" });
    doc.moveDown();
    doc.strokeColor("#0F6D5E").lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown();

    doc.fontSize(12).fillColor("#111").text(`Patient: ${patient?.name || ""}`);
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
        .text(`${r.parameter}: ${r.value} ${r.unit || ""}  (Normal: ${r.normalRange || "-"})  ${r.flag || ""}`);
    });

    doc.moveDown(2);
    doc.fontSize(10).fillColor("#555").text(`Verified by: ${verifiedBy || "Lab In-charge"}`);
    doc.text(`Generated on: ${new Date().toLocaleString()}`);

    doc.end();
  });
};

module.exports = generateReportPDF;
