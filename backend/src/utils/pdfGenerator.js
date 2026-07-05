const PDFDocument = require('pdfkit');

const generateReportPDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // ============================================
      // HEADER - Lab Name & Details
      // ============================================
      doc.font('Helvetica-Bold')
         .fontSize(22)
         .fillColor('#000000')
         .text('LAXMI PATHOLOGY LAB', { align: 'center' });

      doc.moveDown(0.2);

      doc.font('Helvetica')
         .fontSize(9)
         .fillColor('#333333')
         .text('D-150, 30 FUTA ROAD, OM ENCLAVE, PART-2, FARIDABAD, HARYANA-121003', { align: 'center' });

      doc.font('Helvetica')
         .fontSize(9)
         .fillColor('#333333')
         .text('Mob.: +91-7982625884, 9871836218 | Email : bhairavjha7@gmail.com', { align: 'center' });

      doc.moveDown(0.3);

      doc.font('Helvetica-Bold')
         .fontSize(10)
         .fillColor('#000000')
         .text('LAB TIMING : 8AM TO 10 PM', { align: 'center' });

      doc.moveDown(0.3);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(1).stroke('#cccccc');
      doc.moveDown(0.5);

      // ============================================
      // PATIENT INFO - Two Column Layout
      // ============================================
      const leftX = 50;
      const rightX = 350;
      let currentY = doc.y;

      // Row 1: NAME OF PATIENT | REFERRED BY
      doc.font('Helvetica-Bold')
         .fontSize(10)
         .fillColor('#000000')
         .text('NAME OF PATIENT :', leftX, currentY, { continued: true });
      doc.font('Helvetica')
         .text(` ${data.patient?.name || 'N/A'}`);

      doc.font('Helvetica-Bold')
         .fontSize(10)
         .fillColor('#000000')
         .text('REFERRED BY :', rightX, currentY, { continued: true });
      doc.font('Helvetica')
         .text(` ${data.referredBy || 'SELF'}`);

      currentY = doc.y;
      doc.moveDown(0.2);

      // Row 2: AGE | SEX | LAB NO
      doc.font('Helvetica-Bold')
         .fontSize(10)
         .fillColor('#000000')
         .text('AGE :', 50, currentY, { continued: true });
      doc.font('Helvetica')
         .text(` ${data.patient?.age || 'N/A'} Yrs.`, { continued: true });

      doc.font('Helvetica-Bold')
         .text('SEX :', 150, currentY, { continued: true });
      doc.font('Helvetica')
         .text(` ${data.patient?.gender || 'MALE'}`, { continued: true });

      doc.font('Helvetica-Bold')
         .text('LAB NO :', 350, currentY, { continued: true });
      doc.font('Helvetica')
         .text(` ${data.reportNumber || 'N/A'}`);

      currentY = doc.y;
      doc.moveDown(0.2);

      // Row 3: DATE
      doc.font('Helvetica-Bold')
         .fontSize(10)
         .fillColor('#000000')
         .text('DATE :', 50, currentY, { continued: true });
      doc.font('Helvetica')
         .text(` ${new Date().toLocaleDateString('en-IN', { 
           day: '2-digit', 
           month: 'short', 
           year: 'numeric' 
         }).toUpperCase()}`);

      doc.moveDown(0.8);

      // ============================================
      // TEST RESULTS TABLE
      // ============================================
      const tableTop = doc.y;
      const col1 = 50;      // TEST NAME
      const col2 = 200;     // VALUE
      const col3 = 280;     // UNITS
      const col4 = 360;     // NORMAL RANGE
      const col5 = 480;     // FLAG

      // Table Header Background
      doc.rect(col1, tableTop, 500, 22).fill('#e8e8e8');

      // Table Header Text
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#000000');
      
      doc.text('TEST NAME', col1 + 8, tableTop + 6);
      doc.text('VALUE', col2 + 8, tableTop + 6);
      doc.text('UNITS', col3 + 8, tableTop + 6);
      doc.text('NORMAL RANGE', col4 + 8, tableTop + 6);

      // Table Rows
      let rowY = tableTop + 26;
      const results = data.results || [];

      results.forEach((result, index) => {
        // Alternating row colors
        const rowColor = index % 2 === 0 ? '#ffffff' : '#f5f5f5';
        
        // Row background
        doc.rect(col1, rowY, 500, 20).fill(rowColor);
        doc.rect(col1, rowY, 500, 20).stroke('#e0e0e0');

        // Row text
        doc.font('Helvetica')
           .fontSize(9)
           .fillColor('#000000');
        
        // TEST NAME
        doc.text(result.parameter || 'N/A', col1 + 8, rowY + 5);
        
        // VALUE - Bold red if abnormal
        if (result.flag && result.flag !== 'Normal') {
          doc.font('Helvetica-Bold').fillColor('#cc0000');
        } else {
          doc.font('Helvetica').fillColor('#000000');
        }
        doc.text(result.value || 'N/A', col2 + 8, rowY + 5);
        
        // UNITS
        doc.font('Helvetica').fillColor('#000000');
        doc.text(result.unit || 'N/A', col3 + 8, rowY + 5);
        
        // NORMAL RANGE
        doc.text(result.normalRange || 'N/A', col4 + 8, rowY + 5);

        // FLAG (if abnormal)
        if (result.flag && result.flag !== 'Normal') {
          doc.font('Helvetica-Bold')
             .fontSize(8)
             .fillColor('#cc0000')
             .text(result.flag, col5 + 5, rowY + 5);
        }

        rowY += 22;
      });

      doc.moveDown(1);

      // ============================================
      // FOOTER SECTION
      // ============================================
      
      // Report Collection Time
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#000000')
         .text('Report Collection Time- Evening 6 Pm To 10 Pm', { align: 'center' });

      doc.moveDown(0.2);

      // Free Home Collection
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#0066cc')
         .text('Free Home Collection Facility', { align: 'center' });

      doc.moveDown(0.3);

      // Divider
      doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(1).stroke('#cccccc');
      doc.moveDown(0.3);

      // Disclaimer
      doc.font('Helvetica')
         .fontSize(7)
         .fillColor('#666666');
      
      doc.text('Neither Laxmi Pathology Lab nor its employees/representative assume any liability for any loss or damage', { align: 'center' });
      doc.text('that may be incurred by any person as a result of presuming the meaning or content of this report.', { align: 'center' });

      doc.font('Helvetica-Bold')
         .fontSize(8)
         .fillColor('#000000')
         .text('REPORT NOT VALID FOR MEDICO LEGAL PURPOSES', { align: 'center' });

      doc.moveDown(0.8);

      // ============================================
      // SIGNATURE SECTION - Two Column
      // ============================================
      
      const signY = doc.y;

      // Left: Doctor Signature
      doc.font('Helvetica-Bold')
         .fontSize(10)
         .fillColor('#000000')
         .text('Dr. R. KUMAR', 50, signY);

      doc.font('Helvetica')
         .fontSize(8)
         .fillColor('#333333')
         .text('M.B.B.S., M.D. (Path)', 50)
         .text('Visiting Sr. Cons. Pathologist', 50);

      // Right: Lab Technician
      doc.font('Helvetica-Bold')
         .fontSize(10)
         .fillColor('#000000')
         .text('Chandan Kr. Jha', 400, signY);

      doc.font('Helvetica')
         .fontSize(8)
         .fillColor('#333333')
         .text('Lab Technician', 400);

      doc.moveDown(1.5);

      // ============================================
      // END OF REPORT
      // ============================================
      
      doc.font('Helvetica-Bold')
         .fontSize(8)
         .fillColor('#666666')
         .text('***** END OF REPORT *****', { align: 'center' });

      // Footer note
      doc.font('Helvetica')
         .fontSize(6)
         .fillColor('#999999')
         .text('This is a computer generated document. No signature required.', { align: 'center' });

      doc.end();

    } catch (error) {
      console.error('PDF Generation Error:', error);
      reject(error);
    }
  });
};

module.exports = { generateReportPDF };