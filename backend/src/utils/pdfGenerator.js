const PDFDocument = require('pdfkit');

const generateReportPDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margins: { top: 30, bottom: 30, left: 30, right: 30 }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // ============================================
      // HEADER - EXACT POSITIONING
      // ============================================
      
      // LAB NAME - Bold, Large, Centered
      doc.font('Helvetica-Bold')
         .fontSize(20)
         .fillColor('#000000')
         .text('LAXMI PATHOLOGY LAB', { align: 'center' });

      doc.moveDown(0.1);

      // Address - Smaller font, Centered
      doc.font('Helvetica')
         .fontSize(8)
         .fillColor('#333333')
         .text('D-150, 30 FUTA ROAD, OM ENCLAVE, PART-2, FARIDABAD, HARYANA-121003', { align: 'center' });

      doc.font('Helvetica')
         .fontSize(8)
         .fillColor('#333333')
         .text('Mob.: +91-7982625884, 9871836218 | Email : bhairavjha7@gmail.com', { align: 'center' });

      doc.moveDown(0.1);

      // Lab Timing
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#000000')
         .text('LAB TIMING : 8AM TO 10 PM', { align: 'center' });

      doc.moveDown(0.2);

      // Divider Line
      const lineY = doc.y;
      doc.moveTo(40, lineY)
         .lineTo(570, lineY)
         .lineWidth(0.5)
         .stroke('#999999');
      
      doc.moveDown(0.3);

      // ============================================
      // PATIENT INFO - EXACT COORDINATES
      // ============================================
      let yPos = doc.y;
      
      // Row 1: NAME OF PATIENT (Left) | REFERRED BY (Right)
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#000000')
         .text('NAME OF PATIENT :', 40, yPos, { continued: true });
      doc.font('Helvetica')
         .text(` ${data.patient?.name || 'N/A'}`);

      // REFERRED BY - Right side (X = 370)
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#000000')
         .text('REFERRED BY :', 370, yPos, { continued: true });
      doc.font('Helvetica')
         .text(` ${data.referredBy || 'SELF'}`);

      yPos = doc.y + 2;
      doc.moveDown(0.05);

      // Row 2: AGE (Left) | SEX (Middle) | LAB NO (Right)
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#000000')
         .text('AGE :', 40, yPos, { continued: true });
      doc.font('Helvetica')
         .text(` ${data.patient?.age || 'N/A'} Yrs.`, { continued: true });

      doc.font('Helvetica-Bold')
         .text('SEX :', 140, yPos, { continued: true });
      doc.font('Helvetica')
         .text(` ${data.patient?.gender || 'MALE'}`, { continued: true });

      doc.font('Helvetica-Bold')
         .text('LAB NO :', 370, yPos, { continued: true });
      doc.font('Helvetica')
         .text(` ${data.reportNumber || 'N/A'}`);

      yPos = doc.y + 2;
      doc.moveDown(0.05);

      // Row 3: DATE (Left)
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#000000')
         .text('DATE :', 40, yPos, { continued: true });
      doc.font('Helvetica')
         .text(` ${new Date().toLocaleDateString('en-IN', { 
           day: '2-digit', 
           month: 'short', 
           year: 'numeric' 
         }).toUpperCase()}`);

      doc.moveDown(0.5);

      // ============================================
      // TABLE - EXACT AS SCREENSHOT
      // ============================================
      const tableTop = doc.y;
      
      // Table Border
      doc.rect(40, tableTop, 530, 20)
         .stroke('#cccccc');
      
      // Table Header Background
      doc.rect(41, tableTop + 0.5, 528, 19)
         .fill('#e8e8e8');

      // Table Header Text - Exact positions
      doc.font('Helvetica-Bold')
         .fontSize(8)
         .fillColor('#000000');
      
      doc.text('TEST NAME', 48, tableTop + 5);
      doc.text('VALUE', 185, tableTop + 5);
      doc.text('UNITS', 270, tableTop + 5);
      doc.text('NORMAL RANGE', 340, tableTop + 5);

      // TABLE ROWS
      let rowY = tableTop + 20;
      const results = data.results || [];

      results.forEach((result, index) => {
        // Alternating row colors
        const rowColor = index % 2 === 0 ? '#ffffff' : '#f5f5f5';
        
        // Row background and border
        doc.rect(40, rowY, 530, 18)
           .fill(rowColor);
        doc.rect(40, rowY, 530, 18)
           .stroke('#cccccc');

        // Row text - exact positions
        doc.font('Helvetica')
           .fontSize(8)
           .fillColor('#000000');
        
        // TEST NAME
        doc.text(result.parameter || 'N/A', 48, rowY + 4);
        
        // VALUE - Red if abnormal
        if (result.flag && result.flag !== 'Normal') {
          doc.font('Helvetica-Bold').fillColor('#cc0000');
        } else {
          doc.font('Helvetica').fillColor('#000000');
        }
        doc.text(result.value || 'N/A', 185, rowY + 4);
        
        // UNITS
        doc.font('Helvetica').fillColor('#000000');
        doc.text(result.unit || 'N/A', 270, rowY + 4);
        
        // NORMAL RANGE
        doc.text(result.normalRange || 'N/A', 340, rowY + 4);

        // FLAG (if abnormal)
        if (result.flag && result.flag !== 'Normal') {
          doc.font('Helvetica-Bold')
             .fontSize(7)
             .fillColor('#cc0000')
             .text(result.flag, 450, rowY + 4);
        }

        rowY += 20;
      });

      // Last row border
      if (results.length > 0) {
        doc.rect(40, rowY - 2, 530, 1)
           .stroke('#cccccc');
      }

      doc.moveDown(0.8);

      // ============================================
      // FOOTER - EXACT POSITIONING
      // ============================================
      
      // Report Collection Time
      doc.font('Helvetica-Bold')
         .fontSize(8)
         .fillColor('#000000')
         .text('Report Collection Time- Evening 6 Pm To 10 Pm', { align: 'center' });

      doc.moveDown(0.1);

      // Free Home Collection
      doc.font('Helvetica-Bold')
         .fontSize(8)
         .fillColor('#0066cc')
         .text('Free Home Collection Facility', { align: 'center' });

      doc.moveDown(0.2);

      // Divider
      const footerLineY = doc.y;
      doc.moveTo(40, footerLineY)
         .lineTo(570, footerLineY)
         .lineWidth(0.5)
         .stroke('#cccccc');
      
      doc.moveDown(0.2);

      // Disclaimer - Very small font
      doc.font('Helvetica')
         .fontSize(6)
         .fillColor('#666666');
      
      doc.text('Neither Laxmi Pathology Lab nor its employees/representative assume any liability for any loss or damage', { align: 'center' });
      doc.text('that may be incurred by any person as a result of presuming the meaning or content of this report.', { align: 'center' });

      doc.font('Helvetica-Bold')
         .fontSize(7)
         .fillColor('#000000')
         .text('REPORT NOT VALID FOR MEDICO LEGAL PURPOSES', { align: 'center' });

      doc.moveDown(0.5);

      // ============================================
      // SIGNATURE - EXACT POSITIONING
      // ============================================
      const signY = doc.y;

      // LEFT: Doctor Signature
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#000000')
         .text('Dr. R. KUMAR', 40, signY);

      doc.font('Helvetica')
         .fontSize(7)
         .fillColor('#333333')
         .text('M.B.B.S., M.D. (Path)', 40)
         .text('Visiting Sr. Cons. Pathologist', 40);

      // RIGHT: Lab Technician (X = 400)
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#000000')
         .text('Chandan Kr. Jha', 400, signY);

      doc.font('Helvetica')
         .fontSize(7)
         .fillColor('#333333')
         .text('Lab Technician', 400);

      doc.moveDown(1);

      // ============================================
      // END OF REPORT
      // ============================================
      doc.font('Helvetica-Bold')
         .fontSize(8)
         .fillColor('#666666')
         .text('***** END OF REPORT *****', { align: 'center' });

      doc.end();

    } catch (error) {
      console.error('PDF Generation Error:', error);
      reject(error);
    }
  });
};

module.exports = { generateReportPDF };