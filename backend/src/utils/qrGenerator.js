const QRCode = require("qrcode");

const generateQRCode = async (data) => {
  try {
    return await QRCode.toDataURL(JSON.stringify(data), { width: 300 });
  } catch (err) {
    console.error("QR generation failed:", err.message);
    return "";
  }
};

module.exports = generateQRCode;
